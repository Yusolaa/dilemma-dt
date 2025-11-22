'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchScenario, submitDecision } from '@/lib/api';
import { Scenario, FrameworkAnalysis } from '@/lib/types';
import DecisionTree from '@/components/scenario/decision-tree';
import NeuralBackground from '@/components/neural-background';

export default function ScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;

  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<
    Array<{
      step: number;
      choiceId: string;
      choiceText: string;
      analysis: FrameworkAnalysis;
      consequence: string | null;
      consequenceTriggerStep: number | null;
      consequenceTriggerChoice: string | null;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Load scenario
  useEffect(() => {
    fetchScenario(scenarioId)
      .then(setScenario)
      .catch((err) => {
        console.error('Failed to load scenario:', err);
        router.push('/');
      });
  }, [scenarioId, router]);

  const handleChoice = async (choiceId: string, choiceText: string) => {
    if (!scenario || loading) return;

    setLoading(true);

    try {
      const response = await submitDecision({
        scenario_id: scenario.id,
        session_id: sessionId,
        step: currentStep,
        choice_id: choiceId,
        choice_text: choiceText,
      });

      // Add to history
      setDecisionHistory((prev) => [
        ...prev,
        {
          step: currentStep,
          choiceId,
          choiceText,
          analysis: response.analysis,
          consequence: response.consequence,
          consequenceTriggerStep: response.consequence_trigger_step, // NEW
          consequenceTriggerChoice: response.consequence_trigger_choice, // NEW
        },
      ]);

      setSessionId(response.session_id);

      // Check if complete
      if (response.is_final) {
        setIsComplete(true);
      } else if (response.next_step) {
        // Move to next step after brief delay
        setTimeout(() => {
          setCurrentStep(response.next_step!);
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to submit decision:', error);
      alert('Failed to submit decision. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setSessionId(null);
    setDecisionHistory([]);
    setIsComplete(false);
  };

  if (!scenario) {
    return (
      <div className='min-h-screen bg-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
          <p className='text-gray-500 text-sm'>Loading pathway...</p>
        </div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-black text-white relative overflow-hidden'>
      <NeuralBackground />

      <div className='relative z-10'>
        {/* Compact Header */}
        <header className='border-b border-cyan-500/10 backdrop-blur-sm bg-black/50'>
          <div className='max-w-7xl mx-auto px-8 py-4 flex items-center justify-between'>
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
              Exit
            </button>

            <div className='flex-1 text-center'>
              <h1 className='text-sm font-light text-gray-400 tracking-wide'>
                {scenario.title}
              </h1>
            </div>

            <div className='flex items-center gap-4 text-xs text-gray-600'>
              <span>
                Node {currentStep}/{scenario.decision_points.length}
              </span>
            </div>
          </div>
        </header>

        {/* Decision Tree Visualization */}
        <div className='py-12 px-8'>
          <DecisionTree
            scenario={scenario}
            currentStep={currentStep}
            decisionHistory={decisionHistory}
            onChoice={handleChoice}
            loading={loading}
            isComplete={isComplete}
            onRestart={handleRestart}
          />
        </div>
      </div>
    </main>
  );
}
