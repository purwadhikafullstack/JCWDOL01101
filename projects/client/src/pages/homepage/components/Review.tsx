import React from "react";
import { Dot, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  Select,
  SelectItem,
} from "@/components/ui/select";
import ReviewProgress from "./ReviewProgress";

const Review = () => {
  return (
    <div className="w-full review">
      <p className="font-bold text-lgs">REVIEW</p>
      <div className="flex gap-8 items-start">
        <div className="flex flex-col items-center w-[250px]">
          <span className="flex gap-2 items-center">
            <Star className="text-transparent w-8 h-8" fill="#e11d48" />
            <span className="flex items-end">
              <p className="text-5xl">5.0</p>
              <p className="text-muted-foreground">/5.0</p>
            </span>
          </span>
          <p className="text-xs">100% buyers are satisfied</p>
          <span className="flex text-muted-foreground text-xs">
            <p>2 rating</p>
            <Dot className="w-4 h-4" />
            <p>0 review</p>
          </span>
          <ReviewProgress value={100} count={2} />
          <ReviewProgress value={0} count={0} />
          <ReviewProgress value={0} count={0} />
          <ReviewProgress value={0} count={0} />
          <ReviewProgress value={0} count={0} />
        </div>
        <div className="flex-1 rounded-md">
          <div className="flex justify-between items-center">
            <span>
              <p className="font-bold uppercase">Picked Review</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Showing 10 of 70 reviews
              </p>
            </span>
            <div className="flex items-center gap-2">
              <p className="text-sm">Sort</p>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue defaultValue="new" placeholder="Newest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Newest</SelectItem>
                  <SelectItem value="high">Highest Ratings</SelectItem>
                  <SelectItem value="low">Lowest Ratings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <ReviewMessage />
            <ReviewMessage />
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewMessage = () => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Star className="w-5 h-5 text-transparent" fill="#e11d48" />
          <Star className="w-5 h-5 text-transparent" fill="#d6dfeb" />
          <Star className="w-5 h-5 text-transparent" fill="#d6dfeb" />
          <Star className="w-5 h-5 text-transparent" fill="#d6dfeb" />
          <Star className="w-5 h-5 text-transparent" fill="#d6dfeb" />
        </div>
        <p className="text-xs text-muted-foreground">1 month ago</p>
      </div>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage className="object-cover" src="/clothing.jpg" />
          <AvatarFallback>PM</AvatarFallback>
        </Avatar>
        <p className="text-sm font-bold ">Budi</p>
      </div>
      <p className="text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, illo!
      </p>
    </div>
  );
};

export default Review;
