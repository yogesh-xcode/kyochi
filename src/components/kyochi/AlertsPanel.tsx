import { TriangleAlert } from "lucide-react";

import { AlertIcon } from "@/components/kyochi/primitives";
import type { AlertItem } from "@/types";

type AlertsPanelProps = {
  alerts: AlertItem[];
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <section className="k-surface rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b k-border-soft k-brand-soft-tint-bg">
        <h4 className="type-h3 text-[18px] k-text-strong flex items-center gap-2">
          <TriangleAlert className="size-4 k-brand-strong" />
          Intelligence Alerts
        </h4>
      </div>
      <div className="p-4 space-y-4">
        {alerts.map((alert) => (
          <div key={alert.title} className={`flex gap-3 ${alert.dimmed ? "opacity-60" : ""}`}>
            <AlertIcon tone={alert.tone} icon={alert.icon} />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <p className="type-small font-bold k-text-strong">{alert.title}</p>
                <span className="type-label normal-case tracking-normal text-[8px] k-text-subtle">{alert.time}</span>
              </div>
              <p className="type-small text-[12px] k-text-body leading-relaxed mb-1">{alert.body}</p>
              {alert.action && (
                <button className="type-small font-bold k-brand hover:underline">
                  {alert.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto p-3 border-t k-border-soft">
        <button className="w-full py-1.5 k-brand-soft-bg k-brand type-small font-bold rounded-xl k-brand-bg-hover hover:text-white transition-all">
          Clear All Resolved
        </button>
      </div>
    </section>
  );
}
