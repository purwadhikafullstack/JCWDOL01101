import React from "react";

import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ReviewProgress = ({ value, count }: { value: number; count: number }) => {
  return (
    <div className="flex items-center gap-2 w-full">
      <Star className="w-4 h-4 text-transparent" fill="#e11d48" />
      <Progress className="h-2" value={value} />
      <p className="text-sm text-muted-foreground">{count}</p>
    </div>
  );
};

export default ReviewProgress;
