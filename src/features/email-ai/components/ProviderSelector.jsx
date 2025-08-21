import React from 'react';
import { emailProviders } from '../config/providers';

const ProviderSelector = ({ onSelect, selectedProvider }) => {
  const gmailProvider = emailProviders.gmail;
  
  return (
    <div className="text-center">
      <div className="flex justify-center">
        <button
          onClick={() => onSelect('gmail')}
          className={`group relative overflow-hidden bg-white rounded-3xl p-16 border border-gray-200 hover:border-blue-500/50 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-blue-500/25 ${
            selectedProvider === 'gmail' ? 'ring-2 ring-blue-500/50 bg-blue-50 border-blue-500/30' : ''
          }`}
        >
          {/* Background light effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Icon - Centered and using the actual gmailicon.png image */}
          <div className="relative z-10 flex justify-center mb-8 transition-transform duration-300 group-hover:scale-110">
            <img src="/images/gmailicon.png" alt="Gmail" className="w-32 h-32" />
          </div>
          
          {/* Title */}
          <div className="relative z-10 font-semibold text-4xl mb-6 text-black">{gmailProvider.name}</div>
          
          {/* Description */}
          <div className="relative z-10 text-black text-xl mb-8 leading-relaxed">
            {gmailProvider.description}
          </div>
          
          {/* Features list */}
          <div className="relative z-10 text-gray-600 text-lg mb-8">
            <ul className="space-y-2">
              {gmailProvider.features.map((feature, index) => (
                <li key={index} className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Selection state */}
          {selectedProvider === 'gmail' && (
            <div className="relative z-10 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold shadow-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Selected
            </div>
          )}
          
          {/* Hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>
      
      {/* Coming Soon Providers */}
      <div className="mt-8 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {Object.entries(emailProviders).map(([key, provider]) => {
          if (key === 'gmail') return null; // Skip Gmail as it's already shown above
          
          return (
            <div key={key} className="bg-gray-100 rounded-2xl p-8 border border-gray-200 opacity-60">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📧</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">{provider.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{provider.description}</p>
                <div className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Coming Soon
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProviderSelector; 