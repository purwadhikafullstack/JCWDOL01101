import React from "react";
import ReviewStatusCombobox from "../ReviewStatusCombobox";
import { Button } from "@/components/ui/button";
import ReviewStar from "@/pages/homepage/components/product-detail/ReviewStar";
import { X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const status = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "deactivated",
    label: "Deactivated",
  },
  {
    value: "deleted",
    label: "Deleted",
  },
];

const ratings = [
  {
    value: "1",
    label: "1 Star",
  },
  {
    value: "2",
    label: "2 Star",
  },
  {
    value: "3",
    label: "3 Star",
  },
  {
    value: "4",
    label: "4 Star",
  },
  {
    value: "5",
    label: "5 Star",
  },
];

type Props = {
  averageRating: number;
};

const ReviewTableOptions = ({ averageRating }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParams = searchParams.get("status")?.split(",");
  const ratingParams = searchParams.get("rating")?.split(",");
  return (
    <div>
      <div className="flex justify-between items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <ReviewStatusCombobox
            options={status}
            param="status"
            title="Status"
          />
          <ReviewStatusCombobox
            options={ratings}
            param="rating"
            title="Rating"
          />
          {(statusParams || ratingParams) && (
            <Button
              onClick={() => {
                setSearchParams((params) => {
                  params.delete("status");
                  params.delete("rating");
                  return params;
                });
              }}
              size="sm"
              className="h-8"
              variant="outline"
            >
              Reset <X className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm">
          Overall Rating:
          <ReviewStar rating={averageRating} />
        </div>
      </div>
    </div>
  );
};

export default ReviewTableOptions;
