# AI Email Token System

## Overview
The AI Email Token system provides secure access control to the Email AI functionality. Users must enter a valid token to enable AI Analysis features.

## How It Works

### 1. Token Storage
- **Location**: `.env` file
- **Variable Name**: `VITE_AI_EMAIL_TOKEN`
- **Example**: `VITE_AI_EMAIL_TOKEN=your_secret_token_here_12345`

### 2. Token Validation
- **Real-time**: Token is validated as user types
- **Environment Check**: Compares user input against `.env` value
- **Visual Feedback**: Green/red indicators show validation status

### 3. Expiration System
- **Duration**: 7 days
- **Renewal**: Developer must update token value in `.env`
- **Security**: Prevents unauthorized long-term access

## Developer Instructions

### Adding/Updating Token
1. **Edit `.env` file**
2. **Change `VITE_AI_EMAIL_TOKEN` value**
3. **Restart development server** (if needed)
4. **New token is immediately active**

### Token Requirements
- **Format**: Any string value
- **Length**: No specific requirements
- **Complexity**: Should be secure/random
- **Example**: `VITE_AI_EMAIL_TOKEN=abc123def456ghi789`

## User Experience

### Without Valid Token
- ❌ "Start AI Analysis" button is disabled
- ❌ Red warning message displayed
- ❌ AI features unavailable

### With Valid Token
- ✅ "Start AI Analysis" button enabled
- ✅ Green success message displayed
- ✅ Full AI functionality available

## Security Notes
- Token is stored in environment variables (not in code)
- Token validation happens client-side
- Token should be changed regularly
- Consider implementing server-side validation for production

## Troubleshooting
- **Token not working**: Check `.env` file and restart server
- **Validation errors**: Ensure token matches exactly
- **Environment issues**: Verify `VITE_` prefix is present 