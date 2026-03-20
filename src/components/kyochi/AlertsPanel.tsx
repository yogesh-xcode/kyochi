import { TriangleAlert } from "lucide-react";

import { AlertIcon } from "@/components/kyochi/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { AlertItem } from "@/types";

type AlertsPanelProps = {
  alerts: AlertItem[];
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <Card className="k-surface rounded-xl shadow-sm overflow-hidden flex flex-col py-0 ring-0 gap-0">
      <CardHeader className="px-4 py-3 border-b k-border-soft k-brand-soft-tint-bg">
        <CardTitle className="type-h3 text-[18px] k-text-strong flex items-center gap-2">
          <TriangleAlert className="size-4 k-brand-strong" />
          Intelligence Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
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
                <Button variant="ghost" className="type-small font-bold k-brand hover:underline bg-transparent hover:bg-transparent p-0 h-auto">
                  {alert.action}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="mt-auto p-3 border-t k-border-soft bg-transparent">
        <Button variant="outline" className="w-full py-1.5 type-small font-bold rounded-xl h-auto border k-border-soft k-surface-muted k-text-body hover:bg-(--k-color-surface) hover:text-(--k-color-text-strong)">
          Clear All Resolved
        </Button>
      </CardFooter>
    </Card>
  );
}
