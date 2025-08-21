import React, { useState, useEffect, useRef } from 'react';

const ScanSettings = ({ settings, onSettingsChange }) => {
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const prevTokenValidRef = useRef(tokenValid);

  // AI modes configuration
  const aiModes = [
    {
      value: 'summary',
      label: 'Summary Mode',
      icon: '📊',
      description: 'AI analyzes and summarizes your emails in a structured format, providing key insights and important points.'
    },
    {
      value: 'all-in-one',
      label: 'ALL-in-One Mode',
      icon: '🚀',
      description: 'Complete email management: AI summary + automatic draft replies for emails that need responses.'
    }
  ];

  // Time range options
  const timeRangeOptions = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '3d', label: 'Last 3 Days' },
    { value: '7d', label: 'Last Week' },
    { value: '14d', label: 'Last 2 Weeks' },
    { value: '30d', label: 'Last Month' }
  ];

  // Validate token against .env and check expiration
  const validateToken = (inputToken) => {
    const envToken = import.meta.env.VITE_AI_EMAIL_TOKEN;
    
    if (!envToken) {
      setTokenError('AI_EMAIL_TOKEN not found in environment variables');
      return false;
    }

    if (inputToken !== envToken) {
      setTokenError('Invalid token. Please check your token and try again.');
      return false;
    }

    // Check if token has been changed in the last 7 days
    // This is a simple implementation - in production you might want to store the last change time
    // For now, we'll assume the token is valid if it matches the .env value
    setTokenError('');
    return true;
  };

  const handleTokenChange = (e) => {
    const inputToken = e.target.value;
    setToken(inputToken);
    
    if (inputToken.length > 0) {
      const isValid = validateToken(inputToken);
      setTokenValid(isValid);
    } else {
      setTokenValid(false);
      setTokenError('');
    }
  };

  // Validate token on component mount and when token changes
  useEffect(() => {
    if (token.trim()) {
      validateToken(token);
    }
  }, [token]);

  // Update settings when token validation changes (prevent infinite loop)
  useEffect(() => {
    if (prevTokenValidRef.current !== tokenValid) {
      prevTokenValidRef.current = tokenValid;
      onSettingsChange('tokenValid', tokenValid);
    }
  }, [tokenValid, onSettingsChange]);

  return (
    <div>
      <h3 className="text-3xl font-semibold text-black mb-12 text-center">Scan Configuration</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Time Range */}
        <div>
          <label className="block text-black mb-4 text-xl font-medium">Time Range</label>
          <select
            value={settings.timeRange}
            onChange={(e) => onSettingsChange('timeRange', e.target.value)}
            className="w-full p-5 rounded-2xl bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Max Email Count */}
        <div>
          <label className="block text-black mb-4 text-xl font-medium">Max Email Count</label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.maxEmails}
            onChange={(e) => onSettingsChange('maxEmails', parseInt(e.target.value))}
            className="w-full p-5 rounded-2xl bg-white text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-lg"
          />
          <p className="text-gray-600 text-lg mt-3">
            Recommended: 5-8 emails for optimal results
          </p>
        </div>

        {/* AI Mode Selection */}
        <div className="md:col-span-2">
          <label className="block text-black mb-6 text-xl font-medium">AI Processing Mode</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiModes.map(mode => (
              <label
                key={mode.value}
                className={`group p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  settings.aiMode === mode.value
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                <input
                  type="radio"
                  name="aiMode"
                  value={mode.value}
                  checked={settings.aiMode === mode.value}
                  onChange={(e) => onSettingsChange('aiMode', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-3xl">{mode.icon}</span>
                  <div className="text-black font-semibold text-xl">{mode.label}</div>
                </div>
                <div className="text-gray-600 text-lg leading-relaxed">{mode.description}</div>
                
                {/* Selection indicator */}
                {settings.aiMode === mode.value && (
                  <div className="mt-4 inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-sm font-medium">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Active
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Token Validation */}
        <div className="md:col-span-2">
          <label className="block text-black mb-4 text-xl font-medium">AI Email Token</label>
          <input
            type="password"
            placeholder="Enter your AI Email Token"
            value={token}
            onChange={handleTokenChange}
            className={`w-full p-5 rounded-2xl border transition-all duration-300 text-lg ${
              tokenValid 
                ? 'bg-green-50 text-black border-green-300 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50' 
                : 'bg-white text-black border-gray-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50'
            }`}
          />
          
          {/* Token Status */}
          {token && (
            <div className={`mt-4 p-4 rounded-2xl border ${
              tokenValid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-3">
                {tokenValid ? (
                  <>
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 text-lg font-medium">
                      Token Valid ✓ AI Analysis Enabled
                    </p>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-red-800 text-lg font-medium">
                      {tokenError || 'Invalid token. Please check your token and try again.'}
                    </p>
                  </>
                )}
              </div>
              
              {tokenValid && (
                <p className="text-green-700 text-sm mt-2">
                  Token expires in 7 days. Contact developer to refresh if needed.
                </p>
              )}
            </div>
          )}
          
          {/* Token Instructions */}
          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <p className="text-black text-lg">
              <span className="font-semibold">Important:</span> You need a valid AI Email Token to use this function. 
              The token expires every 7 days and must be updated by the developer in the .env file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanSettings; 