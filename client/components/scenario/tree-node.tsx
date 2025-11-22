import { DecisionPoint } from '@/lib/types';

interface Props {
  decisionPoint: DecisionPoint;
  onChoice: (choiceId: string, choiceText: string) => void;
  loading: boolean;
  isActive: boolean;
}

export default function TreeNode({
  decisionPoint,
  onChoice,
  loading,
  isActive,
}: Props) {
  return (
    <div className='flex flex-col items-center'>
      {/* Main Decision Node */}
      <div
        className={`relative w-32 h-32 rounded-full border-2 ${
          isActive ? 'border-cyan-500' : 'border-gray-700'
        } bg-black flex items-center justify-center mb-6 ${
          isActive ? 'animate-pulse' : ''
        }`}
      >
        <div className='text-center'>
          <div className='text-lg font-light text-cyan-400'>
            {decisionPoint.step}
          </div>
          <div className='text-[10px] text-gray-600 uppercase'>node</div>
        </div>

        {/* Glow effect */}
        {isActive && (
          <div className='absolute inset-0 rounded-full bg-cyan-500/20 blur-xl'></div>
        )}
      </div>

      {/* Context */}
      <div className='max-w-2xl mb-8 text-center'>
        <p className='text-sm text-gray-400 leading-relaxed mb-6'>
          {decisionPoint.context}
        </p>
        <h3 className='text-base font-light text-gray-200'>
          {decisionPoint.prompt}
        </h3>
      </div>

      {/* Choice Branches */}
      <div className='relative flex justify-center gap-6 flex-wrap max-w-3xl'>
        {decisionPoint.choices.map((choice, index) => {
          const angle = (index - (decisionPoint.choices.length - 1) / 2) * 30;

          return (
            <div key={choice.id} className='relative group'>
              {/* Branch line */}
              <div
                className='absolute bottom-full left-1/2 w-px h-12 bg-linear-to-t from-cyan-500/50 to-transparent transform -translate-x-1/2'
                style={{
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  transformOrigin: 'bottom',
                }}
              ></div>

              {/* Choice Button */}
              <button
                onClick={() => onChoice(choice.id, choice.text)}
                disabled={loading}
                className='relative px-6 py-4 min-w-[200px] border border-cyan-500/30 rounded-2xl bg-black/80 hover:border-cyan-500/60 hover:bg-cyan-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105'
              >
                <div className='flex items-start gap-3'>
                  <span className='text-cyan-500 font-light text-sm'>
                    {choice.id}
                  </span>
                  <span className='text-gray-300 text-sm text-left flex-1'>
                    {choice.text}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className='mt-8 flex flex-col items-center'>
          <div className='w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2'></div>
          <p className='text-xs text-gray-600'>Processing decision...</p>
        </div>
      )}
    </div>
  );
}
