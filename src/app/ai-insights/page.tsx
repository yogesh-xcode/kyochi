import { AlertsPanel } from "@/components/kyochi/AlertsPanel";
import { FeaturePlaceholder } from "@/components/kyochi/FeaturePlaceholder";
import { alerts } from "@/components/kyochi/data";

export default function AiInsightsPage() {
  return (
    <div className="space-y-5">
      <FeaturePlaceholder
        heading="AI Insights Feed"
        description="Surface risk trends, recommendations, and proactive wellness interventions."
      />
      <AlertsPanel alerts={alerts} />
    </div>
  );
}
