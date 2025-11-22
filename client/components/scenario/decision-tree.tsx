'use client';

import { Scenario, FrameworkAnalysis } from '@/lib/types';
import TreeNode from './tree-node';
import FrameworkOrbit from './framework-orbit';
import ConsequenceBranch from './consequence-branch';

interface DecisionHistoryItem {
  step: number;
  choiceId: string;
  choiceText: string;
  analysis: FrameworkAnalysis;
  consequence: string | null;
  consequenceTriggerStep: number | null;
  consequenceTriggerChoice: string | null;
}

interface Props {
  scenario: Scenario;
  currentStep: number;
  decisionHistory: DecisionHistoryItem[];
  onChoice: (choiceId: string, choiceText: string) => void;
  loading: boolean;
  isComplete: boolean;
  onRestart: () => void;
}

export default function DecisionTree({
  scenario,
  currentStep,
  decisionHistory,
  onChoice,
  loading,
  isComplete,
  onRestart,
}: Props) {
  const currentDecisionPoint = scenario.decision_points.find(
    (dp) => dp.step === currentStep
  );

  const lastDecision = decisionHistory[decisionHistory.length - 1];

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Tree Container */}
      <div className='relative flex flex-col items-center gap-8'>
        {/* Previous Decisions - Collapsed View */}
        {decisionHistory.map((decision, index) => (
          <div key={decision.step} className='w-full'>
            {/* Past Decision Node - Dimmed */}
            <div className='flex flex-col items-center'>
              <div className='w-16 h-16 rounded-full border border-gray-700 bg-black/50 flex items-center justify-center mb-2'>
                <span className='text-xs text-gray-600'>{decision.step}</span>
              </div>
              <p className='text-xs text-gray-700 text-center mb-2 max-w-md'>
                {decision.choiceText}
              </p>

              {/* Connecting line */}
              <div className='w-px h-8 bg-linear-to-b from-cyan-500/30 to-transparent'></div>

              {/* Consequence Branch if exists */}
              {decision.consequence && decision.consequenceTriggerStep && (
                <ConsequenceBranch
                  consequence={decision.consequence}
                  triggerStep={decision.consequenceTriggerStep}
                  currentStep={currentStep}
                  triggeringChoice={
                    decision.consequenceTriggerChoice || 'Previous choice'
                  }
                />
              )}

              {index < decisionHistory.length - 1 && (
                <div className='w-px h-8 bg-linear-to-b from-cyan-500/30 to-transparent'></div>
              )}
            </div>
          </div>
        ))}

        {/* Current Decision Node */}
        {!isComplete && currentDecisionPoint && (
          <div className='w-full'>
            {/* Connecting line from previous */}
            {decisionHistory.length > 0 && (
              <div className='w-px h-8 bg-linear-to-b from-cyan-500/50 to-cyan-500 mx-auto mb-8'></div>
            )}

            <TreeNode
              decisionPoint={currentDecisionPoint}
              onChoice={onChoice}
              loading={loading}
              isActive={true}
            />

            {/* Framework Analysis Orbiting */}
            {lastDecision && lastDecision.step === currentStep - 1 && (
              <FrameworkOrbit analysis={lastDecision.analysis} />
            )}
          </div>
        )}

        {/* Completion State */}
        {isComplete && (
          <div className='w-full mt-12'>
            <div className='flex flex-col items-center'>
              {/* Final Node */}
              <div className='w-24 h-24 rounded-full border-2 border-cyan-500 bg-linear-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6 animate-pulse'>
                <svg
                  className='w-10 h-10 text-cyan-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>

              <h2 className='text-xl font-light text-gray-300 mb-2'>
                Pathway Complete
              </h2>
              <p className='text-sm text-gray-600 mb-8 text-center max-w-md'>
                You've navigated through {scenario.decision_points.length}{' '}
                decision nodes
              </p>

              {/* Last Analysis if exists */}
              {lastDecision && (
                <FrameworkOrbit analysis={lastDecision.analysis} />
              )}

              {/* Actions */}
              <div className='flex gap-4 mt-8'>
                <button
                  onClick={onRestart}
                  className='px-6 py-2 border border-cyan-500/50 rounded-full text-sm hover:bg-cyan-500/10 transition-colors'
                >
                  Restart Pathway
                </button>
                <button
                  onClick={() => window.history.back()}
                  className='px-6 py-2 border border-gray-700 rounded-full text-sm hover:bg-gray-800/50 transition-colors'
                >
                  Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
