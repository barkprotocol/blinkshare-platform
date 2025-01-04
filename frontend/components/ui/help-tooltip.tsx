import React from "react";

export const HelpTooltip: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="tooltip">
      <span className="tooltip-text">{text}</span>
    </div>
  );
};
