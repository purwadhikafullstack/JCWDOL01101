import { useProduct } from "@/hooks/useProduct";
import { useDashboardReviewProduct } from "@/hooks/useReview";
import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ReviewStar from "@/pages/homepage/components/product-detail/ReviewStar";
import { Badge } from "@/components/ui/badge";
import ReviewAction from "../components/ReviewAction";
import TablePagination from "../components/TablePagination";
import { Helmet } from "react-helmet";
import ReviewProduct from "../components/review/ReviewProduct";
import ReviewTableOptions from "../components/review/ReviewTableOptions";

const ProductReviews = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams({
    page: "1",
  });
  const currentPage = Number(searchParams.get("page"));
  const { data: pd } = useProduct(slug || "");
  const { data: rd } = useDashboardReviewProduct({
    page: currentPage,
    limit: 5,
    status: searchParams.get("status") || "",
    rating: searchParams.get("rating") || "",
    productId: pd?.product.id,
  });

  return (
    <>
      <Helmet>
        <title>Dashboard | Reviews</title>
      </Helmet>
      {pd && rd && (
        <div>
          <div className="text-sm mb-10">
            <Link to="/dashboard/product" className="text-muted-foreground">
              products /
            </Link>{" "}
            <Link
              to={`/dashboard/product/reviews/${slug}`}
              className=" text-primary"
            >
              reviews
            </Link>
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <ReviewTableOptions averageRating={rd.averageRating} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead className="text-start">Nickname</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="w-[400px]">Comment</TableHead>
                    <TableHead className="text-center w-[300px]">
                      Status
                    </TableHead>
                    <TableHead className="w-[100px] text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rd && rd.reviews && rd.reviews.length > 0 ? (
                    rd.reviews.map((review, index) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>{review.nickname}</TableCell>
                        <TableCell>
                          <ReviewStar rating={review.rating} />
                        </TableCell>
                        <TableCell>{review.comment}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4 justify-center">
                            <Badge
                              variant="outline"
                              className="border-primary text-primary"
                            >
                              {review.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <ReviewAction reviewId={review.id} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <p className="text-center text-muted-foreground">
                          No reviews for this product
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              {rd.reviews.length > 0 && (
                <div className="my-10 flex justify-end">
                  <TablePagination
                    currentPage={currentPage}
                    dataLength={rd.reviews.length}
                    totalPages={rd.totalPages}
                  />
                </div>
              )}
            </div>
            <ReviewProduct
              product={pd.product}
              totalStock={pd.totalStock}
              totalSold={pd.totalSold}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductReviews;
