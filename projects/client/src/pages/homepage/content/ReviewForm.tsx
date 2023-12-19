import React, { useEffect, useState } from "react";
import { baseURL } from "@/service";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostReview } from "@/hooks/useReviewMutation";
import { useProduct } from "@/hooks/useProduct";
import { useNavigate, useParams } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Breadcrumbs from "../components/product-detail/Breadcrumbs";
import z from "zod";
import {
  NicknameFormField,
  CommentFormField,
  RatingFormField,
  TitleFormField,
  ReviewSuccessModal,
  TosFormField,
} from "../components/reviews";
import AllowReviewModal from "../components/reviews/AllowReviewModal";
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

const reviewSchema = z.object({
  rating: z.number().min(1, " "),
  name: z
    .string()
    .min(1, "please enter a nickname")
    .max(20, "max 20 character for nickname"),
  title: z.string().min(1, "summarize your review"),
  comment: z.string().min(50, "please write a comment."),
  tos: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "Please make sure to check below.",
      path: [],
    }),
});

const ReviewForm = () => {
  const { t } = useTranslation();
  const { isLoaded } = useUser();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: pd } = useProduct(slug || "");

  const [rating, setRating] = useState(0);
  const [modal, setModal] = useState(false);
  const reviewMutation = usePostReview();
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating,
      name: "",
      title: "",
      comment: "",
    },
  });

  useEffect(() => {
    if (reviewMutation.isSuccess) {
      form.reset({
        rating,
        name: "",
        title: "",
        comment: "",
        tos: false,
      });
      setRating(0);
      setModal(true);
    }
  }, [reviewMutation.isSuccess]);

  const onSubmit = (values: z.infer<typeof reviewSchema>) => {
    if (pd && pd.product) {
      reviewMutation.mutate({
        productId: pd.product.id,
        rating: values.rating,
        title: values.title,
        nickname: values.name,
        comment: values.comment,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Write Your Review | TOTEN</title>
      </Helmet>
      {isLoaded && pd && pd.product && (
        <div>
          <AllowReviewModal slug={pd.product.slug} productId={pd.product.id} />
          <Breadcrumbs />
          <div className="flex flex-col md:flex-row justify-between ">
            <div className="flex-1 order-2 lg:order-1 mt-4 lg:mt-0">
              <h3 className="text-2xl font-bold">{pd.product.name}</h3>
              <div className="border px-4 py-6 pb-10 flex-1 mt-6">
                <span className="flex items-center justify-between">
                  <p className="uppercase font-bold text-lg">
                    {t("reviewsPage.form.writeReview")}
                  </p>
                  <p className="text-primary text-sm">
                    {t("reviewsPage.form.required")}*
                  </p>
                </span>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 mt-10"
                  >
                    <RatingFormField rating={rating} setRating={setRating} />
                    <NicknameFormField />
                    <TitleFormField />
                    <CommentFormField />
                    <div>
                      <h3 className="font-bold">
                        {t("reviewsPage.form.note.title")}:
                      </h3>
                      <ul className="list-disc pl-10 text-sm">
                        <li>{t("reviewsPage.form.note.list1")}:</li>
                        <li>{t("reviewsPage.form.note.list2")}:</li>
                      </ul>
                    </div>
                    <TosFormField />
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-end">
                      <Button
                        onClick={() => navigate(`/product/${pd.product.slug}`)}
                        type="button"
                        variant="outline"
                        className="lg:px-20 w-full lg:w-max border-black uppercase rounded-none"
                      >
                        {t("reviewsPage.form.back")}
                      </Button>
                      <Button
                        disabled={reviewMutation.isPending}
                        type="submit"
                        className="lg:px-20 w-full lg:w-max bg-black hover:bg-black/80 uppercase rounded-none "
                      >
                        {t("reviewsPage.form.submit")}
                      </Button>
                    </div>
                  </form>
                </Form>
                <ReviewSuccessModal
                  slug={pd.product.slug}
                  modal={modal}
                  setModal={setModal}
                />
              </div>
            </div>
            <div className="lg:w-[450px] relative order-1 lg:order-2">
              <div className=" lg:w-[355px] lg:sticky lg:top-[140px] ml-auto">
                <LazyLoadImage
                  src={`${baseURL}/images/${pd.product.primaryImage}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewForm;
