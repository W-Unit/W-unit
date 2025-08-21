import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ activePage }) => {
  const navItems = [
    { href: '/', label: 'Products' },
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/docs', label: 'Docs' },
    { href: '/contact', label: 'Contact' },
    { href: '/email-ai', label: 'Email AI' }
  ];

  return (
    <nav className="flex items-center justify-between px-8 py-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        </div>
        <span className="text-xl font-semibold text-black">Study and Learn</span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-8 text-black">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`transition-colors ${
              activePage === item.href ? 'text-blue-600 font-medium' : 'hover:text-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-black hover:text-gray-700 transition-colors">Sign in</button>
        <button className="px-6 py-2 border border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
          Sign up →
        </button>
      </div>
    </nav>
  );
};

export default Navigation; 