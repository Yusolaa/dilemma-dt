'use client';

import Link from 'next/link';
import { Scenario } from '@/lib/types';
import { useState } from 'react';

interface Props {
  scenario: Scenario;
  index: number;
}

export default function ScenarioNode({ scenario, index }: Props) {
  const [isHovered, setIsHovered] = useState(false);

  const colors = [
    { border: 'border-cyan-500', bg: 'bg-cyan-500', text: 'text-cyan-400' },
    {
      border: 'border-purple-500',
      bg: 'bg-purple-500',
      text: 'text-purple-400',
    },
    { border: 'border-pink-500', bg: 'bg-pink-500', text: 'text-pink-400' },
  ];

  const color = colors[index % colors.length];

  return (
    <Link
      href={`/scenario/${scenario.id}`}
      className='relative flex flex-col items-center group cursor-pointer'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Node Circle */}
      <div className='relative mb-4'>
        {/* Outer glow ring on hover */}
        {isHovered && (
          <div
            className={`absolute inset-0 rounded-full ${color.bg} opacity-20 blur-xl animate-pulse`}
            style={{ width: '110px', height: '110px', margin: '-5px' }}
          ></div>
        )}

        {/* Main node */}
        <div
          className={`relative w-24 h-24 rounded-full border ${color.border} ${
            isHovered ? 'border-opacity-80' : 'border-opacity-30'
          } bg-black/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105`}
        >
          {/* Inner content */}
          <div className='text-center'>
            <div className={`text-lg font-light ${color.text}`}>
              {scenario.decision_points.length}
            </div>
            <div className='text-[10px] text-gray-600 uppercase tracking-wide'>
              nodes
            </div>
          </div>

          {/* Connecting dot at bottom */}
          <div
            className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${color.bg} translate-y-1/2 opacity-50`}
          ></div>
        </div>
      </div>

      {/* Node Label - Compact */}
      <div className='text-center max-w-40'>
        <h3
          className={`text-xs font-light mb-1.5 transition-colors ${
            isHovered ? color.text : 'text-gray-400'
          }`}
        >
          {scenario.title}
        </h3>

        {/* Metadata - Ultra minimal */}
        <div className='flex gap-1.5 justify-center text-[10px]'>
          <span className='text-gray-600'>{scenario.category}</span>
          <span className='text-gray-700'>•</span>
          <span className='text-gray-600'>{scenario.estimated_time}m</span>
        </div>
      </div>
    </Link>
  );
}
