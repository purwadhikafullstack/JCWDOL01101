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
import { ArrowLeft } from "lucide-react";

type ReviewSuccessModalProps = {
  slug: string;
  modal: boolean;
  setModal: (modal: boolean) => void;
};

const ReviewSuccessModal = ({
  slug,
  modal,
  setModal,
}: ReviewSuccessModalProps) => {
  const navigate = useNavigate();
  return (
    <Dialog open={modal}>
      <DialogContent className="lg:rounded-none">
        <DialogHeader>
          <DialogTitle>Review Submitted Successfully!</DialogTitle>
          <DialogDescription>
            Your review has been successfully posted and saved. We value your
            feedback and appreciate the time you took to share your experience.
            You can view your review in the reviews section. Thank you for
            helping us improve our services.
          </DialogDescription>
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
            onClick={() => setModal(false)}
            type="button"
            className="bg-black hover:bg-black/80 w-full border-black uppercase rounded-none"
          >
            Post Another Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewSuccessModal;
