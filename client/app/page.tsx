import Link from 'next/link';
import { fetchScenarios } from '@/lib/api';
import NeuralBackground from '@/components/neural-background';
import ScenarioNode from '@/components/scenario-node';

export default async function Home() {
  const scenarios = await fetchScenarios();

  return (
    <main className='min-h-screen bg-black text-white relative overflow-hidden'>
      {/* Animated Neural Network Background */}
      <NeuralBackground />

      {/* Content */}
      <div className='relative z-10 px-8 py-12'>
        {/* Compact Header */}
        <header className='max-w-7xl mx-auto mb-16 flex items-center justify-between'>
          {/* Logo/Title - Left */}
          <div className='flex items-center gap-3'>
            <div className='w-6 h-6 rounded-full bg-linear-to-r from-cyan-500 to-purple-500'></div>
            <h1 className='text-xl font-extralight tracking-widest text-gray-300'>
              DILEMMA TREE
            </h1>
          </div>

          {/* Generate Button - Right */}
          <Link
            href='/generate'
            className='px-5 py-2 border border-cyan-500/30 rounded-full text-sm font-light hover:border-cyan-500/60 hover:bg-cyan-500/5 transition-all'
          >
            + New Pathway
          </Link>
        </header>

        {/* Main Content Area */}
        <div className='max-w-7xl mx-auto'>
          {/* Subtitle - Minimal */}
          <div className='text-center mb-12'>
            <p className='text-sm text-gray-500 font-light tracking-wide'>
              {scenarios.length} Active Neural Pathways
            </p>
          </div>

          {scenarios.length === 0 ? (
            /* Empty State - Centered */
            <div className='flex flex-col items-center justify-center min-h-[60vh]'>
              <div className='w-20 h-20 mb-6 rounded-full border border-dashed border-cyan-500/20 flex items-center justify-center'>
                <div className='w-3 h-3 rounded-full bg-cyan-500/50'></div>
              </div>
              <p className='text-gray-600 text-sm mb-6 font-light'>
                No pathways initialized
              </p>
              <Link
                href='/generate'
                className='px-6 py-2.5 border border-cyan-500/40 rounded-full text-sm hover:bg-cyan-500/10 transition-colors font-light'
              >
                Initialize First Node
              </Link>
            </div>
          ) : (
            /* Node Network Layout */
            <div className='relative'>
              {/* Connection lines (SVG) */}
              <svg
                className='absolute inset-0 w-full h-full pointer-events-none'
                style={{ zIndex: 0 }}
              >
                <defs>
                  <linearGradient
                    id='line-gradient'
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='0%'
                  >
                    <stop offset='0%' stopColor='rgb(6 182 212 / 0.15)' />
                    <stop offset='100%' stopColor='rgb(168 85 247 / 0.15)' />
                  </linearGradient>
                </defs>
                {scenarios.map((_, index) => {
                  if (index === scenarios.length - 1) return null;
                  const fromIndex = index;
                  const toIndex = index + 1;

                  // Calculate positions
                  const cols = Math.min(scenarios.length, 4);
                  const fromRow = Math.floor(fromIndex / cols);
                  const fromCol = fromIndex % cols;
                  const toRow = Math.floor(toIndex / cols);
                  const toCol = toIndex % cols;

                  const fromX = (fromCol + 0.5) * (100 / cols);
                  const fromY = fromRow * 280 + 140;
                  const toX = (toCol + 0.5) * (100 / cols);
                  const toY = toRow * 280 + 140;

                  return (
                    <line
                      key={`line-${index}`}
                      x1={`${fromX}%`}
                      y1={fromY}
                      x2={`${toX}%`}
                      y2={toY}
                      stroke='url(#line-gradient)'
                      strokeWidth='0.5'
                      opacity='0.4'
                    />
                  );
                })}
              </svg>

              {/* Scenario Nodes Grid */}
              <div
                className='grid gap-10 md:gap-14 relative'
                style={{
                  gridTemplateColumns: `repeat(${Math.min(
                    scenarios.length,
                    4
                  )}, 1fr)`,
                }}
              >
                {scenarios.map((scenario, index) => (
                  <ScenarioNode
                    key={scenario.id}
                    scenario={scenario}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
