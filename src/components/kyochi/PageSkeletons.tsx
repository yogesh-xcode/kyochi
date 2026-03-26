import type { CSSProperties } from "react";

type SkeletonBoxProps = {
  className: string;
  style?: CSSProperties;
};

function SkeletonBox({ className, style }: SkeletonBoxProps) {
  return <div aria-hidden className={`k-skeleton ${className}`} style={style} />;
}

type ManagementPageSkeletonProps = {
  kpiCount?: number;
  rowCount?: number;
  columnCount?: number;
  showSelection?: boolean;
  showUploadAction?: boolean;
  showAddAction?: boolean;
};

export function ManagementPageSkeleton({
  kpiCount = 4,
  rowCount = 8,
  columnCount = 6,
  showSelection = true,
  showUploadAction = true,
  showAddAction = true,
}: ManagementPageSkeletonProps) {
  const totalColumns = columnCount + 1 + (showSelection ? 1 : 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: kpiCount }).map((_, index) => (
          <div
            key={`kpi-skeleton-${index}`}
            className="k-surface rounded-xl border k-border-soft border-l-[3px] border-l-[var(--kyochi-gold-500)] px-5 py-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <SkeletonBox className="size-9 rounded-lg" />
              <SkeletonBox className="h-5 w-16 rounded-full" />
            </div>
            <SkeletonBox className="h-3 w-20 rounded" />
            <SkeletonBox className="mt-2 h-8 w-24 rounded" />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-1 flex-wrap items-center gap-2 min-w-[280px]">
            <SkeletonBox className="h-9 w-full max-w-md rounded-md" />
            <SkeletonBox className="h-9 w-24 rounded-md" />
            <SkeletonBox className="h-9 w-24 rounded-md" />
            <SkeletonBox className="h-9 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            {showUploadAction ? <SkeletonBox className="h-9 w-28 rounded-md" /> : null}
            {showAddAction ? <SkeletonBox className="h-9 w-24 rounded-md" /> : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border k-border-soft bg-white">
          <div
            className="grid items-center gap-2 border-b k-border-soft bg-[#f5f2e8] px-4 py-3"
            style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: totalColumns }).map((_, index) => (
              <SkeletonBox
                key={`header-col-${index}`}
                className={`h-3 rounded ${index === 0 ? "w-12" : index === totalColumns - 1 ? "w-14" : "w-20"}`}
              />
            ))}
          </div>

          <div>
            {Array.from({ length: rowCount }).map((_, rowIndex) => (
              <div
                key={`row-skeleton-${rowIndex}`}
                className={`grid h-[52px] items-center gap-2 border-b border-[var(--k-color-border-soft)] px-4 ${
                  rowIndex % 2 === 1 ? "bg-[#fbf8ef]" : "bg-white"
                }`}
                style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: totalColumns }).map((_, colIndex) => (
                  <SkeletonBox
                    key={`row-${rowIndex}-col-${colIndex}`}
                    className={`h-3 rounded ${
                      colIndex === 0
                        ? "w-14"
                        : colIndex === 1
                          ? "w-28"
                          : colIndex === totalColumns - 1
                            ? "w-10"
                            : "w-20"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t k-border-soft pt-3 md:flex-row md:items-center md:justify-between">
          <SkeletonBox className="h-4 w-44 rounded" />
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-9 w-9 rounded-md" />
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonBox key={`page-pill-${index}`} className="h-9 w-9 rounded-md" />
            ))}
            <SkeletonBox className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`dash-kpi-${index}`} className="rounded-xl border k-border-soft bg-white p-4">
            <SkeletonBox className="h-3 w-20 rounded" />
            <SkeletonBox className="mt-2 h-8 w-24 rounded" />
            <SkeletonBox className="mt-2 h-3 w-16 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border k-border-soft bg-white p-4">
          <SkeletonBox className="h-4 w-32 rounded" />
          <SkeletonBox className="mt-4 h-56 w-full rounded-xl" />
        </div>
        <div className="rounded-xl border k-border-soft bg-white p-4">
          <SkeletonBox className="h-4 w-24 rounded" />
          <SkeletonBox className="mt-4 h-56 w-full rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border k-border-soft bg-white p-4">
          <SkeletonBox className="h-4 w-40 rounded" />
          <div className="mt-4 space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonBox key={`dash-row-${index}`} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border k-border-soft bg-white p-4">
          <SkeletonBox className="h-4 w-28 rounded" />
          <SkeletonBox className="mt-4 h-40 w-full rounded-xl" />
          <SkeletonBox className="mt-3 h-9 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function AccessManagerSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border k-border-soft bg-white p-4">
        <SkeletonBox className="h-5 w-40 rounded" />
        <SkeletonBox className="mt-2 h-3 w-64 rounded" />
      </div>

      <div className="overflow-hidden rounded-xl border k-border-soft bg-white">
        <div className="grid grid-cols-12 gap-2 border-b k-border-soft px-4 py-3">
          <SkeletonBox className="col-span-3 h-3 w-16 rounded" />
          <SkeletonBox className="col-span-2 h-3 w-16 rounded" />
          <SkeletonBox className="col-span-5 h-3 w-20 rounded" />
          <SkeletonBox className="col-span-2 ml-auto h-3 w-12 rounded" />
        </div>
        <div className="space-y-2 px-4 py-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={`access-row-${index}`} className="grid grid-cols-12 gap-2 items-center rounded-md border border-[var(--k-color-border-soft)]/70 px-2 py-2">
              <SkeletonBox className="col-span-3 h-8 w-full rounded" />
              <SkeletonBox className="col-span-2 h-6 w-20 rounded" />
              <SkeletonBox className="col-span-5 h-8 w-full rounded" />
              <SkeletonBox className="col-span-2 ml-auto h-8 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AiInsightsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {/* VERDICT BANNER SKELETON */}
      <div className="relative overflow-hidden rounded-xl border k-border-soft k-surface px-6 py-4 shadow-sm">
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-muted" />
        <div className="mb-2 flex items-center gap-2">
          <SkeletonBox className="h-3 w-24 rounded" />
          <SkeletonBox className="h-4 w-28 rounded-full" />
        </div>
        <div className="space-y-2 mb-4">
          <SkeletonBox className="h-4 w-[95%] rounded" />
          <SkeletonBox className="h-4 w-[90%] rounded" />
        </div>
        <div className="flex flex-wrap gap-3">
          <SkeletonBox className="h-9 w-32 rounded-lg" />
          <SkeletonBox className="h-9 w-32 rounded-lg" />
          <SkeletonBox className="h-9 w-32 rounded-lg" />
        </div>
      </div>

      {/* MAIN GRID SKELETON */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        {/* SIGNALS SKELETON */}
        <div className="flex flex-col gap-3">
          <SkeletonBox className="h-3 w-48 rounded ml-1" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`ai-signal-${index}`} className="k-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <SkeletonBox className="h-8 w-8 rounded-lg" />
                  <SkeletonBox className="h-5 w-16 rounded-full" />
                </div>
                <SkeletonBox className="h-8 w-24 rounded mb-1" />
                <SkeletonBox className="h-4 w-32 rounded mb-1" />
                <div className="space-y-1">
                  <SkeletonBox className="h-3 w-full rounded" />
                  <SkeletonBox className="h-3 w-4/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDATIONS SKELETON */}
        <div className="flex flex-col gap-3">
          <SkeletonBox className="h-3 w-56 rounded ml-1" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`ai-recommend-${index}`} className="k-card flex items-center gap-3 p-3">
                <SkeletonBox className="h-6 w-5 rounded" />
                <SkeletonBox className="h-5 flex-1 rounded" />
                <SkeletonBox className="h-5 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM GRID SKELETON */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* FOOTPRINT SKELETON */}
        <div className="k-card overflow-hidden">
          <div className="flex items-center justify-between border-b k-border-soft k-surface-muted px-4 py-2.5">
            <SkeletonBox className="h-4 w-36 rounded" />
            <SkeletonBox className="h-3 w-20 rounded" />
          </div>
          <div className="divide-y k-border-soft">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`ai-footprint-${index}`} className="flex items-center gap-3 px-4 py-2.5">
                <SkeletonBox className="h-2 w-2 rounded-full" />
                <SkeletonBox className="h-4 flex-1 rounded" />
                <SkeletonBox className="h-3 w-16 rounded" />
                <SkeletonBox className="h-1.5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* DEMAND SKELETON */}
        <div className="k-card overflow-hidden">
          <div className="flex items-center justify-between border-b k-border-soft k-surface-muted px-4 py-2.5">
            <SkeletonBox className="h-4 w-32 rounded" />
            <SkeletonBox className="h-3 w-24 rounded" />
          </div>
          <div className="divide-y k-border-soft">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`ai-demand-${index}`} className="flex items-center gap-3 px-4 py-2.5">
                <SkeletonBox className="h-4 flex-1 rounded" />
                <SkeletonBox className="h-1.5 w-24 rounded-full" />
                <SkeletonBox className="h-4 w-6 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type ShellLoadingSkeletonProps = {
  variant?: "dashboard" | "management";
};

export function ShellLoadingSkeleton({ variant = "management" }: ShellLoadingSkeletonProps) {
  const sidebarSections = [
    { labelWidth: "w-14", items: ["w-[120px]"] },
    { labelWidth: "w-16", items: ["w-[140px]", "w-[110px]", "w-[90px]", "w-[110px]"] },
    { labelWidth: "w-24", items: ["w-[110px]", "w-[100px]"] },
    { labelWidth: "w-[72px]", items: ["w-[95px]"] },
    { labelWidth: "w-20", items: ["w-[95px]", "w-[130px]"] },
  ];

  return (
    <div className="k-shell-bg min-h-screen flex overflow-hidden">
      <aside className="hidden lg:flex w-60 border-r k-border-soft bg-white/70 flex-col">
        <div className="h-[74px] border-b k-border-soft px-4 flex items-center gap-3">
          <SkeletonBox className="h-9 w-9 rounded-full" />
          <div className="space-y-2">
            <SkeletonBox className="h-6 w-24 rounded" />
            <SkeletonBox className="h-3 w-28 rounded" />
          </div>
        </div>
        <div className="flex-1 px-2 py-3 space-y-5 overflow-y-auto">
          {sidebarSections.map((section, sectionIndex) => (
            <div key={`shell-section-${sectionIndex}`}>
              <div className="px-2.5 mb-2">
                <SkeletonBox className={`h-2.5 ${section.labelWidth} rounded`} />
              </div>
              <div className="space-y-1">
                {section.items.map((itemWidthClass, itemIndex) => {
                  const isActiveRow =
                    sectionIndex === sidebarSections.length - 1 &&
                    itemIndex === section.items.length - 1;
                  return (
                    <div
                      key={`shell-item-${sectionIndex}-${itemIndex}`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                        isActiveRow
                          ? "border-[rgba(212,175,53,0.45)] bg-[linear-gradient(90deg,rgba(212,175,53,0.16),rgba(212,175,53,0.04))]"
                          : "border-transparent"
                      }`}
                    >
                      <SkeletonBox className="h-4 w-4 rounded" />
                      <SkeletonBox className={`h-5 rounded ${itemWidthClass}`} />
                      {sectionIndex === 3 && itemIndex === 0 ? (
                        <SkeletonBox className="ml-auto h-2 w-2 rounded-full" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t k-border-soft">
          <div className="flex items-center gap-2 p-1.5 rounded-xl k-surface-muted">
            <SkeletonBox className="h-8 w-8 rounded-full" />
            <div className="flex-1 min-w-0 space-y-1">
              <SkeletonBox className="h-4 w-24 rounded" />
              <SkeletonBox className="h-3 w-16 rounded" />
            </div>
            <SkeletonBox className="h-9 w-9 rounded-md" />
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="h-[74px] border-b k-border-soft bg-white/80 px-4 lg:px-6 flex items-center justify-between">
          <SkeletonBox className="h-6 w-52 rounded" />
          <div className="flex items-center gap-2">
            <SkeletonBox className="h-9 w-9 rounded-md" />
            <SkeletonBox className="h-9 w-9 rounded-md" />
          </div>
        </div>

        <div className="px-3 md:px-4 lg:px-6 pt-4">
          {variant === "dashboard" ? (
            <DashboardPageSkeleton />
          ) : (
            <ManagementPageSkeleton
              kpiCount={4}
              columnCount={5}
              rowCount={8}
              showSelection={false}
              showUploadAction
              showAddAction
            />
          )}
        </div>
      </main>
    </div>
  );
}
