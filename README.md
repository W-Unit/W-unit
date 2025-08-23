# Email AI - Frontend Framework Production Ready

<img width="960" height="507" alt="1" src="https://github.com/user-attachments/assets/ff7865d2-e3c3-4fa2-9217-4210ebdfad50" />

A professional email management application powered by AI that intelligently analyzes inbox emails and provides automated responses.

## 🚀 Features

### Core Functionality
- **Smart Email Analysis**: AI-powered inbox scanning and intelligent categorization
- **Dual AI Modes**: 
  - **Summary Mode**: Structured email summaries with key insights
  - **ALL-in-One Mode**: Complete analysis + automatic draft reply generation
- **Gmail Integration**: Secure OAuth2 connection with Gmail API
- **Intelligent Draft Creation**: AI-generated professional reply drafts
- **Cost Optimization**: Smart model selection to minimize API costs

### Technical Features
- **Multi-Layer Email Retrieval**: Robust inbox scanning with fallback strategies
- **UTF-8 Character Support**: Full support for international characters and emojis
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Modern, mobile-friendly UI with Tailwind CSS
- **Production Ready**: Clean, maintainable codebase ready for deployment

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4o-mini / GPT-3.5-turbo
- **Email Services**: Gmail API with Google Identity Services
- **Authentication**: OAuth2 with secure token management
- **Build Tool**: Vite for fast development and optimized builds

## 📋 Prerequisites

### Environment Variables
Create a `.env` file in your project root with the following variables:

```env
# Gmail API Configuration
VITE_GMAIL_API_KEY=your_gmail_api_key_here
VITE_GMAIL_CLIENT_ID=your_gmail_client_id_here

# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# AI Email Token (for production access control)
VITE_AI_EMAIL_TOKEN=your_secure_token_here
```

### Gmail API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Gmail API
4. Create OAuth 2.0 credentials
5. Configure OAuth consent screen
6. Add authorized redirect URIs

### OpenAI API Setup
1. Sign up at [OpenAI Platform](https://platform.openai.com/)
2. Generate API key
3. Add billing information for API usage

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd email-ai-intelligence
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your actual API keys and tokens
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm run preview
```

## 📱 Usage

### Initial Setup
1. **Connect to Gmail**: Click "Connect to Gmail" and authorize access
2. **Configure Settings**: Set email count, time range, and AI mode
3. **Enter Token**: Provide valid AI Email Token for analysis access
4. **Start Analysis**: Click "Start AI Analysis" to begin processing

### AI Modes

#### Summary Mode
- Analyzes inbox emails for key insights
- Provides structured summaries with importance classification
- Identifies urgent and important emails
- Extracts key points and action items

#### ALL-in-One Mode
- All Summary Mode features
- Automatically generates reply drafts for emails needing responses
- Creates Gmail drafts for manual review and editing
- Provides comprehensive email management workflow

### Configuration Options
- **Time Range**: 1 day to 1 month email scanning
- **Email Count**: 1-10 emails per scan (recommended: 5-8)
- **Processing Level**: Basic, detailed, or action-oriented analysis
- **AI Model**: Automatic selection between GPT-4o-mini and GPT-3.5-turbo

## 🔧 Architecture

### Service Layer
- **GmailService**: Handles Gmail API integration and email operations
- **OpenAIService**: Manages AI processing and response generation
- **useEmailAI**: React hook for state management and business logic

### Component Structure
- **EmailAIPage**: Main application interface
- **ScanSettings**: Configuration and settings management
- **AIReport**: Results display and analysis presentation

### Data Flow
1. User connects to Gmail via OAuth2
2. Application scans inbox based on configured settings
3. Emails are processed by OpenAI API with intelligent model selection
4. Results are displayed with actionable insights
5. Draft replies are automatically created in Gmail (ALL-in-One mode)

## 🔒 Security & Privacy

- **OAuth2 Authentication**: Secure Gmail access without password storage
- **Token Validation**: Production access control via AI Email Token
- **Data Privacy**: No email content stored on external servers
- **API Security**: Secure API key management via environment variables

## 💰 Cost Management

### OpenAI API Costs
- **GPT-3.5-turbo**: $0.0005 per 1K input tokens, $0.0015 per 1K output tokens
- **GPT-4o-mini**: $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
- **Smart Model Selection**: Automatic cost optimization based on task complexity

### Estimated Costs
- **Summary Mode**: ~$0.02-0.05 per email analysis
- **ALL-in-One Mode**: ~$0.03-0.08 per email (including reply generation)
- **Monthly Usage**: $5-20 for typical business email volume

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment with automatic builds
- **Netlify**: Simple drag-and-drop deployment
- **AWS S3 + CloudFront**: Static hosting with CDN
- **Docker**: Containerized deployment for enterprise environments

### Environment Configuration
Ensure all environment variables are properly configured in your production environment:
- Gmail API credentials
- OpenAI API key
- AI Email Token for access control

## 🐛 Troubleshooting

### Common Issues

#### Connection Problems
- Verify Gmail API credentials are correct
- Check OAuth consent screen configuration
- Ensure redirect URIs match your deployment URL

#### Email Retrieval Issues
- Confirm Gmail account has emails in inbox
- Check API quotas and rate limits
- Verify OAuth scopes include necessary permissions

#### AI Processing Errors
- Validate OpenAI API key and billing status
- Check API rate limits and quotas
- Verify AI Email Token is correct

#### Draft Creation Failures
- Ensure Gmail API has compose permissions
- Check for non-Latin1 characters in email content
- Verify OAuth token hasn't expired

### Debug Information
- Check browser console for detailed error logs
- Verify environment variables are loaded correctly
- Monitor API response status codes and error messages

## 📈 Performance Optimization

### Email Processing
- Intelligent model selection based on content complexity
- Optimized token usage with content truncation
- Efficient email filtering and validation

### User Experience
- Responsive design for all device sizes
- Loading states and progress indicators
- Comprehensive error handling and user feedback

## 🔮 Future Enhancements

### Planned Features
- **Outlook Integration**: Microsoft 365 email support
- **Yahoo Mail Support**: Additional email provider
- **Advanced Analytics**: Email patterns and productivity insights
- **Team Collaboration**: Shared email management features
- **Custom AI Prompts**: User-defined analysis criteria

### Technical Improvements
- **Caching Layer**: Redis integration for performance
- **Webhook Support**: Real-time email notifications
- **Advanced Filtering**: Custom email classification rules
- **API Rate Limiting**: Intelligent request throttling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For technical support or feature requests:
- Create an issue in the GitHub repository
- Contact the development team
- Check the troubleshooting section above

---

**Email AI Intelligence** - Transforming email management with AI-powered insights and automation.
