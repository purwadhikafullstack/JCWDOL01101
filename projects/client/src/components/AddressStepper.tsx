import { Check } from "lucide-react";
import React from "react";

const AddressStepper = ({
  step,
  detail,
  isDone = false,
}: {
  step: number;
  detail: string;
  isDone?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center text-primary relative space-x-2.5 rtl:space-x-reverse">
      <div className="relative flex justify-center text-xs">
        <span
          className={`${
            isDone
              ? "bg-primary text-primary-foreground"
              : "bg-background text-primary"
          } flex items-center  justify-center font-bold w-8 h-8 border border-primary rounded-full shrink-0`}
        >
          {step}
        </span>
      </div>
      <p className="text-sm text-foreground hidden lg:block">{detail}</p>
    </div>
  );
};

export default AddressStepper;
