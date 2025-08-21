import React, { useState, useCallback, useEffect } from 'react';
import { Navigation } from '../../../components';
import { useEmailAI } from '../hooks/useEmailAI';
import { defaultSettings } from '../config/providers';
import { OpenAIService } from '../services/OpenAIService';

const EmailAIPage = () => {
  console.log('EmailAIPage component rendering...');
  
  // Basic state for email selection
  const [availableEmails, setAvailableEmails] = useState(() => {
    const savedEmails = localStorage.getItem('emailAI_availableEmails');
    return savedEmails ? JSON.parse(savedEmails) : [];
  });

  const [selectedEmails, setSelectedEmails] = useState(() => {
    const savedSelected = localStorage.getItem('emailAI_selectedEmails');
    return savedSelected ? JSON.parse(savedSelected) : [];
  });
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  
  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  
  // Token validation state
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  
  // AI model selection
  const [aiMode, setAiMode] = useState('summary'); // 'summary' or 'all-in-one'
  
  // Load initial state from cookies
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('emailAI_settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('emailAI_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('emailAI_availableEmails', JSON.stringify(availableEmails));
  }, [availableEmails]);

  useEffect(() => {
    localStorage.setItem('emailAI_selectedEmails', JSON.stringify(selectedEmails));
  }, [selectedEmails]);
  
  // Get the email AI functionality
  const {
    isConnected,
    currentProvider,
    connectProvider,
    disconnectProvider,
    userEmail,
    createDraftReplies
  } = useEmailAI();

  // Load available emails from Gmail
  const loadAvailableEmails = useCallback(async () => {
    console.log('loadAvailableEmails called with:', {
      currentProvider: !!currentProvider,
      isConnected,
      settings
    });
    
    if (!currentProvider || !isConnected) {
      console.log('Not connected, cannot load emails');
      setAnalysisError('Please connect to Gmail first');
      return;
    }

    setIsLoadingEmails(true);
    setAnalysisError(null);
    
    try {
      console.log('Loading available emails...');
      console.log('Current settings:', settings);
      // Force maxEmails to 50 regardless of current settings
      const emailSettings = {
        maxEmails: 50, // Force load 50 emails
        timeRange: '7d',
        aiMode: 'summary',
        aiProcessingLevel: 'detailed',
        important: false,
        unread: false
      };
      console.log('Using email settings:', emailSettings);
      const emails = await currentProvider.scanEmails(emailSettings);
      console.log('Loaded emails:', emails);
      
      if (emails && emails.length > 0) {
        setAvailableEmails(emails);
        // Pre-select first few emails
        const emailsToSelect = emails.slice(0, Math.min(3, emails.length)).map(email => email.id);
        setSelectedEmails(emailsToSelect);
        console.log(`Successfully loaded ${emails.length} emails, selected ${emailsToSelect.length}`);
      } else {
        setAvailableEmails([]);
        setSelectedEmails([]);
        console.log('No emails found');
      }
    } catch (error) {
      console.error('Failed to load emails:', error);
      setAnalysisError(`Failed to load emails: ${error.message}`);
    } finally {
      setIsLoadingEmails(false);
    }
  }, [currentProvider, isConnected, settings]);

  // Validate token on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('emailAI_token');
    if (savedToken) {
      validateToken(savedToken);
    }
  }, []);

  // Prevent auto-reconnection when component mounts
  useEffect(() => {
    // Clear any existing connection state to prevent auto-popup
    if (isConnected && currentProvider) {
      console.log('Component mounted with existing connection, clearing state');
      // Don't auto-reconnect, let user manually reconnect if needed
    }
  }, []);

  // Auto-load emails when connected
  useEffect(() => {
    if (isConnected && currentProvider && availableEmails.length === 0) {
      console.log('Auto-loading emails due to connection change');
      loadAvailableEmails();
    }
  }, [isConnected, currentProvider, availableEmails.length, loadAvailableEmails]);

  // Restore connection state on page load
  useEffect(() => {
    const savedConnection = localStorage.getItem('emailAI_connected');
    const savedProvider = localStorage.getItem('emailAI_provider');
    
    if (savedConnection === 'true' && savedProvider && !isConnected) {
      console.log('Restoring previous connection state');
      // The useEmailAI hook should handle reconnection
    }
  }, [isConnected]);

  // Token validation function
  const validateToken = async (token) => {
    setIsValidatingToken(true);
    try {
      // Check if token matches environment variable
      const expectedToken = import.meta.env.VITE_AI_EMAIL_TOKEN;
      if (token === expectedToken) {
        setTokenValid(true);
        localStorage.setItem('emailAI_token', token);
        localStorage.setItem('emailAI_token_expiry', Date.now() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        console.log('Token validated successfully');
      } else {
        setTokenValid(false);
        localStorage.removeItem('emailAI_token');
        localStorage.removeItem('emailAI_token_expiry');
        console.log('Invalid token');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      setTokenValid(false);
    } finally {
      setIsValidatingToken(false);
    }
  };

  // Check token expiry
  const checkTokenExpiry = () => {
    const expiry = localStorage.getItem('emailAI_token_expiry');
    if (expiry && Date.now() > parseInt(expiry)) {
      setTokenValid(false);
      localStorage.removeItem('emailAI_token');
      localStorage.removeItem('emailAI_token_expiry');
      return false;
    }
    return true;
  };

  // Handle token input
  const handleTokenSubmit = async (e) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      await validateToken(tokenInput.trim());
      setTokenInput('');
    }
  };

  // Handle select all emails
  const handleSelectAll = useCallback(() => {
    const allEmailIds = availableEmails.map(email => email.id);
    setSelectedEmails(allEmailIds);
  }, [availableEmails]);

  // Handle email selection
  const handleEmailSelection = useCallback((emailId, isSelected) => {
    setSelectedEmails(prev => {
      if (isSelected) {
        return [...prev, emailId];
      } else {
        return prev.filter(id => id !== emailId);
      }
    });
  }, []);

  // Handle settings changes
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  }, []);

  // Handle email analysis
  const handleAnalyzeEmails = async () => {
    if (!tokenValid || !checkTokenExpiry()) {
      setAnalysisError('Valid token required for analysis');
      return;
    }

    if (selectedEmails.length === 0) {
      setAnalysisError('Please select emails to analyze');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiReport(null);

    try {
      // Filter emails based on selection
      const emailsToAnalyze = availableEmails.filter(email =>
        selectedEmails.includes(email.id)
      );
      
      console.log('Emails to analyze:', emailsToAnalyze);
      
      // Create AI service and analyze emails
      const openaiService = new OpenAIService();
      const report = await openaiService.processEmails(emailsToAnalyze, {
        aiMode: aiMode,
        maxEmails: selectedEmails.length
      });
      
      console.log('AI analysis completed:', report);
      setAiReport(report);
      
      // If using all-in-one mode, create drafts for replies
      if (aiMode === 'all-in-one' && report.repliesToGenerate && report.repliesToGenerate.length > 0) {
        console.log('Creating drafts for replies:', report.repliesToGenerate);
        
        try {
          const draftResults = await createDraftReplies(report.repliesToGenerate, emailsToAnalyze);
          console.log('Draft creation completed:', draftResults);
          
          // Update the report with draft results
          setAiReport({
            ...report,
            draftResults: draftResults
          });
        } catch (draftError) {
          console.error('Draft creation failed:', draftError);
          setAnalysisError(`Analysis completed but draft creation failed: ${draftError.message}`);
        }
      }
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAnalysisError(error.message || 'AI analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle connection
  const handleConnect = async () => {
    try {
      await connectProvider('gmail');
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  // Handle disconnect
  const handleDisconnect = async () => {
    try {
      await disconnectProvider();
      setAvailableEmails([]);
      setSelectedEmails([]);
      setAiReport(null);
      setAnalysisError(null);
    } catch (error) {
      console.error('Disconnect failed:', error);
    }
  };
  
  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <Navigation activePage="/email-ai" />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Email AI
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Intelligence</span>
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
            Connect your email account and let AI analyze your inbox for intelligent insights and automated responses.
          </p>
        </div>
        
        {/* Basic Connection Section */}
        {!isConnected ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center">
            <h2 className="text-2xl font-semibold text-black mb-6">Connect to Gmail</h2>
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center">
              <img src="/images/gmailicon.png" alt="Gmail" className="w-12 h-12" />
            </div>
            <p className="text-black mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Click the button below to securely connect your Gmail account and start using the AI email assistant.
            </p>
            <button 
              onClick={handleConnect}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg transition-all transform hover:scale-105 hover:from-blue-700 hover:to-indigo-700"
            >
              Connect to Gmail
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Connection Status */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-green-800 text-lg font-medium">
                      Connected to Gmail
                    </span>
                    {userEmail && (
                      <div className="text-green-700 text-sm mt-1">
                        {userEmail}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
              
              {/* Debug Info */}
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                <h4 className="text-sm font-medium text-green-800 mb-2">Debug Info:</h4>
                <div className="text-xs text-green-700 space-y-1">
                  <div>Provider: {currentProvider ? 'Connected' : 'Not Connected'}</div>
                  <div>Connection Status: {isConnected ? 'True' : 'False'}</div>
                  <div>Available Emails: {availableEmails.length}</div>
                  <div>Selected Emails: {selectedEmails.length}</div>
                  <div>Token Valid: {tokenValid ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>

            {/* Token Validation */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold text-black mb-6">🔐 AI Email Token Validation</h3>
              
              {!tokenValid ? (
                <div className="text-center">
                  <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
                    <h4 className="text-lg font-semibold text-red-800 mb-3">Token Required</h4>
                    <p className="text-red-700 mb-4">
                      You need a valid AI Email Token to use the email analysis functionality. 
                      This token expires in 7 days and must be reset in the .env file.
                    </p>
                  </div>
                  
                  <form onSubmit={handleTokenSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                      <input
                        type="password"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                        placeholder="Enter your AI Email Token"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isValidatingToken}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isValidatingToken ? 'Validating...' : 'Validate Token'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="text-lg font-semibold text-green-800 mb-3">✅ Token Valid</h4>
                    <p className="text-green-700">
                      Your AI Email Token is valid and ready to use. 
                      Token expires in 7 days from validation.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setTokenValid(false);
                      localStorage.removeItem('emailAI_token');
                      localStorage.removeItem('emailAI_token_expiry');
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reset Token
                  </button>
                </div>
              )}
            </div>

            {/* AI Analysis Mode */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-semibold text-black mb-6">AI Analysis Mode</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Summary Mode */}
                <div 
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    aiMode === 'summary' 
                      ? 'border-blue-500 bg-blue-50 shadow-lg' 
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => setAiMode('summary')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-black">Summary Mode</h4>
                      <p className="text-gray-600 text-sm">AI analyzes emails and provides insights without generating replies</p>
                    </div>
                    {aiMode === 'summary' && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* ALL-in-One Mode */}
                <div 
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    aiMode === 'all-in-one' 
                      ? 'border-green-500 bg-green-50 shadow-lg' 
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                  onClick={() => setAiMode('all-in-one')}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-black">ALL-in-One Mode</h4>
                      <p className="text-gray-600 text-sm">AI analyzes emails and automatically creates draft replies</p>
                    </div>
                    {aiMode === 'all-in-one' && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Email Selection */}
            {tokenValid ? (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold text-black mb-6">Select Emails for Analysis</h3>
                
                {/* Load Emails Section */}
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-blue-800">Email Loading</h4>
                    <button
                      onClick={loadAvailableEmails}
                      disabled={isLoadingEmails}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isLoadingEmails ? 'Loading...' : 'Load Emails'}
                    </button>
                  </div>
                  <p className="text-blue-700 text-sm">
                    {availableEmails.length === 0 
                      ? 'No emails loaded yet. Click the button above to load emails from your inbox.'
                      : `Loaded ${availableEmails.length} emails from your inbox.`
                    }
                  </p>
                </div>
                
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <h4 className="text-lg font-semibold text-black mb-3">Available Emails</h4>
                  {isLoadingEmails ? (
                    <div className="text-center py-4">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading emails...</p>
                    </div>
                  ) : availableEmails.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600">No emails available. Use the "Load Emails" button above to fetch emails from your inbox.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                          {selectedEmails.length} of {availableEmails.length} emails selected
                        </span>
                        <button
                          onClick={handleSelectAll}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Select All
                        </button>
                      </div>
                      {availableEmails.map(email => (
                        <div key={email.id} className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center flex-1">
                              <input
                                type="checkbox"
                                checked={selectedEmails.includes(email.id)}
                                onChange={() => handleEmailSelection(email.id, !selectedEmails.includes(email.id))}
                                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-gray-800">{email.headers?.subject || 'No Subject'}</div>
                                <div className="text-sm text-gray-600">From: {email.headers?.from || 'Unknown Sender'}</div>
                                {email.snippet && (
                                  <div className="text-xs text-gray-500 mt-1 truncate max-w-md">
                                    {email.snippet}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
                <h3 className="text-2xl font-semibold text-gray-600 mb-4">Email Selection Locked</h3>
                <p className="text-gray-500 mb-4">
                  Please validate your AI Email Token above to unlock email selection and analysis features.
                </p>
              </div>
            )}

            {/* Analysis Button */}
            {tokenValid && (
              <div className="text-center">
                <button
                  onClick={handleAnalyzeEmails}
                  disabled={selectedEmails.length === 0 || isAnalyzing}
                  className={`px-16 py-5 rounded-2xl font-semibold text-xl shadow-lg transition-all transform hover:scale-105 ${
                    selectedEmails.length > 0 && !isAnalyzing
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700' 
                      : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    `Analyze ${selectedEmails.length} Email${selectedEmails.length !== 1 ? 's' : ''} (${aiMode === 'summary' ? 'Summary' : 'ALL-in-One'} Mode)`
                  )}
                </button>
              </div>
            )}

            {/* AI Analysis Results */}
            {isAnalyzing && (
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200 text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-2xl font-semibold text-blue-800 mb-2">AI Analysis in Progress</h3>
                <p className="text-blue-700">Analyzing your selected emails with AI intelligence...</p>
              </div>
            )}

            {analysisError && (
              <div className="bg-red-50 rounded-2xl p-8 border border-red-200 text-center">
                <h3 className="text-2xl font-semibold text-red-800 mb-4">Analysis Failed</h3>
                <p className="text-red-700 mb-4">{analysisError}</p>
                <button
                  onClick={handleAnalyzeEmails}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {aiReport && (
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold text-black mb-6">AI Analysis Results</h3>
                
                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 mb-6">
                  <h4 className="text-xl font-semibold text-black mb-4">Executive Summary</h4>
                  <p className="text-black text-lg leading-relaxed">{aiReport.summary}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{aiReport.totalEmails}</div>
                      <div className="text-gray-600">Emails Analyzed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {aiReport.emailSummaries ? aiReport.emailSummaries.filter(e => e.importance === 'high').length : 0}
                      </div>
                      <div className="text-gray-600">High Priority</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {aiReport.emailSummaries ? aiReport.emailSummaries.filter(e => e.urgency === 'urgent').length : 0}
                      </div>
                      <div className="text-gray-600">Urgent</div>
                    </div>
                  </div>
                </div>

                {/* Email Details */}
                {aiReport.emailSummaries && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-black mb-4">Email Analysis Details</h4>
                    {aiReport.emailSummaries.map((email, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                Email {email.emailNumber}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                email.importance === 'high' ? 'bg-red-100 text-red-800' :
                                email.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {email.importance} Importance
                              </span>
                              {email.urgency && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  email.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                                  email.urgency === 'normal' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {email.urgency} Urgency
                                </span>
                              )}
                            </div>
                            <h5 className="text-lg font-semibold text-black mb-2">{email.subject}</h5>
                            <p className="text-gray-600 mb-2">From: {email.from}</p>
                            <p className="text-black mb-3">{email.summary}</p>
                            
                            {email.keyPoints && email.keyPoints.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-700 mb-2">Key Points:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {email.keyPoints.map((point, pointIndex) => (
                                    <li key={pointIndex} className="text-sm text-gray-600">{point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {email.actionRequired && (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                <p className="text-sm text-purple-800">
                                  <span className="font-medium">Action Required:</span> {email.actionRequired}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Overall Insights */}
                {aiReport.overallInsights && (
                  <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <h4 className="text-xl font-semibold text-black mb-4">Overall Insights & Recommendations</h4>
                    <p className="text-black text-lg leading-relaxed">{aiReport.overallInsights}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAIPage;