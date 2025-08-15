import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/journal');
        setEntries(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load entries');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/journal/${id}`);
      setEntries(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete entry');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-neutral-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Your Journal</h1>
              <p className="text-neutral-600">Reflect on your thoughts and track your mood</p>
            </div>
            <Link 
              to="/new" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Entry
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-700">Total Entries</p>
                  <p className="text-2xl font-bold text-orange-900">{entries.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">This Month</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {entries.filter(e => {
                      const entryDate = new Date(e.createdAt);
                      const now = new Date();
                      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-700">Average Mood</p>
                  <p className="text-2xl font-bold text-green-900">
                    {entries.length > 0 ? '😊' : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Entries */}
        {entries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 p-12 text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">No entries yet</h3>
            <p className="text-neutral-600 mb-6">Start your journaling journey by creating your first entry</p>
            <Link 
              to="/new" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write Your First Entry
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry, index) => (
              <div 
                key={entry._id} 
                className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 p-6 hover:shadow-xl transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{entry.mood || '📝'}</div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {formatDate(entry.createdAt)}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {new Date(entry.createdAt).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit',
                          hour12: true 
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(entry._id)}
                    disabled={deletingId === entry._id}
                    className="text-neutral-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
                    title="Delete entry"
                  >
                    {deletingId === entry._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="prose prose-neutral max-w-none">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </p>
                </div>
                
                {/* Sentiment Analysis Section */}
                {(entry.sentimentScore !== undefined || entry.sentimentLabel || entry.sentimentConfidence !== undefined) && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center space-x-2 mb-3">
                      <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-sm font-medium text-neutral-700">Sentiment Analysis</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Sentiment Score */}
                      {typeof entry.sentimentScore === 'number' && (
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-blue-700">Sentiment Score</span>
                            <span className="text-sm font-bold text-blue-900">
                              {entry.sentimentScore > 0 ? '+' : ''}{entry.sentimentScore.toFixed(2)}
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="w-full bg-blue-200 rounded-full h-1.5">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${Math.abs(entry.sentimentScore) * 100}%`,
                                  backgroundColor: entry.sentimentScore > 0 ? '#059669' : entry.sentimentScore < 0 ? '#dc2626' : '#6b7280'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Sentiment Label */}
                      {entry.sentimentLabel && (
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-green-700">Sentiment</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                              entry.sentimentLabel === 'POSITIVE' 
                                ? 'bg-green-200 text-green-800' 
                                : 'bg-red-200 text-red-800'
                            }`}>
                              {entry.sentimentLabel}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center">
                            <span className="text-xs text-green-600">
                              {entry.sentimentLabel === 'POSITIVE' ? '😊 Positive' : '😔 Negative'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Sentiment Confidence */}
                      {typeof entry.sentimentConfidence === 'number' && (
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-purple-700">Confidence</span>
                            <span className="text-sm font-bold text-purple-900">
                              {(entry.sentimentConfidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <div className="mt-1">
                            <div className="w-full bg-purple-200 rounded-full h-1.5">
                              <div 
                                className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${entry.sentimentConfidence * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
