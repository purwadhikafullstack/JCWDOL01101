import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const ratingText = ["Poor", "Fair", "Fair", "Good", "Very Good"];
type RatingFormFieldProps = {
  rating: number;
  setRating: (rating: number) => void;
};
const RatingFormField = ({ rating, setRating }: RatingFormFieldProps) => {
  const form = useFormContext();
  const fillColor = "#ebbe00";
  const emptyColor = "#dadada";
  return (
    <FormField
      control={form.control}
      name="rating"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-4 gap-2">
            <FormLabel className="font-semibold">
              RATING<b className="text-primary">*</b>
            </FormLabel>
            <div className="col-span-3">
              <div className="flex gap-1 items-center">
                {Array.from({ length: 5 }, (_, index) => {
                  const fill = index < rating ? fillColor : emptyColor;
                  return (
                    <Button
                      type="button"
                      key={index}
                      variant="outline"
                      className="p-1 h-max border-none"
                      onClick={() => {
                        field.onChange(index + 1);
                        setRating(index + 1);
                      }}
                    >
                      <motion.div
                        transition={{
                          type: "spring",
                          ease: "anticipate",
                          duration: 0.2,
                        }}
                        whileTap={{ scale: 1.3 }}
                        whileHover={{
                          rotate: [-10, 10],
                          scale: 0.9,
                        }}
                      >
                        <Star
                          fill={fill}
                          className="text-transparent w-6 h-6 transition-colors duration-100"
                        />
                      </motion.div>
                    </Button>
                  );
                })}
                <span className="text-sm text-muted-foreground">
                  {rating > 0 && ratingText[rating - 1]}
                </span>
              </div>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default RatingFormField;
