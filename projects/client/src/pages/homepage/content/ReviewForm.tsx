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
import { useUser } from "@clerk/clerk-react";
import AllowReviewModal from "../components/reviews/AllowReviewModal";

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
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: product } = useProduct(slug || "");

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
    if (product) {
      reviewMutation.mutate({
        productId: product.id,
        rating: values.rating,
        title: values.title,
        nickname: values.name,
        comment: values.comment,
      });
    }
  };

  return (
    <div>
      {product && <AllowReviewModal slug={product?.slug} />}
      {product && (
        <Breadcrumbs
          slug={product.slug}
          categoryId={product.categoryId}
          categoryName={product.productCategory.name}
          productName={product.name}
        />
      )}
      <div className="flex justify-between ">
        <div className="flex-1">
          <h3 className="text-2xl font-bold">{product?.name}</h3>
          <div className="border px-4 py-6 pb-10 flex-1 mt-6">
            <span className="flex items-center justify-between">
              <p className="uppercase font-bold text-lg">Write review</p>
              <p className="text-primary text-sm">required*</p>
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
                  <h3 className="font-bold">GIVING A REVIEW:</h3>
                  <ul className="list-disc pl-10 text-sm">
                    <li>
                      The comments you provide may be used for advertising
                      purposes.
                    </li>
                    <li>
                      We do not accept requests to place advertisements
                      including for other brands, individuals or organizations.
                      We also cannot store stock or sizes.
                    </li>
                  </ul>
                </div>
                <TosFormField />
                <div className="flex gap-4 items-center justify-end">
                  <Button
                    onClick={() => navigate(`/product/${product?.slug}`)}
                    type="button"
                    variant="outline"
                    className="px-20 border-black uppercase rounded-none"
                  >
                    Back to product detail
                  </Button>
                  <Button
                    disabled={reviewMutation.isPending}
                    type="submit"
                    className="px-20 bg-black hover:bg-black/80 uppercase rounded-none "
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
            {product && (
              <ReviewSuccessModal
                slug={product?.slug}
                modal={modal}
                setModal={setModal}
              />
            )}
          </div>
        </div>
        <div className="w-[450px] relative">
          <div className="w-[355px] sticky top-[100px] ml-auto">
            {product && (
              <LazyLoadImage
                src={`${baseURL}/images/${product.primaryImage}`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
