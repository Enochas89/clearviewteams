import React from 'react';
import { X, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingTourProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    title: 'Stay Clear on Site',
    desc: 'Track project chatter, change orders, and RFIs in one focused workspace.',
  },
  {
    title: 'Switch Views Fast',
    desc: 'Use the left nav or bottom bar to jump between feed, tasks, and budget.',
  },
  {
    title: 'Keep the Team Notified',
    desc: 'Post quick updates and watch notifications for approvals and field activity.',
  },
];

export function OnboardingTour({ open, onClose }: OnboardingTourProps) {
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  if (!open) return null;

  const isLast = step === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 font-bold">New to Clear View</p>
            <h2 className="text-lg font-black text-slate-900">Quick Tour</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
            aria-label="Close tour"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">{steps[step].title}</h3>
              <p className="text-sm text-slate-600 mt-1">{steps[step].desc}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all ${i === step ? 'w-12 bg-emerald-500' : 'w-6 bg-slate-200'}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700 text-sm font-semibold"
            >
              Skip
            </button>
            <div className="flex items-center gap-3">
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => {
                  if (isLast) {
                    onClose();
                    return;
                  }
                  setStep((s) => Math.min(steps.length - 1, s + 1));
                }}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-emerald-100"
              >
                {isLast ? 'Done' : 'Next'}
                {!isLast && <ArrowRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
