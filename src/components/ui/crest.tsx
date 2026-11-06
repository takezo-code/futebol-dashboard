"use client";

import Image from "next/image";
import { useState } from "react";

type CrestProps = {
  src: string | null;
  name: string;
  size: number;
};

export function Crest({ src, name, size }: CrestProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <span
        aria-hidden="true"
        className="bg-border text-muted font-display inline-flex shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
        style={{ width: size, height: size }}
      >
        {name.slice(0, 3).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`Escudo: ${name}`}
      width={size}
      height={size}
      unoptimized
      className="shrink-0 object-contain"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
