"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, value = "", onValueChange = () => {}, children, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        <div ref={ref} className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ className, value, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    if (!context) throw new Error("RadioGroupItem must be used within RadioGroup");

    const isChecked = context.value === value;

    return (
      <button
        type="button"
        role="radio"
        aria-checked={isChecked}
        onClick={() => context.onValueChange(value)}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isChecked && "bg-primary",
          className
        )}
        id={id}
      >
        {isChecked && (
          <span className="flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
        )}
        <input
          ref={ref}
          type="radio"
          value={value}
          checked={isChecked}
          onChange={() => context.onValueChange(value)}
          className="sr-only"
          {...props}
        />
      </button>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
