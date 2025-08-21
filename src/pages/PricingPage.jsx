import React from 'react';
import { Navigation } from '../components';

const PricingPage = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for individuals getting started with email management.",
      features: [
        "Up to 1,000 emails/month",
        "Basic AI categorization",
        "Email templates",
        "Basic analytics",
        "Email support"
      ],
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      popular: false
    },
    {
      name: "Pro",
      price: "$1",
      period: "month",
      description: "Ideal for professionals and small teams.",
      features: [
        "Up to 10,000 emails/month",
        "Advanced AI features",
        "Auto-reply generation",
        "Priority scoring",
        "Team collaboration",
        "Priority support"
      ],
      buttonStyle: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      period: "month",
      description: "For large organizations with advanced requirements.",
      features: [
        "Unlimited emails",
        "Custom AI models",
        "Advanced automation",
        "API access",
        "Dedicated support",
        "Custom integrations"
      ],
      buttonStyle: "border border-gray-300 text-gray-700 hover:bg-gray-50",
      popular: false,
      isContact: true
    }
  ];

  return (
    <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <Navigation activePage="/pricing" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-600 text-sm mb-8">
            Pricing Plans →
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
            Simple,
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Transparent</span>
            <br />Pricing
          </h1>
          
          <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed mb-12">
            Choose the plan that fits your needs. All plans include our core features 
            with no hidden fees or surprises.
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <button className="px-6 py-3 text-black bg-blue-500 rounded-xl font-medium">
              Monthly
            </button>
            <button className="px-6 py-3 text-gray-600 hover:text-black transition-colors">
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-3xl p-8 border border-gray-200 shadow-lg ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium absolute -top-4 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-black mb-4">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold text-black">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 text-lg">/{plan.period}</span>}
                  </div>
                  <p className="text-black">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-black">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.isContact ? (
                  <a 
                    href="/contact"
                    className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${plan.buttonStyle} block text-center`}
                  >
                    Contact Sales
                  </a>
                ) : (
                  <button className={`w-full py-4 rounded-xl font-semibold transition-all transform hover:scale-105 ${plan.buttonStyle}`}>
                    {plan.popular ? 'Get Started' : 'Choose Plan'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Custom Pricing */}
        <div className="mb-20">
          <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-lg text-center">
            <h2 className="text-3xl font-bold text-black mb-6">Custom Pricing</h2>
            <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
              Need a custom solution? Contact us for enterprise pricing and custom integrations 
              tailored to your specific requirements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Contact Sales →
              </a>
              <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-black text-center mb-16">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Can I change my plan anytime?</h3>
              <p className="text-black">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Is there a free trial?</h3>
              <p className="text-black">
                Yes, all paid plans come with a 14-day free trial. No credit card required to start.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-black mb-4">What payment methods do you accept?</h3>
              <p className="text-black">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Do you offer team discounts?</h3>
              <p className="text-black">
                Yes, we offer volume discounts for teams of 10+ users. Contact us for details.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
            <h2 className="text-3xl font-bold text-black mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-black mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already transformed their email workflow with MailFlow.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a 
                href="/email-ai"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Free Trial →
              </a>
              <button className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
                View Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 