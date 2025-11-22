'use client';

import { FrameworkAnalysis } from '@/lib/types';
import { useState } from 'react';

interface Props {
  analysis: FrameworkAnalysis;
}

const frameworks = [
  {
    key: 'utilitarian' as keyof FrameworkAnalysis,
    name: 'Utilitarian',
    emoji: '⚖️',
    color: 'cyan',
  },
  {
    key: 'deontological' as keyof FrameworkAnalysis,
    name: 'Deontological',
    emoji: '📜',
    color: 'purple',
  },
  {
    key: 'virtue_ethics' as keyof FrameworkAnalysis,
    name: 'Virtue',
    emoji: '🎯',
    color: 'pink',
  },
  {
    key: 'care_ethics' as keyof FrameworkAnalysis,
    name: 'Care',
    emoji: '🤝',
    color: 'blue',
  },
];

export default function FrameworkOrbit({ analysis }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className='relative w-full mx-auto max-w-md my-12'>
      {/* Center prompt */}
      <div className='text-center mb-2'>
        <p className='text-xs text-gray-600 uppercase tracking-wider'>
          Framework Analysis
        </p>
      </div>

      {/* Orbital Framework Nodes */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {frameworks.map((framework) => (
          <button
            key={framework.key}
            onClick={() =>
              setExpanded(expanded === framework.key ? null : framework.key)
            }
            className='relative group'
          >
            {/* Framework Node */}
            <div
              className={`w-full aspect-square rounded-2xl border border-${framework.color}-500/30 bg-black/80 hover:border-${framework.color}-500/60 hover:bg-${framework.color}-500/5 transition-all flex flex-col items-center justify-center p-4`}
            >
              <div className='text-3xl mb-2'>{framework.emoji}</div>
              <div className='text-xs text-gray-400 font-light'>
                {framework.name}
              </div>
            </div>

            {/* Expanded Analysis */}
            {expanded === framework.key && (
              <div className='absolute bottom-full left-0 w-full px-2 rounded-xl mt-2  z-50 text-left'>
                <p className='text-xs text-gray-300 leading-relaxed'>
                  {analysis[framework.key]}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
