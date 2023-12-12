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
import { useProductIsOrder } from "@/hooks/useOrder";

type ReviewSuccessModalProps = {
  slug: string;
  productId: number;
};

const AllowReviewModal = ({ slug, productId }: ReviewSuccessModalProps) => {
  const { isSignedIn, user } = useUser();
  const { data: userIsOrderProduct } = useProductIsOrder(user?.id, productId);
  const navigate = useNavigate();
  return (
    <Dialog open={!isSignedIn || !Boolean(userIsOrderProduct)}>
      <DialogContent className="lg:rounded-none">
        <DialogHeader>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="border-black rounded-none h-6 px-0 self-end"
          >
            <X />
          </Button>
          <DialogTitle>
            {!isSignedIn
              ? "LOG IN MUST"
              : !Boolean(userIsOrderProduct)
              ? "Review Unavailable"
              : "LOG IN MUST"}
          </DialogTitle>
          <DialogDescription>
            {!isSignedIn
              ? "Please go to the Login page."
              : !Boolean(userIsOrderProduct)
              ? "Only customers who have purchased this product can submit a review. Thank you for understanding."
              : "Please go to the Login page."}
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
          {!isSignedIn && !Boolean(userIsOrderProduct) && (
            <Button
              onClick={() => navigate("/login")}
              type="button"
              className="bg-black hover:bg-black/80 w-full border-black uppercase rounded-none"
            >
              Login
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AllowReviewModal;
