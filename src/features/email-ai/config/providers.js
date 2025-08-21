// Email Provider Configuration
export const emailProviders = {
  gmail: {
    name: 'Gmail',
    icon: '/images/gmailicon.png',
    description: 'Connect to your Gmail account for intelligent email management',
    features: [
      'Smart inbox analysis',
      'AI-powered email summaries',
      'Automatic draft replies',
      'Priority email identification'
    ]
  },
  outlook: {
    name: 'Outlook',
    icon: '/images/outlookicon.png',
    description: 'Connect to your Outlook account (Coming Soon)',
    features: [
      'Smart inbox analysis',
      'AI-powered email summaries',
      'Automatic draft replies',
      'Priority email identification'
    ],
    comingSoon: true
  },
  yahoo: {
    name: 'Yahoo Mail',
    icon: '/images/yahooicon.png',
    description: 'Connect to your Yahoo Mail account (Coming Soon)',
    features: [
      'Smart inbox analysis',
      'AI-powered email summaries',
      'Automatic draft replies',
      'Priority email identification'
    ],
    comingSoon: true
  }
};

// Default scan settings
export const defaultSettings = {
  // Email scanning settings
  maxEmails: 50, // Maximum number of emails to scan
  timeRange: '7d', // Time range: 1d, 3d, 7d, 14d, 30d
  
  // AI processing settings
  aiMode: 'summary', // 'summary' or 'all-in-one'
  aiProcessingLevel: 'detailed', // 'summary', 'detailed', 'action'
  
  // Filter settings
  important: false, // Only scan important emails
  unread: false, // Only scan unread emails
  
  // Token validation
  tokenValid: false // Whether the AI email token is valid
};

// AI mode descriptions
export const aiModeDescriptions = {
  summary: {
    name: 'Summary Mode',
    description: 'AI analyzes and summarizes your emails in a structured format',
    features: [
      'Email content analysis',
      'Key point extraction',
      'Importance classification',
      'Structured summaries'
    ],
    useCase: 'Best for daily email review and organization'
  },
  'all-in-one': {
    name: 'ALL-in-One Mode',
    description: 'Complete email management with automatic draft replies',
    features: [
      'All Summary Mode features',
      'Smart reply generation',
      'Automatic draft creation',
      'Priority-based processing'
    ],
    useCase: 'Best for active email management and response automation'
  }
};

// Time range descriptions
export const timeRangeDescriptions = {
  '1d': 'Last 24 hours - Recent emails only',
  '3d': 'Last 3 days - Recent activity',
  '7d': 'Last week - Weekly review',
  '14d': 'Last 2 weeks - Bi-weekly review',
  '30d': 'Last month - Monthly review'
};

// Processing level descriptions
export const processingLevelDescriptions = {
  summary: 'Basic analysis - Email summaries and key points',
  detailed: 'Detailed analysis - In-depth insights and recommendations',
  action: 'Action-oriented - Specific action items and priorities'
}; 