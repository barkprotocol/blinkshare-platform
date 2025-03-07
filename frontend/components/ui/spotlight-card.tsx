"use client";

import clsx from "clsx";
import { useRef, useMemo } from "react";
import { useMouse } from "react-use";

interface SpotlightCardProps {
  as?: React.ElementType;
  from?: string;
  via?: string | null;
  to?: string;
  size?: number;
  mode?: "before" | "after";
  hsl?: boolean;
  hslMin?: number;
  hslMax?: number;
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({
  as: Component = "div",
  from = "rgba(255,255,255,0.8)",
  via = null,
  to = "transparent",
  size = 350,
  mode = "before",
  hsl = false,
  hslMin = 0,
  hslMax = 360,
  children,
  className,
  ...props
}: SpotlightCardProps) {
  // Ref with a fallback to undefined for compatibility with useMouse
  const container = useRef<Element>(null as any);

  const { elX, elY, elW, elH } = useMouse(container);

  const spotlightColorStops = useMemo(() => {
    if (hsl) {
      const margin = hslMax - hslMin;
      const rate = (elY + elX) / (elH + elW);
      const hue = Math.round(margin * rate + hslMin);

      return `hsl(${hue} 80% 70%),transparent`;
    }

    return [from, via, to].filter((value) => !!value).join(",");
  }, [hsl, hslMax, hslMin, from, via, to, elY, elX, elH, elW]);

  const classes =
    mode === "before"
      ? `before:absolute before:inset-0 before:bg-[radial-gradient(var(--spotlight-size)_circle_at_var(--x)_var(--y),var(--spotlight-color-stops))]`
      : `after:absolute after:inset-0 after:bg-[radial-gradient(var(--spotlight-size)_circle_at_var(--x)_var(--y),var(--spotlight-color-stops))]`;

  return (
    <Component
      ref={container}
      className={clsx(
        "relative transform-gpu overflow-hidden",
        classes,
        className
      )}
      {...props}
      style={{
        "--x": `${elX}px`,
        "--y": `${elY}px`,
        "--spotlight-color-stops": spotlightColorStops,
        "--spotlight-size": `${size}px`,
      }}
    >
      {children}
    </Component>
  );
}
