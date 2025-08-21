import React from 'react';
import { Navigation } from '../components';

const AboutPage = () => {
  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <Navigation activePage="/" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-600 text-sm mb-8">
            About MailFlow →
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Revolutionizing
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Email</span>
            <br />Management
          </h1>
          
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed mb-12">
            MailFlow is more than just an email client. It's an intelligent framework that transforms 
            how you interact with your inbox, powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Email AI Function Block */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-black mb-4">AI-Powered Email Intelligence</h2>
              <p className="text-lg text-black max-w-3xl mx-auto">
                Experience the future of email management with our advanced AI technology
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Smart Analysis</h3>
                <p className="text-black text-sm">
                  AI analyzes your emails to identify priorities, categorize content, and suggest actions
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Auto-Reply</h3>
                <p className="text-black text-sm">
                  Generate intelligent, context-aware responses using advanced language models
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">Time Saving</h3>
                <p className="text-black text-sm">
                  Reduce email processing time by up to 70% with intelligent automation
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <a 
                href="/email-ai"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Try Email AI →
              </a>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-lg text-black leading-relaxed mb-6">
                We believe that email should work for you, not against you. Our mission is to eliminate 
                email overwhelm and transform your inbox into a powerful productivity tool.
              </p>
              <p className="text-lg text-black leading-relaxed">
                By combining intelligent automation, AI-powered insights, and intuitive design, 
                we're making email management effortless and enjoyable.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl p-8 border border-blue-200">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4">Innovation First</h3>
              <p className="text-black">
                We're constantly pushing the boundaries of what's possible with email technology, 
                always with the user experience in mind.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-black text-center mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Performance</h3>
              <p className="text-black">
                Lightning-fast processing and real-time insights that keep you ahead of your inbox.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Security</h3>
              <p className="text-black">
                Enterprise-grade security that protects your data while maintaining seamless functionality.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">User-Centric</h3>
              <p className="text-black">
                Every feature is designed with the user in mind, ensuring an intuitive and delightful experience.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-black text-center mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">AM</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Andrew Mo</h3>
              <p className="text-blue-600 mb-2">Student</p>
              <p className="text-black text-sm">
                Studying
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">AI</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">AI Assistant</h3>
              <p className="text-blue-600 mb-2">Core Technology</p>
              <p className="text-black text-sm">
                Advanced AI algorithms that power our intelligent email analysis and automation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">UX</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Design Team</h3>
              <p className="text-blue-600 mb-2">User Experience</p>
              <p className="text-black text-sm">
                Dedicated to creating beautiful, intuitive interfaces that users love to use.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-black mb-6">Ready to Transform Your Email Experience?</h2>
            <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already revolutionized their email workflow with MailFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/email-ai"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Try Email AI →
              </a>
              <a 
                href="/contact"
                className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                Schedule Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 