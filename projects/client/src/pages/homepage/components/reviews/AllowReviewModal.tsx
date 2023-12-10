import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

type ReviewSuccessModalProps = {
  slug: string;
};

const AllowReviewModal = ({ slug }: ReviewSuccessModalProps) => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  return (
    <Dialog open={!isSignedIn}>
      <DialogContent className="lg:rounded-none">
        <DialogHeader>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-black rounded-none h-6 px-0 self-end"
          >
            <X />
          </Button>
          <DialogTitle>LOG IN MUST</DialogTitle>
          <DialogDescription>Please go to the Login page.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => navigate(`/product/${slug}`)}
            type="button"
            variant="outline"
            className="w-full border-black uppercase rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to product detail
          </Button>
          <Button
            onClick={() => navigate("/login")}
            type="button"
            className="bg-black hover:bg-black/80 w-full border-black uppercase rounded-none"
          >
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllowReviewModal;
