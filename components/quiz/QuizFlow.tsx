'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSkinBaseStore } from '@/lib/store';
import QuizNameStep from './QuizNameStep';
import SkinTypeStep from './SkinTypeStep';
import ConcernsStep from './ConcernsStep';
import SafetyTagsStep from './SafetyTagsStep';
import BudgetStep from './BudgetStep';
import ExperienceStep from './ExperienceStep';

const steps = [
  { component: QuizNameStep, label: 'Name' },
  { component: SkinTypeStep, label: 'Skin Type' },
  { component: ConcernsStep, label: 'Concerns' },
  { component: SafetyTagsStep, label: 'Safety' },
  { component: BudgetStep, label: 'Budget' },
  { component: ExperienceStep, label: 'Experience' },
];

export default function QuizFlow({ onComplete }: { onComplete: () => void }) {
  const { currentStep, setCurrentStep, quizResults, completeQuiz, userName } = useSkinBaseStore();

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Name is optional
      case 1: return quizResults.skinType !== null;
      case 2: return quizResults.concerns.length > 0;
      case 3: return true; // safety tags are optional
      case 4: return quizResults.budget !== null;
      case 5: return quizResults.experience !== null;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeQuiz();
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 0) {
      // Skip name step
      setCurrentStep(1);
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, i) => (
            <button
              key={step.label}
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`text-xs font-medium transition-colors ${
                i <= currentStep ? 'text-[#1B2B4B]' : 'text-[#A8A29E]'
              } ${i < currentStep ? 'cursor-pointer hover:text-[#253860]' : 'cursor-default'}`}
            >
              {step.label}
            </button>
          ))}
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E7DFD5' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #1B2B4B, #111C30)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <StepComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
            currentStep > 0
              ? 'text-[#78716C] hover:bg-[#F5F0EA]'
              : 'invisible'
          }`}
        >
          Back
        </button>

        <div className="flex items-center gap-3">
          {currentStep === 0 && !userName && (
            <button
              onClick={handleSkip}
              className="text-sm font-medium transition-colors"
              style={{ color: '#A8A29E' }}
            >
              Skip
            </button>
          )}
          <motion.button
            onClick={handleNext}
            disabled={!canProceed()}
            whileHover={canProceed() ? { scale: 1.02 } : {}}
            whileTap={canProceed() ? { scale: 0.98 } : {}}
            className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all ${
              canProceed()
                ? 'text-white shadow-lg hover:shadow-xl'
                : 'cursor-not-allowed'
            }`}
            style={{
              background: canProceed()
                ? 'linear-gradient(135deg, #1B2B4B, #111C30)'
                : '#F5F0EA',
              color: canProceed() ? '#FFFFFF' : '#A8A29E',
              boxShadow: canProceed() ? '0 4px 16px rgba(27,43,75,0.25)' : 'none',
            }}
          >
            {currentStep === steps.length - 1 ? 'See My Routine' : 'Next'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
