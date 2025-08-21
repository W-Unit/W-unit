import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AboutPage, FeaturesPage, PricingPage, DocsPage, ContactPage } from './pages';
import { EmailAIPage, emailAIConfig } from './features/email-ai';

const AppWithRouting = () => {
  // Set page title
  React.useEffect(() => {
    document.title = 'Study and Learn - AI-Powered Email Intelligence';
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0">
          {/* Starry background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-30"></div>
          
          {/* Central glow effect */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>
          
          {/* Top-left blue glow */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          {/* Bottom-right indigo glow */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Routing Configuration */}
        <Routes>
          <Route path="/" element={<AboutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/email-ai" element={emailAIConfig.enabled ? <EmailAIPage /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppWithRouting; 