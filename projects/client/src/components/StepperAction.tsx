import { Check } from "lucide-react";
import React from "react";

const StepperAction = ({
  step,
  title,
  detail,
  isActive = false,
  isDone,
}: {
  step: number;
  title?: string;
  detail?: string;
  isActive?: boolean;
  isDone?: boolean;
}) => {
  return (
    <li
      className={`${
        isActive ? "text-primary" : "text-muted-foreground"
      } flex items-center   space-x-2.5 rtl:space-x-reverse`}
    >
      <span
        className={`${
          isActive ? "border-primary" : "border-muted-foreground"
        } flex items-center justify-center w-8 h-8 border rounded-full shrink-0`}
      >
        {isDone ? <Check className="w-4 h-4" /> : step}
      </span>
      <span className="text-start">
        <h3 className="font-medium leading-tight">{title}</h3>
        <p className="text-sm hidden lg:block">{detail}</p>
      </span>
    </li>
  );
};

export default StepperAction;
