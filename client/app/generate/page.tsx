'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateScenario } from '@/lib/api';
import NeuralBackground from '@/components/neural-background';

export default function GeneratePage() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('business');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [numSteps, setNumSteps] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await generateScenario({
        topic: topic.trim(),
        category,
        difficulty,
        num_decision_points: numSteps,
      });

      // Redirect to the new scenario
      router.push(`/scenario/${result.scenario.id}`);
    } catch (err) {
      setError('Failed to generate scenario. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='min-h-screen bg-black text-white relative overflow-hidden'>
      <NeuralBackground />

      <div className='relative z-10'>
        {/* Compact Header */}
        <header className='border-b border-cyan-500/10 backdrop-blur-sm bg-black/50'>
          <div className='max-w-4xl mx-auto px-8 py-4 flex items-center justify-between'>
            <button
              onClick={() => router.push('/')}
              className='flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 19l-7-7m0 0l7-7m-7 7h18'
                />
              </svg>
              Back
            </button>

            <h1 className='text-sm font-light text-gray-400 tracking-wide'>
              Neural Pathway Generator
            </h1>

            <div className='w-16'></div>
          </div>
        </header>

        {/* Content */}
        <div className='max-w-3xl mx-auto px-8 py-16'>
          {/* Central Node Visualization */}
          <div className='flex justify-center mb-12'>
            <div className='relative'>
              {/* Pulsing rings */}
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='w-32 h-32 rounded-full border border-cyan-500/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]'></div>
                <div className='absolute w-24 h-24 rounded-full border border-purple-500/20 animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]'></div>
              </div>

              {/* Core node */}
              <div
                className='relative w-20 h-20 rounded-full bg-linear
              -to-br from-cyan-500 to-purple-500 flex items-center justify-center'
              >
                <div className='w-16 h-16 rounded-full bg-black flex items-center justify-center'>
                  <svg
                    className='w-8 h-8 text-cyan-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className='bg-black/50 backdrop-blur-sm border border-cyan-500/20 rounded-3xl p-8 space-y-8'>
            {/* Topic Input */}
            <div>
              <label className='block text-xs text-gray-500 uppercase tracking-wider mb-3'>
                Ethical Dilemma
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder='Describe a moral conflict or ethical decision scenario...'
                className='w-full px-4 py-3 bg-black/50 border border-cyan-500/30 rounded-xl text-gray-300 placeholder-gray-700 focus:border-cyan-500/60 focus:outline-none transition-colors resize-none'
                rows={4}
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className='block text-xs text-gray-500 uppercase tracking-wider mb-3'>
                Domain
              </label>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {[
                  { value: 'business', label: 'Business', icon: '💼' },
                  { value: 'medical', label: 'Medical', icon: '⚕️' },
                  { value: 'personal', label: 'Personal', icon: '👤' },
                  { value: 'civic', label: 'Civic', icon: '🏛️' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`p-4 rounded-xl border transition-all ${
                      category === cat.value
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className='text-2xl mb-2'>{cat.icon}</div>
                    <div className='text-xs text-gray-400'>{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className='block text-xs text-gray-500 uppercase tracking-wider mb-3'>
                Complexity
              </label>
              <div className='grid grid-cols-3 gap-3'>
                {[
                  { value: 'beginner', label: 'Simple', dots: 1 },
                  { value: 'intermediate', label: 'Moderate', dots: 2 },
                  { value: 'advanced', label: 'Complex', dots: 3 },
                ].map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setDifficulty(level.value)}
                    className={`py-3 px-4 rounded-xl border transition-all ${
                      difficulty === level.value
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className='flex justify-center gap-1 mb-2'>
                      {[...Array(level.dots)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            difficulty === level.value
                              ? 'bg-purple-400'
                              : 'bg-gray-700'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <div className='text-xs text-gray-400'>{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Decision Points Slider */}
            <div>
              <div className='flex justify-between items-center mb-3'>
                <label className='text-xs text-gray-500 uppercase tracking-wider'>
                  Decision Nodes
                </label>
                <span className='text-sm text-cyan-400 font-light'>
                  {numSteps}
                </span>
              </div>

              {/* Custom slider */}
              <div className='relative'>
                <input
                  type='range'
                  min='2'
                  max='5'
                  value={numSteps}
                  onChange={(e) => setNumSteps(parseInt(e.target.value))}
                  className='w-full h-1 bg-gray-800 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-cyan-500
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-4
                    [&::-moz-range-thumb]:h-4
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-cyan-500
                    [&::-moz-range-thumb]:border-0
                    [&::-moz-range-thumb]:cursor-pointer'
                />
                <div className='flex justify-between mt-2'>
                  {[2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`w-1 h-1 rounded-full ${
                        n <= numSteps ? 'bg-cyan-500' : 'bg-gray-800'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className='flex justify-between text-xs text-gray-700 mt-2'>
                <span>Quick</span>
                <span>Detailed</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='p-4 bg-red-500/10 border border-red-500/30 rounded-xl'>
                <p className='text-sm text-red-400'>{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className='w-full py-4 bg-linear-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-800 rounded-xl font-light transition-all disabled:cursor-not-allowed group'
            >
              {loading ? (
                <span className='flex items-center justify-center gap-3'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin'></div>
                  <span className='text-sm tracking-wide'>
                    Generating Neural Pathway...
                  </span>
                </span>
              ) : (
                <span className='flex items-center justify-center gap-2 text-sm tracking-wide'>
                  <svg
                    className='w-5 h-5 group-hover:rotate-90 transition-transform duration-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                  Initialize Pathway
                </span>
              )}
            </button>

            {/* Info Text */}
            <p className='text-xs text-center text-gray-600 font-light'>
              AI generation takes 10-15 seconds • Powered by Llama 3.3 70B
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
