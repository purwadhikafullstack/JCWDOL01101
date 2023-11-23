import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import React from "react";

const ChekoutAddress = ({ pick = false }: { pick?: boolean }) => {
  return (
    <div
      className={`flex gap-2 ${
        pick && "bg-primary/5 border border-primary"
      }   rounded-md shadow-md`}
    >
      <div className="flex-1 p-4 flex flex-col">
        <span className="font-semibold text-muted-foreground flex items-center gap-2">
          Home
          <Badge
            className="rounded-sm font-normal border border-primary text-primary"
            variant="outline"
          >
            Primary
          </Badge>
        </span>
        <span className="font-bold text-lg">Tetsu Tetsu Hero</span>
        <p>081222333444</p>
        <p className="text-ellipsis overflow-hidden whitespace-nowrap max-w-[80%]">
          BTN Shibuya Blok E. 23 Jl. Perempatan Sibuya
        </p>
        <div className="flex items-center gap-2 h-max">
          <Button
            variant="ghost"
            className="font-semibold text-primary/95 hover:bg-transparent hover:text-primary"
          >
            Change Address
          </Button>
          <Separator orientation="vertical" />
          <Button
            variant="ghost"
            className="font-semibold text-primary/95 hover:bg-transparent hover:text-primary"
          >
            Make Main Address
          </Button>
        </div>
      </div>
      {pick ? (
        <span className="p-2 px-4 self-center">
          <Check className="text-primary" />
        </span>
      ) : (
        <div className="p-2 px-4 self-center">
          <Button>Pick Address</Button>
        </div>
      )}
    </div>
  );
};

export default ChekoutAddress;
