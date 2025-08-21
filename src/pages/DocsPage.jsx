import React, { useState, useMemo } from 'react';
import { Navigation } from '../components';

const DocsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const categories = [
    {
      title: "Getting Started",
      description: "Quick start guide and basic setup",
      icon: "🚀",
      articles: [
        "Quick Start Guide",
        "Installation",
        "First Configuration",
        "Connecting Your Email"
      ]
    },
    {
      title: "Core Features",
      description: "Learn about MailFlow's main capabilities",
      icon: "⚡",
      articles: [
        "AI Email Analysis",
        "Smart Categorization",
        "Automation Rules",
        "Template Management"
      ]
    },
    {
      title: "Integrations",
      description: "Connect with your favorite tools",
      icon: "🔗",
      articles: [
        "Gmail Integration",
        "Outlook Setup",
        "API Documentation",
        "Webhook Configuration"
      ]
    },
    {
      title: "Advanced Usage",
      description: "Master advanced features and customization",
      icon: "🎯",
      articles: [
        "Custom AI Models",
        "Advanced Automation",
        "Performance Optimization",
        "Security Best Practices"
      ]
    },
    {
      title: "API Reference",
      description: "Developer documentation and examples",
      icon: "💻",
      articles: [
        "Authentication",
        "Endpoints",
        "Rate Limits",
        "SDK Examples"
      ]
    },
    {
      title: "Troubleshooting",
      description: "Common issues and solutions",
      icon: "🔧",
      articles: [
        "Connection Issues",
        "Performance Problems",
        "Error Messages",
        "Support Contact"
      ]
    }
  ];

  const popularArticles = [
    "How to set up your first automation rule",
    "Understanding AI categorization accuracy",
    "Best practices for email templates",
    "Integrating with Gmail OAuth",
    "Setting up team collaboration features"
  ];

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Search through categories and articles
    const results = [];
    const queryLower = query.toLowerCase();
    
    // Search categories
    categories.forEach(category => {
      if (category.title.toLowerCase().includes(queryLower) || 
          category.description.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'category',
          title: category.title,
          description: category.description,
          icon: category.icon,
          articles: category.articles
        });
      }
      
      // Search articles within categories
      category.articles.forEach(article => {
        if (article.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'article',
            title: article,
            category: category.title,
            description: `Article from ${category.title} category`
          });
        }
      });
    });
    
    // Search popular articles
    popularArticles.forEach(article => {
      if (article.toLowerCase().includes(queryLower)) {
        results.push({
          type: 'popular',
          title: article,
          description: 'Popular article'
        });
      }
    });
    
    setSearchResults(results);
    setIsSearching(false);
  };

  // Debounced search
  const debouncedSearch = useMemo(() => {
    let timeoutId;
    return (query) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handleSearch(query), 300);
    };
  }, []);

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  return (
    <div className="relative z-10 min-h-screen">
      {/* Navigation Bar */}
      <Navigation activePage="/docs" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-600 text-sm mb-8">
            Documentation →
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Learn
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> MailFlow</span>
          </h1>
          
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed mb-12">
            Comprehensive documentation to help you get the most out of MailFlow. 
            From quick start guides to advanced API documentation.
          </p>

          {/* Functional Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search documentation..."
                className="w-full px-6 py-4 bg-white border border-gray-300 rounded-2xl text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {isSearching ? (
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-black">
                Search Results for "{searchQuery}"
              </h2>
              <span className="text-gray-600">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:-translate-y-1 transition-transform duration-300">
                  {result.type === 'category' ? (
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                        {/* Use the same styled icons for search results */}
                        {result.title === "Getting Started" && (
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L9 9H2l7 7-3 6 6-6 6 6-3-6 7-7h-7l-3-7z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9h8"/>
                          </svg>
                        )}
                        {result.title === "Core Features" && (
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                          </svg>
                        )}
                        {result.title === "Integrations" && (
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V7z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 17a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 17a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                          </svg>
                        )}
                        {result.title === "Advanced Usage" && (
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth={1.5}/>
                            <circle cx="12" cy="12" r="6" strokeWidth={1.5}/>
                            <circle cx="12" cy="12" r="2" strokeWidth={1.5}/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12h20"/>
                          </svg>
                        )}
                        {result.title === "API Reference" && (
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                          </svg>
                        )}
                        {result.title === "Troubleshooting" && (
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-black mb-2">{result.title}</h3>
                        <p className="text-gray-600 mb-4">{result.description}</p>
                        <div className="text-sm text-blue-600 font-medium">Category</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-black mb-2">{result.title}</h3>
                      <p className="text-gray-600 mb-2">{result.description}</p>
                      {result.category && (
                        <div className="text-sm text-blue-600 font-medium">From: {result.category}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Search Results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="mb-20 text-center">
            <div className="bg-gray-50 rounded-3xl p-12 border border-gray-200">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">No results found</h3>
              <p className="text-gray-600 mb-6">
                Try searching with different keywords or browse our documentation categories below.
              </p>
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}

        {/* Documentation Categories - Only show when not searching or no results */}
        {(!searchQuery || searchResults.length === 0) && (
        <div className="mb-20">
            <h2 className="text-4xl font-bold text-black text-center mb-16">Documentation Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-gray-200 shadow-lg cursor-pointer">
                  <div className="flex items-start space-x-6">
                    <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
                      {index === 0 && (
                        /* Getting Started - Rocket Launching */
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L9 9H2l7 7-3 6 6-6 6 6-3-6 7-7h-7l-3-7z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9h8"/>
                        </svg>
                      )}
                      {index === 1 && (
                        /* Core Features - Lightning Bolt */
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                        </svg>
                      )}
                      {index === 2 && (
                        /* Integrations - Puzzle Pieces */
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V7z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 17a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 17a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                        </svg>
                      )}
                      {index === 3 && (
                        /* Advanced Usage - Target */
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth={1.5}/>
                          <circle cx="12" cy="12" r="6" strokeWidth={1.5}/>
                          <circle cx="12" cy="12" r="2" strokeWidth={1.5}/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2v20"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2 12h20"/>
                        </svg>
                      )}
                      {index === 4 && (
                        /* API Reference - Code Brackets */
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                        </svg>
                      )}
                      {index === 5 && (
                        /* Troubleshooting - Wrench */
                        <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-black mb-4">{category.title}</h3>
                      <p className="text-black mb-6">{category.description}</p>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                          <li key={articleIndex} className="text-black text-sm hover:text-blue-600 transition-colors">
                      • {article}
                    </li>
                  ))}
                </ul>
                    </div>
                  </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Popular Articles - Only show when not searching or no results */}
        {(!searchQuery || searchResults.length === 0) && (
        <div className="mb-20">
            <h2 className="text-4xl font-bold text-black text-center mb-16">Popular Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularArticles.map((article, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 hover:-translate-y-2 transition-transform duration-300 border border-gray-200 shadow-lg cursor-pointer">
                <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold text-black mb-2">{article}</h3>
                      <p className="text-gray-600 text-sm">Learn how to set up and configure this feature...</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Quick Start Guide - Only show when not searching or no results */}
        {(!searchQuery || searchResults.length === 0) && (
        <div className="mb-20">
            <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
              <h2 className="text-3xl font-bold text-black text-center mb-12">Quick Start Guide</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                  <h3 className="text-xl font-semibold text-black mb-4">Sign Up</h3>
                  <p className="text-black">
                  Create your free account and verify your email address to get started.
                </p>
              </div>
              
              <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                  <h3 className="text-xl font-semibold text-black mb-4">Connect Email</h3>
                  <p className="text-black">
                  Connect your Gmail, Outlook, or other email provider using secure OAuth.
                </p>
              </div>
              
              <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                  <h3 className="text-xl font-semibold text-black mb-4">Start Using</h3>
                  <p className="text-black">
                  Let AI analyze your emails and start automating your workflow immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Support Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-black text-center mb-16">Need Help?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Help Center</h3>
              <p className="text-black mb-6">
                Browse our comprehensive help articles and find answers to common questions.
              </p>
              <a href="/docs" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                Visit Help Center →
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Contact Support</h3>
              <p className="text-black mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a href="/contact" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                Contact Support →
              </a>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
            <h2 className="text-3xl font-bold text-black mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
              Start using MailFlow today and discover how AI-powered email management can transform your productivity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/email-ai"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Free Trial →
              </a>
              <a 
                href="/features"
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                View All Features
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage; 