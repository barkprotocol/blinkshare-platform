import * as React from "react";
import { cn } from "@/lib/utils";

// Type definition for InputProps
type InputProps = React.ComponentProps<"input"> & {
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// InputNumber component for numeric inputs
const InputNumber = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        type="number"
        className={cn("appearance-none", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
InputNumber.displayName = "InputNumber";

export { Input, InputNumber };
