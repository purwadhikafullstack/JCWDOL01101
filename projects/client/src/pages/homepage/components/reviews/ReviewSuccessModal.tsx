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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Dialog open={modal}>
      <DialogContent className="lg:rounded-none">
        <DialogHeader>
          <DialogTitle>{t("reviewsPage.successModal.title")}</DialogTitle>
          <DialogDescription>
            {t("reviewsPage.successModal.desc")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => navigate(`/product/${slug}`)}
            type="button"
            variant="outline"
            className="w-full border-black uppercase rounded-none"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> {t("reviewsPage.form.back")}
          </Button>
          <Button
            onClick={() => setModal(false)}
            type="button"
            className="bg-black hover:bg-black/80 w-full border-black uppercase rounded-none  mb-2 lg:mb-0"
          >
            {t("reviewsPage.successModal.post")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewSuccessModal;
