import Link from "next/link";
import type { ReactNode } from "react";

type TeamLinkProps = {
  id: number | null;
  children: ReactNode;
  className?: string;
};

export function TeamLink({ id, children, className = "" }: TeamLinkProps) {
  if (id === null) {
    return <span className={className}>{children}</span>;
  }
  return (
    <Link
      href={`/times/${id}`}
      className={`hover:text-brand focus-visible:outline-brand rounded-sm hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      {children}
    </Link>
  );
}
