import { useState, useCallback, useEffect } from 'react';
import { GmailService } from '../services/providers/GmailService';
import { OpenAIService } from '../services/OpenAIService';

// Cookie utility functions
const cookieUtils = {
  setCookie: (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  },
  
  getCookie: (name) => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        try {
          return JSON.parse(c.substring(nameEQ.length, c.length));
        } catch (e) {
          return c.substring(nameEQ.length, c.length);
        }
      }
    }
    return null;
  },
  
  deleteCookie: (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
};

export const useEmailAI = () => {
  console.log('useEmailAI hook called');
  
  // Load initial state from cookies
  const [aiReport, setAiReport] = useState(() => cookieUtils.getCookie('emailAI_report') || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(() => cookieUtils.getCookie('emailAI_error') || null);
  const [currentProvider, setCurrentProvider] = useState(null); // Don't restore provider instance from cookies
  const [userEmail, setUserEmail] = useState(() => cookieUtils.getCookie('emailAI_userEmail') || null);
  const [isConnected, setIsConnected] = useState(() => cookieUtils.getCookie('emailAI_connected') || false);

  console.log('useEmailAI initial state:', {
    aiReport: !!aiReport,
    error,
    currentProvider: !!currentProvider,
    userEmail,
    isConnected
  });

  // Save state to cookies whenever it changes
  useEffect(() => {
    if (aiReport) cookieUtils.setCookie('emailAI_report', aiReport);
    if (error) cookieUtils.setCookie('emailAI_error', error);
    if (userEmail) cookieUtils.setCookie('emailAI_userEmail', userEmail);
    if (isConnected !== undefined) cookieUtils.setCookie('emailAI_connected', isConnected);
  }, [aiReport, error, userEmail, isConnected]);

  // Clear cookies when disconnecting
  const clearCookies = useCallback(() => {
    cookieUtils.deleteCookie('emailAI_report');
    cookieUtils.deleteCookie('emailAI_error');
    cookieUtils.deleteCookie('emailAI_provider');
    cookieUtils.deleteCookie('emailAI_userEmail');
    cookieUtils.deleteCookie('emailAI_connected');
  }, []);

  // Connect to email provider
  const connectProvider = useCallback(async (providerId) => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Debug information
      console.log('Connecting to email provider:', providerId);
      console.log('Environment variables check:', {
        gmailApiKey: !!import.meta.env.VITE_GMAIL_API_KEY,
        gmailClientId: !!import.meta.env.VITE_GMAIL_CLIENT_ID,
        openaiApiKey: !!import.meta.env.VITE_OPENAI_API_KEY
      });
      
      let service;
      switch (providerId) {
        case 'gmail':
          service = new GmailService();
          break;
        case 'outlook':
          // TODO: Implement Outlook service
          throw new Error('Outlook service not implemented yet');
        case 'yahoo':
          // TODO: Implement Yahoo service
          throw new Error('Yahoo service not implemented yet');
        default:
          throw new Error('Unsupported email provider');
      }
      
      await service.connect();
      setCurrentProvider(service);
      setIsConnected(true);
      
      // Save provider info to cookie (only metadata, not the instance)
      cookieUtils.setCookie('emailAI_provider', {
        type: providerId,
        connected: true,
        timestamp: new Date().toISOString()
      });
      
      // Get user Gmail address
      if (providerId === 'gmail') {
        try {
          const profile = await service.getUserProfile();
          if (profile && profile.emailAddress) {
            setUserEmail(profile.emailAddress);
            console.log('Retrieved user Gmail address:', profile.emailAddress);
          }
        } catch (profileError) {
          console.warn('Failed to get user Gmail address:', profileError);
        }
      }
      
    } catch (err) {
      console.error('Connection failure details:', err);
      setError(err.message || 'Connection failed');
      setIsConnected(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Disconnect provider
  const disconnectProvider = useCallback(async () => {
    try {
      if (currentProvider && currentProvider.disconnect) {
        await currentProvider.disconnect();
      }
      setCurrentProvider(null);
      setAiReport(null);
      setError(null);
      setIsConnected(false);
      clearCookies();
    } catch (err) {
      setError(err.message || 'Failed to disconnect');
      throw err;
    }
  }, [currentProvider, clearCookies]);

  // Scan emails - Support new AI modes
  const scanEmails = useCallback(async (settings) => {
    if (!currentProvider) {
      throw new Error('Please connect to email service first');
    }

    try {
      setError(null);
      setIsLoading(true);
      
      console.log('Starting email scan with settings:', settings);
      console.log('Current provider:', currentProvider);
      console.log('Connection status:', currentProvider.isConnected);
      
      // Scan inbox emails
      const emails = await currentProvider.scanEmails(settings);
      console.log('Scanned inbox email count:', emails.length);
      console.log('Email details:', emails);
      
      // Validate email count
      if (emails.length !== settings.maxEmails) {
        console.warn(`Expected to scan ${settings.maxEmails} emails, actually scanned ${emails.length}`);
      }
      
      if (emails.length === 0) {
        console.warn('No emails scanned, possible reasons:');
        console.warn('1. No emails in inbox');
        console.warn('2. Time range too strict');
        console.warn('3. Insufficient Gmail API permissions');
        console.warn('4. Query conditions too strict');
      }
      
      // Call AI processing
      console.log('Starting OpenAI API call, AI mode:', settings.aiMode);
      const openaiService = new OpenAIService();
      const report = await openaiService.processEmails(emails, settings);
      console.log('OpenAI API returned result:', report);
      
      // If ALL-in-One mode, create draft replies
      if (settings.aiMode === 'all-in-one' && report.repliesToGenerate && report.repliesToGenerate.length > 0) {
        console.log('ALL-in-One mode: Starting to create draft replies');
        const draftResults = await createDraftReplies(report.repliesToGenerate, emails);
        console.log('Draft creation results:', draftResults);
        
        // Update report, add draft creation results
        report.draftResults = draftResults;
        report.draftCount = draftResults.length;
      }
      
      // Set AI report
      setAiReport(report);
      
      // Verify state update
      setTimeout(() => {
        console.log('aiReport state after update:', report);
      }, 100);
      
    } catch (err) {
      console.error('Scan failure details:', err);
      setError(err.message || 'Scan failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProvider]);

  // Create draft replies
  const createDraftReplies = useCallback(async (repliesToGenerate, originalEmails) => {
    if (!currentProvider || !currentProvider.createDraftReply) {
      console.warn('Current provider does not support creating draft replies');
      return [];
    }

    try {
      console.log('Starting to create draft replies, reply count:', repliesToGenerate.length);
      console.log('Original emails:', originalEmails);
      console.log('Replies to generate:', repliesToGenerate);
      
      const draftResults = [];
      
      for (const reply of repliesToGenerate) {
        try {
          console.log('Processing reply:', reply);
          
          // Find corresponding original email - Improved matching logic
          let originalEmail = null;
          
          // Method 1: Match by email number
          if (reply.emailNumber && originalEmails[reply.emailNumber - 1]) {
            originalEmail = originalEmails[reply.emailNumber - 1];
            console.log('Found original email by email number:', originalEmail);
          }
          // Method 2: Match by subject
          else if (reply.subject) {
            originalEmail = originalEmails.find(email => 
              email.headers?.subject === reply.subject
            );
            if (originalEmail) {
              console.log('Found original email by subject:', originalEmail);
            }
          }
          // Method 3: Match by sender
          else if (reply.to) {
            originalEmail = originalEmails.find(email => 
              email.headers?.from === reply.to
            );
            if (originalEmail) {
              console.log('Found original email by sender:', originalEmail);
            }
          }
          
          if (originalEmail) {
            console.log('Found matching original email:', {
              id: originalEmail.id,
              subject: originalEmail.headers?.subject,
              from: originalEmail.headers?.from,
              threadId: originalEmail.threadId
            });
            
            const draftData = {
              to: reply.to || originalEmail.headers?.from || 'unknown@example.com',
              subject: reply.subject || `Re: ${originalEmail.headers?.subject || 'No Subject'}`,
              content: reply.content || 'No content provided',
              threadId: originalEmail.threadId,
              messageId: originalEmail.id
            };
            
            console.log('Preparing to create draft:', draftData);
            
            const draftResult = await currentProvider.createDraftReply(draftData);
            draftResults.push({
              ...draftResult,
              originalEmail: originalEmail,
              replyData: reply
            });
            
            console.log('Draft created successfully:', draftResult);
          } else {
            console.warn('No matching original email found, using default data to create draft:', reply);
            
            // If no matching email found, use reply data to create draft
            const draftData = {
              to: reply.to || 'unknown@example.com',
              subject: reply.subject || 'Draft Email',
              content: reply.content || 'No content provided',
              threadId: null,
              messageId: null
            };
            
            console.log('Using default data to create draft:', draftData);
            
            const draftResult = await currentProvider.createDraftReply(draftData);
            draftResults.push({
              ...draftResult,
              originalEmail: null,
              replyData: reply
            });
            
            console.log('Default draft created successfully:', draftResult);
          }
        } catch (error) {
          console.error('Failed to create draft reply:', error);
          // Continue processing other replies, don't interrupt entire flow
          draftResults.push({
            error: error.message,
            replyData: reply
          });
        }
      }
      
      console.log('Draft creation completed, results:', draftResults);
      return draftResults;
      
    } catch (error) {
      console.error('Batch draft reply creation failed:', error);
      throw error;
    }
  }, [currentProvider]);

  // Reset state
  const reset = useCallback(() => {
    setAiReport(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    aiReport,
    isLoading,
    error,
    currentProvider,
    userEmail,
    isConnected,
    connectProvider,
    disconnectProvider,
    scanEmails,
    createDraftReplies,
    reset
  };
}; 