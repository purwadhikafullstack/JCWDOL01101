import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";

type Props = {
  isDisabled: boolean;
  mutationPending: boolean;
  mutationSuccess: boolean;
  handleDeleteImage: () => void;
};
const DeleteImageDialog = ({
  mutationPending,
  handleDeleteImage,
  isDisabled,
  mutationSuccess,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (mutationSuccess) setOpen(false);
  }, [mutationSuccess]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={isDisabled || mutationPending}
          type="button"
          variant="outline"
          className="w-full text-xs  mt-2 border rounded-md cursor-pointer border-primary text-primary hover:text-primary/80"
        >
          <Trash className="w-4 h-4 mr-2" />
          delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure delete this image?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            image and remove your image from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleDeleteImage}
            type="button"
            variant="outline"
            className="w-full text-xs  border rounded-md cursor-pointer border-primary text-primary hover:text-primary/80"
          >
            {mutationPending && (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            )}
            yes, delete
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="secondary"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteImageDialog;
