// OpenAI API Service
export class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    // Use latest GPT-4o-mini model with fallback options for cost control
    this.model = 'gpt-4o-mini'; // Use GPT-4o-mini as default, best cost-performance
    this.fallbackModel = 'gpt-3.5-turbo'; // Fallback option
  }

  // Process emails
  async processEmails(emails, settings) {
    try {
      console.log('OpenAI service starting to process emails:', {
        emailCount: emails.length,
        settings: settings,
        apiKey: !!this.apiKey
      });
      
      // Build AI prompt
      const prompt = this.buildPrompt(emails, settings);
      console.log('Built prompt:', prompt);
      
      // Call OpenAI API
      const response = await this.callOpenAI(prompt);
      console.log('OpenAI API raw response:', response);
      
      // Parse AI response
      const report = this.parseAIResponse(response, emails, settings);
      console.log('Parsed report:', report);
      
      return report;
    } catch (error) {
      console.error('AI processing failed:', error);
      throw new Error('AI processing failed: ' + error.message);
    }
  }

  // Build AI prompt (optimize token usage)
  buildPrompt(emails, settings) {
    // Optimize email summaries, keep only key information
    const emailSummaries = emails.map((email, index) => {
      const from = email.headers?.from || 'Unknown';
      const subject = email.headers?.subject || 'No Subject';
      const snippet = email.snippet || 'No Content';
      const date = new Date(parseInt(email.internalDate)).toLocaleString();
      
      // Limit snippet length, reduce token usage
      const truncatedSnippet = snippet.length > 200 ? snippet.substring(0, 200) + '...' : snippet;
      
      return `Email ${index + 1}:
From: ${from}
Subject: ${subject}
Date: ${date}
Content: ${truncatedSnippet}`;
    }).join('\n\n');

    const aiMode = settings.aiMode || 'summary';
    
    let systemPrompt = '';
    let userPrompt = '';
    
    if (aiMode === 'summary') {
      systemPrompt = 'You are Alfred, an AI Executive Assistant specializing in email intelligence and productivity. Your role is to analyze inbox emails, identify priorities, and provide actionable insights. Think like a professional executive assistant who understands business context and urgency. IMPORTANT: You must respond with ONLY valid JSON. Do not include any markdown formatting, explanations, or text outside the JSON structure.';
      
      userPrompt = `Please analyze the following ${emails.length} inbox emails with executive-level insight:

${emailSummaries}

IMPORTANT: Respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

{
  "summary": "Executive summary of inbox status",
  "totalEmails": ${emails.length},
  "emailSummaries": [
    {
      "emailNumber": 1,
      "from": "Sender",
      "subject": "Subject",
      "summary": "Key points and context",
      "importance": "high",
      "keyPoints": ["Key point 1", "Key point 2"],
      "actionRequired": "Specific action needed",
      "urgency": "urgent"
    }
  ],
  "overallInsights": "Strategic insights and recommendations",
  "priorityActions": ["Action 1", "Action 2"],
  "timeSensitiveItems": ["Urgent item 1", "Urgent item 2"]
}`;
    } else if (aiMode === 'all-in-one') {
      systemPrompt = 'You are Alfred, an AI Executive Assistant who not only analyzes emails but also takes action. You are like Motion\'s AI employees - you understand context, generate professional responses, and help manage email workflow. Generate responses that are business-appropriate, professional, and actionable. Focus on emails that genuinely need replies and create responses that add value. IMPORTANT: You must respond with ONLY valid JSON. Do not include any markdown formatting, explanations, or text outside the JSON structure.';
      
      userPrompt = `Please analyze the following ${emails.length} inbox emails and act as an AI Executive Assistant:

${emailSummaries}

IMPORTANT: Respond with ONLY valid JSON. No markdown, no explanations, just pure JSON.

{
  "summary": "Executive summary with action items",
  "totalEmails": ${emails.length},
  "emailsAnalysis": [
    {
      "emailNumber": 1,
      "from": "Sender",
      "subject": "Subject",
      "summary": "Key points and context",
      "needsReply": true,
      "replyReason": "Why this email needs a response",
      "importance": "high",
      "urgency": "urgent",
      "keyPoints": ["Key point 1", "Key point 2"],
      "businessContext": "Business context and implications"
    }
  ],
  "repliesToGenerate": [
    {
      "emailNumber": 1,
      "to": "Recipient email",
      "subject": "Re: Original Subject",
      "content": "Professional, actionable response content that addresses the email purpose and adds value. Keep it concise but comprehensive.",
      "tone": "professional",
      "priority": "high",
      "actionItems": ["Action item 1", "Action item 2"],
      "followUp": "Suggested follow-up actions"
    }
  ],
  "overallInsights": "Strategic insights and workflow recommendations",
  "replySummary": "Reply summary: Drafts generated for X emails requiring responses",
  "productivityMetrics": {
    "emailsNeedingAction": "X emails require immediate attention",
    "estimatedTimeSaved": "Estimated time saved with AI assistance",
    "priorityDistribution": "High/Medium/Low priority breakdown"
  }
}`;
    }

    return {
      system: systemPrompt,
      user: userPrompt
    };
  }

  // Call OpenAI API (intelligent model selection)
  async callOpenAI(prompt) {
    try {
      // Validate API key
      if (!this.apiKey) {
        throw new Error('OpenAI API key is missing. Please check VITE_OPENAI_API_KEY environment variable');
      }

      // Intelligent model selection: choose most suitable model based on email count and complexity
      const model = this.selectOptimalModel(prompt.user.length, this.model);
      
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: prompt.system },
            { role: 'user', content: prompt.user }
          ],
          max_tokens: 1500,
          temperature: 0.3,
          response_format: { type: "json_object" } // Force JSON response
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenAI API error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('OpenAI API response data:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected API response structure:', data);
        throw new Error('Unexpected API response structure');
      }
      
      const aiResponse = data.choices[0].message.content;
      console.log('AI response content:', aiResponse);
      
      return aiResponse;
    } catch (error) {
      console.error('OpenAI API call failed:', error);
      throw new Error('OpenAI API call failed: ' + error.message);
    }
  }

  // Parse AI response
  parseAIResponse(aiResponse, emails, settings) {
    try {
      console.log('Raw AI response:', aiResponse);
      
      // Clean the response - remove any markdown formatting
      let cleanedResponse = aiResponse;
      if (typeof cleanedResponse === 'string') {
        // Remove markdown code blocks
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
        // Remove any leading/trailing whitespace
        cleanedResponse = cleanedResponse.trim();
      }
      
      console.log('Cleaned response:', cleanedResponse);
      
      // Try to parse JSON response
      const parsed = JSON.parse(cleanedResponse);
      console.log('Parsed JSON:', parsed);
      
      // Calculate estimated cost
      const estimatedCost = this.calculateCost(emails.length, settings.aiProcessingLevel);
      
      // Create a robust response object with fallbacks
      const robustResponse = {
        summary: parsed.summary || 'AI analysis completed successfully',
        totalEmails: emails.length,
        estimatedCost: estimatedCost.toFixed(2),
        
        // Summary mode fields
        emailSummaries: parsed.emailSummaries || emails.map((email, index) => ({
          emailNumber: index + 1,
          from: email.headers?.from || 'Unknown',
          subject: email.headers?.subject || 'No Subject',
          summary: email.snippet || 'No content available',
          importance: 'medium',
          keyPoints: ['Content analysis completed'],
          actionRequired: 'Review recommended',
          urgency: 'normal'
        })),
        
        // All-in-one mode fields
        emailsAnalysis: parsed.emailsAnalysis || parsed.emailSummaries || [],
        repliesToGenerate: parsed.repliesToGenerate || [],
        replySummary: parsed.replySummary || 'No replies need to be generated',
        
        // Additional fields
        overallInsights: parsed.overallInsights || 'AI analysis completed with insights',
        priorityActions: parsed.priorityActions || [],
        timeSensitiveItems: parsed.timeSensitiveItems || [],
        productivityMetrics: parsed.productivityMetrics || {
          emailsNeedingAction: `${emails.length} emails reviewed`,
          estimatedTimeSaved: '5-10 minutes per email',
          priorityDistribution: 'Mixed priority levels'
        }
      };
      
      console.log('Robust response created:', robustResponse);
      return robustResponse;
      
    } catch (error) {
      console.error('AI response parsing failed:', error);
      console.error('Failed response content:', aiResponse);
      
      // Create a comprehensive fallback response
      const fallbackResponse = {
        summary: 'AI analysis completed, but response format parsing failed. Using fallback analysis.',
        totalEmails: emails.length,
        estimatedCost: this.calculateCost(emails.length, settings.aiProcessingLevel).toFixed(2),
        
        // Create fallback email summaries
        emailSummaries: emails.map((email, index) => ({
          emailNumber: index + 1,
          from: email.headers?.from || 'Unknown',
          subject: email.headers?.subject || 'No Subject',
          summary: email.snippet || 'No content available',
          importance: 'medium',
          keyPoints: ['Email content available', 'Requires manual review'],
          actionRequired: 'Manual review recommended',
          urgency: 'normal'
        })),
        
        // Fallback for all-in-one mode
        emailsAnalysis: emails.map((email, index) => ({
          emailNumber: index + 1,
          from: email.headers?.from || 'Unknown',
          subject: email.headers?.subject || 'No Subject',
          summary: email.snippet || 'No content available',
          needsReply: false,
          replyReason: 'Manual review required',
          importance: 'medium',
          urgency: 'normal',
          keyPoints: ['Content available for review'],
          businessContext: 'Requires human assessment'
        })),
        
        repliesToGenerate: [],
        replySummary: 'No automatic replies generated due to parsing error',
        overallInsights: 'AI analysis encountered a format issue. Please review emails manually and try again.',
        priorityActions: ['Review all emails manually', 'Check for urgent items', 'Consider re-running analysis'],
        timeSensitiveItems: [],
        productivityMetrics: {
          emailsNeedingAction: `${emails.length} emails require manual review`,
          estimatedTimeSaved: '0 minutes (fallback mode)',
          priorityDistribution: 'Manual assessment required'
        }
      };
      
      console.log('Fallback response created:', fallbackResponse);
      return fallbackResponse;
    }
  }

  // Intelligent optimal model selection
  selectOptimalModel(inputLength, preferredModel) {
    // Choose most suitable model based on input length and complexity
    const inputTokens = Math.ceil(inputLength / 4); // Rough token count estimation
    
    if (inputTokens < 1000 && preferredModel === 'gpt-4o-mini') {
      // Simple tasks use GPT-3.5-turbo, lower cost
      return 'gpt-3.5-turbo';
    } else if (inputTokens > 3000) {
      // Complex tasks use GPT-4o-mini, better results
      return 'gpt-4o-mini';
    } else {
      // Medium complexity uses preferred model
      return preferredModel;
    }
  }

  // Calculate estimated cost (based on intelligent model selection)
  calculateCost(emailCount, processingLevel) {
    // Base cost: GPT-3.5-turbo $0.0005/1K tokens, GPT-4o-mini $0.00015/1K input + $0.0006/1K output
    const baseCostPerEmail = 0.004; // Average cost (considering model selection)
    let multiplier = 1;
    
    switch (processingLevel) {
      case 'summary':
        multiplier = 1; // Basic analysis
        break;
      case 'detailed':
        multiplier = 1.3; // Detailed analysis, 30% cost increase
        break;
      case 'action':
        multiplier = 1.6; // Action recommendations, 60% cost increase
        break;
      default:
        multiplier = 1;
    }
    
    return emailCount * baseCostPerEmail * multiplier;
  }

  // Generate reply suggestions
  async generateReply(email, context) {
    try {
      const prompt = {
        system: 'You are a professional email assistant. Please generate appropriate replies based on email content and context.',
        user: `Please generate a reply for the following email:

Original Email:
From: ${email.headers?.from || 'Unknown'}
Subject: ${email.headers?.subject || 'No Subject'}
Content: ${email.snippet || 'No Content'}

Context: ${context}

Please generate a professional, polite, and targeted reply.`
      };

      const response = await this.callOpenAI(prompt);
      return response;
    } catch (error) {
      console.error('Failed to generate reply:', error);
      throw new Error('Failed to generate reply: ' + error.message);
    }
  }
} 