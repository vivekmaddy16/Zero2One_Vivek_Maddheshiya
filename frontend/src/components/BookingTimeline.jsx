import { Check, Clock3 } from 'lucide-react';
import {
  BOOKING_TIMELINE_STEPS,
  getBookingTimelineHeadline,
  getBookingTimelineIndex,
} from '../utils/bookingTimeline';

export default function BookingTimeline({ status }) {
  const currentIndex = getBookingTimelineIndex(status);
  const isCancelled = status === 'cancelled';

  return (
    <div className="mt-6 rounded-[28px] border border-[#eadfc8] bg-[#fffdf8] p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Real-time status tracking</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink-900">{getBookingTimelineHeadline(status)}</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">
          <Clock3 className="h-4 w-4" />
          Visual timeline
        </div>
      </div>

      {isCancelled ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          This booking was cancelled before reaching the final service step.
        </div>
      ) : null}

      <div className="mt-5 hidden items-start md:flex">
        {BOOKING_TIMELINE_STEPS.map((step, index) => {
          const isCompleted = !isCancelled && index < currentIndex;
          const isCurrent = !isCancelled && index === currentIndex;
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <div key={step.key} className="flex flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${
                    isCompleted
                      ? 'border-accent-500 bg-accent-500 text-white'
                      : isCurrent
                        ? 'border-primary-500 bg-primary-500 text-white shadow-primary'
                        : 'border-[#e6d9c5] bg-white text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : index + 1}
                </div>
                <p className={`mt-3 text-sm font-semibold ${isUpcoming ? 'text-slate-400' : 'text-ink-900'}`}>{step.title}</p>
                <p className="mt-1 max-w-[180px] text-xs leading-6 text-slate-500">{step.description}</p>
              </div>
              {index < BOOKING_TIMELINE_STEPS.length - 1 ? (
                <div className={`mt-6 h-1 flex-1 rounded-full ${!isCancelled && index < currentIndex ? 'bg-accent-500' : 'bg-[#eadfc8]'}`} />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-3 md:hidden">
        {BOOKING_TIMELINE_STEPS.map((step, index) => {
          const isCompleted = !isCancelled && index < currentIndex;
          const isCurrent = !isCancelled && index === currentIndex;
          const isUpcoming = !isCompleted && !isCurrent;

          return (
            <div
              key={step.key}
              className={`flex items-start gap-4 rounded-2xl border px-4 py-4 ${
                isCompleted
                  ? 'border-accent-200 bg-accent-50'
                  : isCurrent
                    ? 'border-primary-200 bg-primary-50'
                    : 'border-[#eadfc8] bg-white'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  isCompleted
                    ? 'border-accent-500 bg-accent-500 text-white'
                    : isCurrent
                      ? 'border-primary-500 bg-primary-500 text-white'
                      : 'border-[#e6d9c5] bg-white text-slate-400'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div>
                <p className={`text-sm font-semibold ${isUpcoming ? 'text-slate-400' : 'text-ink-900'}`}>{step.title}</p>
                <p className="mt-1 text-xs leading-6 text-slate-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
