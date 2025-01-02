import { createContext, useContext, useId, ReactNode } from "react";

interface GridPatternContextProps {
  size: number;
  offsetX: number;
  offsetY: number;
}

interface GridProps {
  size?: number;
  offsetX?: number;
  offsetY?: number;
  children: ReactNode;
  className?: string;
}

interface BlockProps {
  row?: number;
  column?: number;
  className?: string;
}

const GridPatternContext = createContext<GridPatternContextProps | undefined>(undefined);

function Grid({ size = 64, offsetX = -1, offsetY = -1, children, className }: GridProps) {
  const id = useId();

  const context = {
    size,
    offsetX,
    offsetY,
  };

  return (
    <GridPatternContext.Provider value={context}>
      <svg className={className}>
        <defs>
          <pattern
            id={id}
            viewBox="0 0 64 64"
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <path d="M64 0H0V64" fill="none" />
          </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill={`url(#${id})`}
        ></rect>

        {children}
      </svg>
    </GridPatternContext.Provider>
  );
}

function Block({ row = 0, column = 0, className }: BlockProps) {
  const context = useContext(GridPatternContext);

  if (!context) {
    throw new Error("GridPattern context not found. Make sure Grid is used as a parent.");
  }

  return (
    <rect
      className={className}
      strokeWidth="0"
      width={context.size - 1}
      height={context.size - 1}
      x={column * context.size + context.offsetX + 1}
      y={row * context.size + context.offsetY + 1}
    />
  );
}

export const GridPattern = Object.assign(Grid, { Block });
