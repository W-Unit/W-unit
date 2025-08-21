import React from 'react';

const EnvCheck = () => {
  const checkEnvVars = () => {
    const vars = {
      'Gmail API Key': import.meta.env.VITE_GMAIL_API_KEY,
      'Gmail Client ID': import.meta.env.VITE_GMAIL_CLIENT_ID,
      'OpenAI API Key': import.meta.env.VITE_OPENAI_API_KEY
    };

    const results = Object.entries(vars).map(([name, value]) => ({
      name,
      value: value ? '✅ Configured' : '❌ Not Configured',
      hasValue: !!value
    }));

    return results;
  };

  const envVars = checkEnvVars();
  const allConfigured = envVars.every(v => v.hasValue);

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/20 shadow-2xl">
      <h4 className="text-2xl font-semibold text-white mb-8 text-center">Environment Configuration</h4>
      <div className="space-y-6 mb-8">
        {envVars.map((env, index) => (
          <div key={index} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <span className="text-white/90 text-xl font-medium">{env.name}:</span>
            <span className={`text-xl font-semibold ${
              env.hasValue ? 'text-green-400' : 'text-red-400'
            }`}>
              {env.value}
            </span>
          </div>
        ))}
      </div>
      
      {!allConfigured && (
        <div className="p-8 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-200 text-xl font-semibold">Configuration Required</p>
          </div>
          <p className="text-red-200 text-lg mb-3">
            Please check your .env file and ensure all required API keys are properly configured.
          </p>
          <p className="text-red-200 text-base">
            Environment variable names must start with VITE_, for example: VITE_GMAIL_API_KEY
          </p>
        </div>
      )}
      
      {allConfigured && (
        <div className="p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl backdrop-blur-sm">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-green-200 text-xl font-semibold">
              All required API keys are configured!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvCheck; 