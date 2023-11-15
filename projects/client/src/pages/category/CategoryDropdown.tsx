import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

const CategoryDropdown = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <span
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen && "font-semibold"
        } flex gap-2 justify-between items-center cursor-pointer py-2 uppercase select-none`}
      >
        {title}
        <ChevronDown
          className={`w-5 h-5 transform ${
            isOpen && "-rotate-180"
          } transition-all duration-300`}
        />
      </span>
      <div className={`${isOpen ? "flex" : "hidden"} flex-col pl-4`}>
        {children}
      </div>
    </div>
  );
};

export default CategoryDropdown;
