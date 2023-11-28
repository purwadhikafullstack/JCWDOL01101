import React from "react";
import { FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import EditProductImage from "./EditProductImage";

const EditImageForm = ({ error }: { error: string | null }) => {
  return (
    <div className="w-ful grid grid-cols-3">
      <div>
        <FormLabel id="image" className="font-bold">
          Product Foto
          <Badge
            variant="secondary"
            className="text-muted-foreground font-normal ml-2"
          >
            Required
          </Badge>
        </FormLabel>
        <p className="text-xs mt-2 text-muted-foreground max-w-[200px] ">
          Format gambar .jpg .jpeg .png dan dan maksimal file size 5MB.
        </p>
      </div>
      <div className="col-span-2">
        <div className="w-full gap-2 border rounded-lg p-4 grid grid-cols-5">
          <EditProductImage index={0} />
          <EditProductImage index={1} />
          <EditProductImage index={2} />
          <EditProductImage index={3} />
          <EditProductImage index={4} />
        </div>
        <p className="text-sm text-primary">{error}</p>
        <FormMessage />
      </div>
    </div>
  );
};

export default EditImageForm;
