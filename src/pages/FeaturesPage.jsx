import React from 'react';
import { Navigation } from '../components';

const FeaturesPage = () => {
  const features = [
    {
      title: "Smart Categorization",
      description: "AI-powered email sorting that automatically categorizes your emails into logical groups.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      details: ["Priority-based sorting", "Custom categories", "Smart filters"]
    },
    {
      title: "Intelligent Prioritization",
      description: "Never miss important emails with our AI that learns your priorities and preferences.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      details: ["Urgent email detection", "Personalized ranking", "Action item highlighting"]
    },
    {
      title: "Auto-Reply Generation",
      description: "Generate contextually appropriate responses using advanced language models.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      details: ["Context-aware responses", "Tone customization", "Multi-language support"]
    },
    {
      title: "Advanced Analytics",
      description: "Gain insights into your email patterns and productivity with detailed analytics.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      details: ["Response time tracking", "Email volume analysis", "Productivity metrics"]
    },
    {
      title: "Seamless Integration",
      description: "Works with your existing email clients and tools without disruption.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      details: ["Gmail integration", "Outlook compatibility", "API access"]
    },
    {
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and compliance features.",
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      details: ["End-to-end encryption", "GDPR compliance", "SOC 2 certified"]
    }
  ];

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <Navigation activePage="/features" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-600 text-sm mb-8">
            Powerful Features →
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Everything You Need
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Email</span>
            <br />Management
          </h1>
          
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed mb-12">
            Discover the comprehensive suite of features that make MailFlow the most intelligent 
            and powerful email management platform available.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:-translate-y-2 transition-transform duration-300 border border-gray-200 shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-4">{feature.title}</h3>
                <p className="text-black mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-black text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-black text-center mb-16">Advanced Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-black mb-6">AI-Powered Intelligence</h3>
              <p className="text-lg text-black leading-relaxed mb-6">
                Our advanced AI algorithms learn from your email patterns and preferences, 
                continuously improving the accuracy of categorization and prioritization.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Natural language processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Machine learning optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-black">Predictive analytics</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Smart Automation</h3>
              <p className="text-black">
                Automate complex workflows and reduce manual tasks with our intelligent 
                automation engine that adapts to your needs.
              </p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
            <h2 className="text-3xl font-bold text-black text-center mb-12">Performance That Speaks</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-black">Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">50x</div>
                <div className="text-black">Faster Processing</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-black">AI Monitoring</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-black">Secure</div>
              </div>
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

        {/* Help & Support Section */}
        <div className="mt-20">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Help Center Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Help Center</h3>
              <p className="text-black mb-6">
                Browse our comprehensive help articles and find answers to common questions.
              </p>
              <a 
                href="/docs"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
              >
                Visit Help Center →
              </a>
            </div>

            {/* Contact Support Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Contact Support</h3>
              <p className="text-black mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a 
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
              >
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage; 