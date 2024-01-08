import * as React from "react";
import { useTranslation } from "react-i18next";
import ResposiveDialog from "@/components/ResposiveDialog";

const PurchasedReviewModal = () => {
  const { t } = useTranslation();
  return (
    <div className="my-2">
      <ResposiveDialog
        title={t("reviewsPage.allowReview.title")}
        description={t("reviewsPage.allowReview.desc")}
        tiggerLabel={t("reviewsPage.allowReview.btn")}
      />
    </div>
  );
};

export default PurchasedReviewModal;
