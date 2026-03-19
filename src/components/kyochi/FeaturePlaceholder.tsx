import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type FeaturePlaceholderProps = {
  heading: string;
  description: string;
};

export function FeaturePlaceholder({ heading, description }: FeaturePlaceholderProps) {
  return (
    <Card className="k-surface rounded-xl border k-border-soft shadow-sm py-0 ring-0 gap-0">
      <CardHeader className="p-6 pb-0">
      <CardTitle className="type-h3 k-text-strong">{heading}</CardTitle>
      <p className="type-body k-text-body mt-2">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
      <div className="rounded-lg border border-dashed k-border-soft k-surface-muted p-4">
        <p className="type-small k-text-subtle">Coming soon: route-specific management widgets.</p>
      </div>
      </CardContent>
    </Card>
  );
}
