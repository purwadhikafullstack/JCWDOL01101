import React, { useEffect, FormEvent, useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAdminMutation } from "@/hooks/useUserMutation";
import { Loader2, Plus } from "lucide-react";

const NewAdminFrom = () => {
  const { adminMutation, error: resError } = useAdminMutation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onCreateAdmin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    adminMutation.mutate();
  };

  useEffect(() => {
    if (resError?.state) {
      toast({
        title: `Error: ${resError.status}`,
        description: resError.message,
        variant: "destructive",
        duration: 2000,
      });
    }
  }, [resError, toast]);

  useEffect(() => {
    if (!resError?.state && adminMutation.status === "success") {
      toast({
        title: "Admin Warehouse Created",
        description: "Successfully create a new product",
        duration: 2000,
      });
      setOpen(false);
    }
  }, [adminMutation.status, toast, resError]);
  return (
    <Dialog open={adminMutation.isPending || open} onOpenChange={setOpen}>
      <DialogTrigger
        className={buttonVariants({
          variant: "default",
          className: "self-end",
        })}
      >
        <Plus className="w-4 h-4 mr-2" /> New Admin
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Admin Warehouse</DialogTitle>
          <DialogDescription>
            You're about to create a new admin warehouse
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onCreateAdmin}>
          <span className="flex justify-center gap-4 w-full">
            <Button
              type="submit"
              variant="destructive"
              className="cursor-pointer "
            >
              <Loader2
                className={
                  adminMutation.isPending
                    ? "animate-spin w-4 h-4 mr-2"
                    : "hidden"
                }
              />
              Yes, create admin
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </span>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAdminFrom;
