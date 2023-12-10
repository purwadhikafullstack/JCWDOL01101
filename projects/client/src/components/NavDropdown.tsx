import React from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

type NavDropdownProps = {
  path: string;
  icon: React.ReactElement;
  title?: string;
  profile?: boolean;
  counter?: number;
  setIsDim: (isDim: boolean) => void;
  className?: string;
  children?: React.ReactNode;
};

const NavDropdown = ({
  path,
  icon,
  title,
  profile,
  counter,
  setIsDim,
  className,
  children,
}: NavDropdownProps) => {
  return (
    <div
      onMouseEnter={() => setIsDim(true)}
      onMouseLeave={() => setIsDim(false)}
      className="relative group cursor-pointer"
    >
      <motion.div whileHover="hover" whileTap="tap">
        <Link to={path}>
          {counter
            ? counter >= 1 && (
                <span
                  className={`${
                    counter < 10 ? "px-[6px]" : null
                  } absolute top-1 z-50 left-2  text-[0.6rem] p-[4px] leading-3 grid  place-content-center h-[18px] w-[18px] bg-primary rounded-full text-primary-foreground font-semibold  border-2 border-background`}
                >
                  {counter}
                </span>
              )
            : null}
          <div
            className={buttonVariants({
              variant: "ghost",
              className: "z-40",
            })}
          >
            {profile ? (
              <div>{icon}</div>
            ) : (
              <motion.div
                transition={{
                  type: "tween",
                  ease: "linear",
                  duration: 0.3,
                }}
                variants={{
                  hover: {
                    rotate: [10, -10, 10, -10, 0],
                  },
                  tap: {
                    scale: 1.5,
                  },
                }}
                initial={{ scale: 1, rotate: 0 }}
              >
                <span>{icon}</span>
              </motion.div>
            )}
          </div>
        </Link>
      </motion.div>
      {children && (
        <div
          className={cn(
            `absolute z-50 scale-y-0 group-hover:scale-y-100 origin-top left-1/2 -translate-x-[86%] ${
              profile
                ? "-translate-x-[86%]"
                : "-translate-x-[86%] lg:-translate-x-1/2"
            } translate-y-0 w-max transition-all duration-200 bg-white shadow-md p-2`,
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
