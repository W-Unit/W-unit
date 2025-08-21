// Gmail API Service - Using Google Identity Services
export class GmailService {
  constructor() {
    this.isConnected = false;
    this.accessToken = null;
    this.userId = 'me';
    this.clientId = import.meta.env.VITE_GMAIL_CLIENT_ID;
    this.apiKey = import.meta.env.VITE_GMAIL_API_KEY;
  }

  // Connect to Gmail
  async connect() {
    try {
      // Validate environment variables
      if (!this.clientId) {
        throw new Error('Gmail Client ID is missing. Please check VITE_GMAIL_CLIENT_ID environment variable');
      }

      if (!this.apiKey) {
        throw new Error('Gmail API Key is missing. Please check VITE_GMAIL_API_KEY environment variable');
      }

      // Initialize Google Identity Services
      await this.initializeGoogleIdentity();
      
      // Get access token
      const token = await this.getAccessToken();
      
      if (token) {
        this.accessToken = token;
        this.isConnected = true;
        return true;
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Gmail connection failed:', error);
      throw new Error('Gmail connection failed: ' + (error?.message || 'Unknown error'));
    }
  }

  // Initialize Google Identity Services
  async initializeGoogleIdentity() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.accounts) {
        resolve();
        return;
      }

      // Load new Google Identity Services library
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.google && window.google.accounts) {
          resolve();
        } else {
          reject(new Error('Failed to load Google Identity Services library'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Unable to load Google Identity Services library'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Get access token
  async getAccessToken() {
    return new Promise((resolve, reject) => {
      try {
        const client = google.accounts.oauth2.initTokenClient({
          client_id: this.clientId,
          scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose',
          callback: (response) => {
            if (response.error) {
              reject(new Error(response.error_description || response.error));
            } else {
              resolve(response.access_token);
            }
          }
        });

        client.requestAccessToken();
      } catch (error) {
        reject(new Error('Failed to initialize OAuth client: ' + error.message));
      }
    });
  }

  // Scan emails - Focus on inbox emails
  async scanEmails(settings) {
    if (!this.isConnected || !this.accessToken) {
      throw new Error('Please connect to Gmail first');
    }

    try {
      console.log('Starting inbox email scan with settings:', settings);
      
      // Use improved inbox email retrieval method
      let emails = await this.getInboxEmails(settings.maxEmails);
      console.log(`Inbox email retrieval result: ${emails.length} emails`);
      
      // Validate email labels
      if (emails.length > 0) {
        console.log('Email label validation:');
        emails.forEach((email, index) => {
          const labels = email.labelIds || [];
          console.log(`Email ${index + 1}:`, {
            subject: email.headers?.subject || 'No Subject',
            labels: labels,
            isInbox: labels.includes('INBOX'),
            isSent: labels.includes('SENT'),
            isDraft: labels.includes('DRAFT')
          });
        });
      }
      
      return emails;
      
    } catch (error) {
      console.error('Email scanning failed:', error);
      throw new Error('Email scanning failed: ' + (error?.message || 'Unknown error'));
    }
  }

  // Helper method to fetch emails
  async fetchEmails(query, maxResults) {
    try {
      console.log(`fetchEmails called with query: "${query}" and maxResults: ${maxResults}`);
      
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gmail API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Gmail API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const messages = data.messages || [];
      
      console.log(`Gmail API response: ${messages.length} messages returned (requested: ${maxResults})`);
      console.log('Gmail API response data:', data);
      
      console.log(`Query "${query}" returned ${messages.length} messages`);
      
      if (messages.length === 0) {
        return [];
      }
      
      // Get email details
      const emailPromises = messages.map(message => 
        this.getEmailDetails(message.id)
      );
      
      const emails = await Promise.all(emailPromises);
      
      // Filter out invalid emails
      const validEmails = emails.filter(email => email !== null);
      
      console.log(`Successfully retrieved ${validEmails.length} email details`);
      
      return validEmails;
    } catch (error) {
      console.error(`Query "${query}" failed:`, error);
      return [];
    }
  }

  // Get email details
  async getEmailDetails(messageId) {
    try {
      const response = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get email details: ${response.status}`);
      }

      const message = await response.json();
      
      return {
        id: message.id,
        threadId: message.threadId,
        labelIds: message.labelIds || [],
        snippet: message.snippet,
        internalDate: message.internalDate,
        payload: this.parsePayload(message.payload),
        headers: this.parseHeaders(message.payload?.headers || [])
      };
    } catch (error) {
      console.error('Failed to get email details:', error);
      return null;
    }
  }

  // Build query conditions
  buildQuery(settings) {
    let query = '';
    
    // Time range
    if (settings.timeRange) {
      const days = this.parseTimeRange(settings.timeRange);
      if (days > 0) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        const dateStr = date.toISOString().split('T')[0];
        query += ` after:${dateStr}`;
      }
    }

    // Important emails
    if (settings.important) {
      query += ' is:important';
    }

    // Unread emails
    if (settings.unread) {
      query += ' is:unread';
    }

    return query.trim();
  }

  // Build inbox query conditions - Fixed overly strict queries
  buildInboxQuery(settings) {
    // Use Gmail label system to ensure only inbox emails are scanned
    let query = 'label:INBOX'; // Use labels instead of in:inbox
    
    // Time range - only add if time range is set
    if (settings.timeRange && settings.timeRange !== '30d') {
      const days = this.parseTimeRange(settings.timeRange);
      if (days > 0) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        const dateStr = date.toISOString().split('T')[0];
        query += ` after:${dateStr}`;
      }
    }
    
    // Exclude spam and deleted emails
    query += ' -label:SPAM -label:TRASH';
    
    // Sort by time, newest emails first
    query += ' order:newer';
    
    console.log('Built inbox query:', query);
    return query.trim();
  }

  // Get inbox emails - Using label system
  async getInboxEmails(maxResults) {
    try {
      console.log('getInboxEmails called with maxResults:', maxResults);
      console.log('Using label system to get inbox emails...');
      
      // Force use of most reliable inbox query method
      let emails = [];
      
      // Method 1: Force use of label:INBOX (most reliable)
      console.log('Trying method 1: label:INBOX with maxResults:', maxResults);
      let query = 'label:INBOX order:newer';
      emails = await this.fetchEmails(query, maxResults);
      console.log(`label:INBOX query result: ${emails.length} emails (requested: ${maxResults})`);
      
      // Validate returned emails are really inbox emails
      if (emails.length > 0) {
        console.log('Validating inbox email labels:');
        emails.forEach((email, index) => {
          const labels = email.labelIds || [];
          console.log(`Email ${index + 1}:`, {
            subject: email.headers?.subject || 'No Subject',
            labels: labels,
            isInbox: labels.includes('INBOX'),
            isSent: labels.includes('SENT'),
            isDraft: labels.includes('DRAFT'),
            isSpam: labels.includes('SPAM'),
            isTrash: labels.includes('TRASH')
          });
        });
        
        // Filter to ensure only inbox emails are returned
        const inboxEmails = emails.filter(email => {
          const labels = email.labelIds || [];
          return labels.includes('INBOX') && 
                 !labels.includes('SENT') && 
                 !labels.includes('DRAFT') && 
                 !labels.includes('SPAM') && 
                 !labels.includes('TRASH');
        });
        
        console.log(`After filtering, confirmed inbox emails: ${inboxEmails.length}`);
        return inboxEmails;
      }
      
      // Method 2: If method 1 fails, try using in:inbox
      if (emails.length === 0) {
        console.log('Method 1 no results, trying method 2: in:inbox');
        query = 'in:inbox order:newer';
        emails = await this.fetchEmails(query, maxResults);
        console.log(`in:inbox query result: ${emails.length} emails`);
        
        if (emails.length > 0) {
          // Same validation and filtering
          const inboxEmails = emails.filter(email => {
            const labels = email.labelIds || [];
            return labels.includes('INBOX') && 
                   !labels.includes('SENT') && 
                   !labels.includes('DRAFT') && 
                   !labels.includes('SPAM') && 
                   !labels.includes('TRASH');
          });
          
          console.log(`Method 2 filtered inbox emails: ${inboxEmails.length}`);
          return inboxEmails;
        }
      }
      
      // Method 3: If both fail, try getting all emails and strictly filter
      if (emails.length === 0) {
        console.log('Methods 1 and 2 no results, trying method 3: get all emails and strictly filter');
        query = 'order:newer';
        const allEmails = await this.fetchEmails(query, maxResults * 3); // Get more emails for filtering
        
        console.log(`Retrieved all emails: ${allEmails.length}, starting strict filtering...`);
        
        // Strictly filter inbox emails
        emails = allEmails.filter(email => {
          const labels = email.labelIds || [];
          const isInbox = labels.includes('INBOX');
          const isNotSent = !labels.includes('SENT');
          const isNotDraft = !labels.includes('DRAFT');
          const isNotSpam = !labels.includes('SPAM');
          const isNotTrash = !labels.includes('TRASH');
          
          const isValid = isInbox && isNotSent && isNotDraft && isNotSpam && isNotTrash;
          
          if (!isValid) {
            console.log(`Email filtered out:`, {
              subject: email.headers?.subject || 'No Subject',
              labels: labels,
              reason: !isInbox ? 'Not inbox' : 
                     !isNotSent ? 'Is sent' :
                     !isNotDraft ? 'Is draft' :
                     !isNotSpam ? 'Is spam' :
                     !isNotTrash ? 'Is trash' : 'Unknown reason'
            });
          }
          
          return isValid;
        });
        
        console.log(`After strict filtering, inbox emails: ${emails.length}`);
      }
      
      // Method 4: If still no emails, try most basic queries
      if (emails.length === 0) {
        console.log('Methods 1-3 no results, trying method 4: most basic queries');
        
        // Try different query strategies
        const basicQueries = [
          'in:inbox',
          'label:INBOX',
          'category:primary',
          'is:inbox',
          'has:userlabels'
        ];
        
        for (const basicQuery of basicQueries) {
          console.log(`Trying query: ${basicQuery}`);
          const basicEmails = await this.fetchEmails(basicQuery, maxResults);
          console.log(`Query "${basicQuery}" result: ${basicEmails.length} emails`);
          
          if (basicEmails.length > 0) {
            // Try to filter out possible inbox emails
            const possibleInboxEmails = basicEmails.filter(email => {
              const labels = email.labelIds || [];
              // Relax filtering conditions, just ensure not obviously non-inbox
              return !labels.includes('SENT') && 
                     !labels.includes('DRAFT') && 
                     !labels.includes('SPAM') && 
                     !labels.includes('TRASH');
            });
            
            if (possibleInboxEmails.length > 0) {
              console.log(`Method 4 found possible inbox emails: ${possibleInboxEmails.length}`);
              return possibleInboxEmails;
            }
          }
        }
      }
      
      // If all methods fail, return empty array
      console.warn('All inbox query methods failed, no emails found');
      return emails;
    } catch (error) {
      console.error('Failed to get inbox emails:', error);
      return [];
    }
  }

  // Parse time range
  parseTimeRange(timeRange) {
    const timeMap = {
      '1d': 1,
      '3d': 3,
      '7d': 7,
      '14d': 14,
      '30d': 30
    };
    return timeMap[timeRange] || 7;
  }

  // Parse email payload
  parsePayload(payload) {
    if (!payload) return null;

    const result = {
      mimeType: payload.mimeType,
      body: null,
      parts: []
    };

    if (payload.body && payload.body.data) {
      result.body = this.decodeBody(payload.body.data);
    }

    if (payload.parts) {
      result.parts = payload.parts.map(part => this.parsePayload(part));
    }

    return result;
  }

  // Parse email headers
  parseHeaders(headers) {
    const result = {};
    headers.forEach(header => {
      result[header.name.toLowerCase()] = header.value;
    });
    return result;
  }

  // Decode email content
  decodeBody(data) {
    try {
      return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (error) {
      return data;
    }
  }

  // Send email
  async sendEmail(emailData) {
    if (!this.isConnected || !this.accessToken) {
      throw new Error('Please connect to Gmail first');
    }

    try {
      const email = this.buildEmail(emailData);
      const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            raw: encodedEmail
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send email: ' + (error?.message || 'Unknown error'));
    }
  }

  // Create draft reply - Fixed draft creation issues
  async createDraftReply(emailData) {
    if (!this.isConnected || !this.accessToken) {
      throw new Error('Please connect to Gmail first');
    }

    try {
      console.log('Starting to create draft reply:', emailData);
      
      // Ensure we have valid content
      if (!emailData.content || emailData.content.trim() === '') {
        throw new Error('Email content is required for draft creation');
      }
      
      // Build email content with proper structure
      const message = {
        raw: this.encodeEmail({
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.content,
          threadId: emailData.threadId || null,
          inReplyTo: emailData.messageId || null
        })
      };
      
      // If thread ID exists, add to message
      if (emailData.threadId) {
        message.threadId = emailData.threadId;
      }
      
      console.log('Built email message for draft:', message);
      
      // Create draft - Using correct Gmail API endpoint
      const draftResponse = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/drafts',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message
          })
        }
      );

      if (!draftResponse.ok) {
        const errorText = await draftResponse.text();
        console.error(`Failed to create draft: ${draftResponse.status} ${draftResponse.statusText}`, errorText);
        
        // Try to parse error details
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error && errorData.error.message) {
            throw new Error(`Gmail API error: ${errorData.error.message}`);
          }
        } catch (parseError) {
          // If cannot parse JSON, use original error text
        }
        
        throw new Error(`Failed to create draft: ${draftResponse.status} ${draftResponse.statusText}`);
      }

      const draft = await draftResponse.json();
      console.log('Draft created successfully:', draft);
      
      // Verify draft was really created successfully
      if (!draft.id) {
        throw new Error('Draft creation failed: No draft ID returned');
      }
      
      return {
        id: draft.id,
        message: draft.message,
        threadId: draft.message?.threadId,
        status: 'created'
      };
    } catch (error) {
      console.error('Failed to create draft reply:', error);
      throw new Error('Failed to create draft reply: ' + (error?.message || 'Unknown error'));
    }
  }

  // Build email content - Support replies
  buildEmail({ to, subject, body, threadId = null, inReplyTo = null }) {
    const email = {
      raw: this.encodeEmail({
        to: to,
        subject: subject,
        body: body,
        threadId: threadId,
        inReplyTo: inReplyTo
      })
    };
    
    // If thread ID exists, add to email
    if (threadId) {
      email.threadId = threadId;
    }
    
    console.log('Built email object:', email);
    return email;
  }

  // Encode email content - Fixed non-Latin1 character issues
  encodeEmail({ to, subject, body, threadId, inReplyTo }) {
    const emailLines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      ''
    ];
    
    // If it's a reply email, add necessary header information
    if (inReplyTo) {
      emailLines.splice(2, 0, `In-Reply-To: ${inReplyTo}`);
      emailLines.splice(2, 0, `References: ${inReplyTo}`);
    }
    
    // Add email body with proper formatting
    emailLines.push(body);
    
    const emailText = emailLines.join('\r\n');
    console.log('Encoded email content:', emailText);
    
    // Fix: Use UTF-8 encoding to handle non-Latin1 characters
    try {
      // Method 1: Try direct btoa
      return btoa(emailText).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (error) {
      console.log('btoa failed, using UTF-8 encoding:', error.message);
      
      // Method 2: Use TextEncoder for UTF-8 characters
      try {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(emailText);
        const binaryString = Array.from(bytes, byte => String.fromCharCode(byte)).join('');
        return btoa(binaryString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } catch (utf8Error) {
        console.log('UTF-8 encoding also failed, using ASCII encoding:', utf8Error.message);
        
        // Method 3: Convert to ASCII-safe characters
        const asciiText = emailText
          .replace(/[^\x00-\x7F]/g, (char) => {
            // Convert non-ASCII characters to HTML entities or Unicode escapes
            return `[${char.charCodeAt(0).toString(16).toUpperCase()}]`;
          });
        
        return btoa(asciiText).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
    }
  }

  // Disconnect
  async disconnect() {
    try {
      // Clear access token
      this.accessToken = null;
      this.isConnected = false;
      
      // If Google account instance exists, try to logout
      if (window.google && window.google.accounts) {
        try {
          google.accounts.oauth2.revoke(this.accessToken);
        } catch (error) {
          console.log('Error during logout (this is normal):', error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to disconnect Gmail:', error);
      throw new Error('Failed to disconnect: ' + (error?.message || 'Unknown error'));
    }
  }

  // Check connection status
  isConnected() {
    return this.isConnected;
  }

  // Get user Gmail address
  async getUserProfile() {
    if (!this.isConnected || !this.accessToken) {
      throw new Error('Please connect to Gmail first');
    }

    try {
      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/profile',
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get user info: ${response.status}`);
      }

      const profile = await response.json();
      console.log('Retrieved user info:', profile);
      return profile;
    } catch (error) {
      console.error('Failed to get user info:', error);
      return null;
    }
  }
}