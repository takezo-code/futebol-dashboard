type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`bg-border animate-pulse rounded-md motion-reduce:animate-none ${className}`}
    />
  );
}
