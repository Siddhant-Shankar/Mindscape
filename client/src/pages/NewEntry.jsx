// client/src/pages/NewEntry.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MOODS = [
  { emoji: '😊', label: 'Happy', color: 'bg-green-100 border-green-300 text-green-700' },
  { emoji: '😐', label: 'Neutral', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { emoji: '😔', label: 'Sad', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { emoji: '😤', label: 'Frustrated', color: 'bg-red-100 border-red-300 text-red-700' },
  { emoji: '😴', label: 'Tired', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { emoji: '🤒', label: 'Sick', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { emoji: '🤩', label: 'Excited', color: 'bg-pink-100 border-pink-300 text-pink-700' }
];

export default function NewEntry() {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!content.trim()) return setError('Please write something');
    setSaving(true);
    try {
      await api.post('/journal', { content, mood: selectedMood.emoji });
      nav('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-neutral-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">New Journal Entry</h1>
              <p className="text-neutral-600">Express your thoughts and feelings</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-8">
            {/* Mood Selection */}
            <div>
              <label className="block text-lg font-medium text-neutral-900 mb-4">
                How are you feeling today?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {MOODS.map((mood) => (
                  <button
                    key={mood.emoji}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      selectedMood.emoji === mood.emoji
                        ? `${mood.color} shadow-lg scale-105`
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                    }`}
                  >
                    <div className="text-2xl mb-2">{mood.emoji}</div>
                    <div className="text-xs font-medium">{mood.label}</div>
                    {selectedMood.emoji === mood.emoji && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Journal Entry */}
            <div>
              <label htmlFor="content" className="block text-lg font-medium text-neutral-900 mb-4">
                What's on your mind?
              </label>
              <div className="relative">
                <textarea
                  id="content"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={12}
                  className="w-full px-6 py-4 border-2 border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 placeholder-neutral-400 resize-none text-lg leading-relaxed"
                  placeholder="Start writing your thoughts, feelings, or experiences here..."
                  autoFocus
                />
                <div className="absolute bottom-4 right-4 text-sm text-neutral-400">
                  {content.length} characters
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => nav('/')}
                className="inline-flex items-center px-6 py-3 text-neutral-600 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving || !content.trim()}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Entry
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Writing Tips */}
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/50 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center">
            <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Writing Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Write freely without worrying about grammar or structure</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Reflect on your day, emotions, or any thoughts on your mind</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>Consider what you're grateful for or what challenges you faced</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
              <p>There's no right or wrong way to journal - just be honest</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
