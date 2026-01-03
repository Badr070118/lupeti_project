'use client';

interface CheckoutStepsProps {
  current: number;
  steps: string[];
}

export function CheckoutSteps({ current, steps }: CheckoutStepsProps) {
  return (
    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        return (
          <span
            key={label}
            className={`rounded-full px-3 py-1 ${
              stepNumber === current
                ? 'bg-rose-100 text-rose-600'
                : stepNumber < current
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-400'
            }`}
          >
            {stepNumber}. {label}
          </span>
        );
      })}
    </div>
  );
}
