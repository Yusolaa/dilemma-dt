'use client';

import { useState, useEffect } from 'react';

interface Props {
  consequence: string;
  triggerStep: number;
  currentStep: number;
  triggeringChoice: string;
}

export default function ConsequenceBranch({
  consequence,
  triggerStep,
  currentStep,
  triggeringChoice,
}: Props) {
  const [isRevealing, setIsRevealing] = useState(true);

  useEffect(() => {
    // Auto-close reveal animation after 5 seconds
    const timer = setTimeout(() => setIsRevealing(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const stepsAgo = currentStep - triggerStep;

  return (
    <div className='relative my-8'>
      {/* Causal Chain Visualization */}
      <div
        className={`transition-all duration-1000 ${
          isRevealing ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
        }`}
      >
        {/* Timeline showing cause and effect */}
        <div className='flex flex-col items-center mb-6'>
          {/* Origin Node */}
          <div className='flex items-center gap-4 mb-4'>
            <div className='text-right flex-1'>
              <p className='text-xs text-gray-500 mb-1'>
                {stepsAgo} {stepsAgo === 1 ? 'step' : 'steps'} ago
              </p>
              <p className='text-xs text-cyan-400 font-light'>
                Step {triggerStep}
              </p>
            </div>

            {/* Origin point */}
            <div className='w-8 h-8 rounded-full border-2 border-cyan-500 bg-cyan-500/20 flex items-center justify-center'>
              <div className='w-2 h-2 rounded-full bg-cyan-500 animate-pulse'></div>
            </div>

            <div className='flex-1'>
              <p className='text-xs text-gray-400 max-w-xs'>
                {triggeringChoice}
              </p>
            </div>
          </div>

          {/* Connecting flow */}
          <div className='relative h-16 w-px'>
            {/* Animated line */}
            <div
              className='absolute inset-0 w-px bg-linear-to-b from-cyan-500 via-amber-500 to-amber-500'
              style={{
                animation: isRevealing ? 'flowDown 2s ease-out' : 'none',
              }}
            ></div>

            {/* Pulse dots along the line */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400'
                style={{
                  top: `${(i + 1) * 25}%`,
                  animation: isRevealing
                    ? `pulse 1s ease-out ${i * 0.3}s`
                    : 'none',
                }}
              ></div>
            ))}

            {/* Ripple effect */}
            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border border-cyan-500/30 animate-ping'></div>
          </div>

          {/* Impact indicator */}
          <div className='mb-4'>
            <div className='flex items-center gap-2'>
              <div className='h-px w-8 bg-linear-to-r from-transparent to-amber-500/50'></div>
              <span className='text-[10px] text-amber-400 uppercase tracking-wider'>
                Ripple Effect
              </span>
              <div className='h-px w-8 bg-linear-to-l from-transparent to-amber-500/50'></div>
            </div>
          </div>
        </div>

        {/* Consequence Box */}
        <div
          className={`relative overflow-hidden transition-all duration-1000 ${
            isRevealing ? 'max-h-96' : 'max-h-24'
          }`}
        >
          {/* Glow effect */}
          <div className='absolute inset-0 bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent animate-pulse'></div>

          <div className='relative p-6 bg-black/90 border-2 border-amber-500/40 rounded-2xl backdrop-blur-sm'>
            {/* Header */}
            <div className='flex items-start gap-4 mb-4'>
              <div className='shrink-0'>
                <div className='w-12 h-12 rounded-full bg-linear-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center border border-amber-500/50'>
                  <span className='text-2xl'>⚡</span>
                </div>
              </div>

              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <h4 className='text-sm font-light text-amber-400 uppercase tracking-wide'>
                    Consequence Triggered
                  </h4>
                  {isRevealing && (
                    <div className='px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded-full'>
                      <span className='text-[10px] text-amber-300'>New</span>
                    </div>
                  )}
                </div>

                <p className='text-sm text-gray-300 leading-relaxed'>
                  {consequence}
                </p>
              </div>
            </div>

            {/* Causal explanation */}
            {isRevealing && (
              <div className='mt-4 pt-4 border-t border-amber-500/20'>
                <p className='text-xs text-gray-500 italic'>
                  This outcome stems from your choice at step {triggerStep}.
                  Every decision creates ripples that surface later.
                </p>
              </div>
            )}

            {/* Collapse button */}
            <button
              onClick={() => setIsRevealing(!isRevealing)}
              className='absolute top-4 right-4 text-gray-600 hover:text-gray-400 transition-colors'
            >
              <svg
                className={`w-4 h-4 transition-transform ${
                  isRevealing ? 'rotate-180' : ''
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Connection Line Below (if not last) */}
        <div className='flex justify-center mt-6'>
          <div className='w-px h-8 bg-linear-to-b from-amber-500/50 to-transparent'></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes flowDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
