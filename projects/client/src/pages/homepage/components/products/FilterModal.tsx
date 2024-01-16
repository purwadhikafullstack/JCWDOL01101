import * as React from "react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Filter from "./Filter";
import { FilterIcon } from "lucide-react";

const FilterModal = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-max">
          <FilterIcon className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80%]">
        <div className="px-4">
          <Filter />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterModal;
