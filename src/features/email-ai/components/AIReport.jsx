import React from 'react';

const AIReport = ({ report, isLoading, onGenerateReply }) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">AI is analyzing emails, please wait...</p>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  const isAllInOneMode = report.repliesToGenerate && report.repliesToGenerate.length > 0;
  const hasDraftResults = report.draftResults && report.draftResults.length > 0;

  return (
    <div className="space-y-8">
      {/* Overall Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-black mb-4">🚀 AI Executive Assistant Report</h3>
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{report.totalEmails}</div>
            <div className="text-gray-600">Scanned Emails</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {report.emailsAnalysis ? report.emailsAnalysis.filter(e => e.needsReply).length : 0}
            </div>
            <div className="text-gray-600">Need Reply</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {report.emailsAnalysis ? report.emailsAnalysis.filter(e => e.importance === 'high').length : 0}
            </div>
            <div className="text-gray-600">Important Emails</div>
          </div>
          {hasDraftResults && (
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{report.draftCount || 0}</div>
              <div className="text-gray-600">Drafts Created</div>
            </div>
          )}
        </div>
        <p className="text-black text-lg leading-relaxed">{report.summary}</p>
        
        {/* Productivity Metrics - Motion-like feature */}
        {report.productivityMetrics && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
            <h4 className="text-lg font-semibold text-black mb-3">📈 Productivity Insights</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-medium text-blue-600">{report.productivityMetrics.emailsNeedingAction}</div>
                <div className="text-gray-600">Require Action</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-green-600">{report.productivityMetrics.estimatedTimeSaved}</div>
                <div className="text-gray-600">Time Saved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium text-purple-600">{report.productivityMetrics.priorityDistribution}</div>
                <div className="text-gray-600">Priority Breakdown</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Priority Actions - Motion-like feature */}
        {report.priorityActions && report.priorityActions.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <h4 className="text-lg font-semibold text-yellow-800 mb-3">⚡ Priority Actions</h4>
            <ul className="space-y-2">
              {report.priorityActions.map((action, index) => (
                <li key={index} className="flex items-center space-x-2 text-yellow-700">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Email Analysis */}
      {report.emailsAnalysis && (
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-black mb-6">📧 Detailed Email Analysis</h3>
          <div className="space-y-6">
            {report.emailsAnalysis.map((email, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Email {email.emailNumber}
                      </span>
                      {email.needsReply && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Needs Reply
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        email.importance === 'high' ? 'bg-red-100 text-red-800' :
                        email.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {email.importance} Importance
                      </span>
                      {email.urgency && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          email.urgency === 'urgent' ? 'bg-red-100 text-red-800' :
                          email.urgency === 'normal' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {email.urgency} Urgency
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-black mb-2">{email.subject}</h4>
                    <p className="text-gray-600 mb-2">From: {email.from}</p>
                    <p className="text-black mb-3">{email.summary}</p>
                    
                    {email.keyPoints && email.keyPoints.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Key Points:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {email.keyPoints.map((point, pointIndex) => (
                            <li key={pointIndex} className="text-sm text-gray-600">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {email.needsReply && email.replyReason && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">Reply Reason:</span> {email.replyReason}
                        </p>
                      </div>
                    )}
                    
                    {/* Business Context - Motion-like feature */}
                    {email.businessContext && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Business Context:</span> {email.businessContext}
                        </p>
                      </div>
                    )}
                    
                    {/* Action Required - Enhanced display */}
                    {email.actionRequired && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-sm text-purple-800">
                          <span className="font-medium">Action Required:</span> {email.actionRequired}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft Reply Notification - ALL-in-One Mode */}
      {isAllInOneMode && (
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-800">✉️ Draft Replies Created</h3>
              <p className="text-green-700">AI has generated intelligent reply drafts for emails that need responses</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-green-200">
            <p className="text-black text-lg mb-4">
              <span className="font-semibold">Important Notice:</span> Reply drafts have been saved to your Gmail drafts folder and will be visible even if you don't open your email.
            </p>
            
            <div className="space-y-3">
              {report.repliesToGenerate.map((reply, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Email {reply.emailNumber}: {reply.subject}
                    </span>
                  </div>
                  
                  {/* Enhanced reply information - Motion-like features */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">To: <span className="text-gray-800">{reply.to}</span></span>
                      <span className="text-gray-600">Tone: <span className="text-gray-800">{reply.tone}</span></span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        reply.priority === 'high' ? 'bg-red-100 text-red-800' :
                        reply.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {reply.priority} Priority
                      </span>
                    </div>
                    
                    {/* Action Items - Motion-like feature */}
                    {reply.actionItems && reply.actionItems.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-xs font-medium mb-2">Action Items:</p>
                        <ul className="space-y-1">
                          {reply.actionItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-blue-700 text-xs flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Follow-up Actions - Motion-like feature */}
                    {reply.followUp && (
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-purple-800 text-xs font-medium mb-2">Follow-up Actions:</p>
                        <p className="text-purple-700 text-xs">{reply.followUp}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 text-sm">
                <span className="font-medium">Tip:</span> Please check your Gmail drafts folder, review and edit the AI-generated reply drafts to ensure they meet your requirements before sending.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Draft Creation Results Details */}
      {hasDraftResults && (
        <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200">
          <h3 className="text-2xl font-bold text-orange-800 mb-6">📝 Draft Creation Details</h3>
          <div className="space-y-4">
            {report.draftResults.map((draft, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-orange-200">
                {draft.error ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-red-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="font-medium">Draft Creation Failed</span>
                    </div>
                    <div className="text-sm text-red-700 space-y-2">
                      <p><strong>Error Message:</strong> {draft.error}</p>
                      {draft.errorAnalysis && (
                        <p><strong>Error Analysis:</strong> {draft.errorAnalysis}</p>
                      )}
                      {draft.replyData && (
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p><strong>Draft Data:</strong></p>
                          <p className="text-xs">Subject: {draft.replyData.subject}</p>
                          <p className="text-xs">Recipient: {draft.replyData.to}</p>
                          <p className="text-xs">Content Length: {draft.replyData.content?.length || 0} characters</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-green-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Draft Created Successfully</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Draft ID:</strong> {draft.id}</p>
                      <p><strong>Subject:</strong> {draft.replyData?.subject || 'No Subject'}</p>
                      <p><strong>Recipient:</strong> {draft.replyData?.to || 'Unknown'}</p>
                      {draft.threadId && (
                        <p><strong>Thread ID:</strong> {draft.threadId}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Draft Creation Statistics */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-3">📊 Draft Creation Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {report.draftResults.filter(d => !d.error).length}
                </div>
                <div className="text-green-700">Created Successfully</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {report.draftResults.filter(d => d.error).length}
                </div>
                <div className="text-red-700">Creation Failed</div>
              </div>
            </div>
            
            {/* Failure Reason Analysis */}
            {report.draftResults.filter(d => d.error).length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-800 font-medium mb-2">Common Failure Reasons:</p>
                <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                  <li>Email content contains non-Latin1 characters (Chinese, emoji, etc.)</li>
                  <li>Insufficient Gmail API permissions</li>
                  <li>Network connection issues</li>
                  <li>API quota exceeded</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overall Insights */}
      {report.overallInsights && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
          <h3 className="text-2xl font-bold text-black mb-4">Overall Insights & Recommendations</h3>
          <p className="text-black text-lg leading-relaxed">{report.overallInsights}</p>
        </div>
      )}

      {/* Reply Summary */}
      {report.replySummary && (
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 text-center">
          <p className="text-blue-800 text-lg font-medium">{report.replySummary}</p>
        </div>
      )}

      {/* Cost Information */}
      {report.estimatedCost && (
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Estimated AI Analysis Cost: <span className="font-medium">${report.estimatedCost}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default AIReport; 