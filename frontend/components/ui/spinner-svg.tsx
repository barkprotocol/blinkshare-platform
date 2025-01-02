import React from "react";

interface SpinnerSvgProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const SpinnerSvg: React.FC<SpinnerSvgProps> = ({ className, ...props }) => {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Your SVG content here */}
      <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" />
    </svg>
  );
};

export default SpinnerSvg;
