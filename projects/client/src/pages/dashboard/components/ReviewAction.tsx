import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DotsHorizontalIcon,
  EyeClosedIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { STATUS, useChangeReviewStatus } from "@/hooks/useReviewMutation";
import { Delete } from "lucide-react";

type ReviewActionProps = {
  reviewId: number;
};
const ReviewAction = ({ reviewId }: ReviewActionProps) => {
  const reviewMutation = useChangeReviewStatus(reviewId);
  const handleReviewStatusChange = (status: STATUS) => {
    reviewMutation.mutate({ status });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-sm"
          onClick={() => handleReviewStatusChange("ACTIVE")}
        >
          <EyeOpenIcon className="mr-2 text-muted-foreground" />
          ACTIVE
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm"
          onClick={() => handleReviewStatusChange("DEACTIVATED")}
        >
          <EyeClosedIcon className="mr-2 text-muted-foreground" />
          DEACTIVATED
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-sm"
          onClick={() => handleReviewStatusChange("DELETED")}
        >
          <Delete className="mr-2 w-4 h-4 text-muted-foreground" />
          DELETED
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReviewAction;
