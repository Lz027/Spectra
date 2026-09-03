const ToolCardSkeleton = ({ index = 0 }: { index?: number }) => (
  <div
    className="skeleton-shimmer relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-4 sm:p-5"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    <div className="mb-4 flex items-start gap-3 sm:gap-4">
      <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-secondary sm:h-14 sm:w-14" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded-full bg-secondary" />
        <div className="flex gap-2">
          <div className="h-4 w-20 rounded-full bg-secondary/70" />
          <div className="h-4 w-12 rounded-full bg-secondary/70" />
        </div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 w-full rounded-full bg-secondary/70" />
      <div className="h-3 w-5/6 rounded-full bg-secondary/70" />
    </div>
    <div className="mt-5 h-3 w-24 rounded-full bg-secondary/70" />
  </div>
);

export default ToolCardSkeleton;
