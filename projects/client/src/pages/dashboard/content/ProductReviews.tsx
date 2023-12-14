import { Button, buttonVariants } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProduct";
import { useDashboardReviewProduct } from "@/hooks/useReview";
import { formatToIDR } from "@/lib/utils";
import { baseURL } from "@/service";
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
import ReviewStatusCombobox from "../components/ReviewStatusCombobox";
import { X } from "lucide-react";

const status = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "deactivated",
    label: "Deactivated",
  },
  {
    value: "deleted",
    label: "Deleted",
  },
];

const ratings = [
  {
    value: "1",
    label: "1 Star",
  },
  {
    value: "2",
    label: "2 Star",
  },
  {
    value: "3",
    label: "3 Star",
  },
  {
    value: "4",
    label: "4 Star",
  },
  {
    value: "5",
    label: "5 Star",
  },
];

const ProductReviews = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({
    page: "1",
  });
  const currentPage = Number(searchParams.get("page"));
  const { data: pd } = useProduct(slug || "");
  const statusParams = searchParams.get("status")?.split(",");
  const ratingParams = searchParams.get("rating")?.split(",");
  const { data: rd } = useDashboardReviewProduct({
    page: currentPage,
    limit: 5,
    status: searchParams.get("status") || "",
    rating: searchParams.get("rating") || "",
    productId: pd?.product.id,
  });

  return (
    pd &&
    rd && (
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
            <div>
              <div className="flex justify-between items-center gap-2 mb-6">
                <div className="flex items-center gap-2">
                  <ReviewStatusCombobox
                    options={status}
                    param="status"
                    title="Status"
                  />
                  <ReviewStatusCombobox
                    options={ratings}
                    param="rating"
                    title="Rating"
                  />
                  {(statusParams || ratingParams) && (
                    <Button
                      onClick={() => {
                        setSearchParams((params) => {
                          params.delete("status");
                          params.delete("rating");
                          return params;
                        });
                      }}
                      size="sm"
                      className="h-8"
                      variant="outline"
                    >
                      Reset <X className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  Overall Rating:
                  <ReviewStar rating={rd.averageRating} />
                </div>
              </div>
            </div>
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
                      <TableCell className="font-medium">{index + 1}</TableCell>
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
          <div className="w-[450px]">
            <div className="sticky top-[180px]">
              <div className="px-2 space-y-4">
                <img
                  alt={pd.product.name}
                  src={`${baseURL}/images/${pd.product.primaryImage}`}
                />
                <div className="space-y-2">
                  <p className="font-bold text-lg">{pd.product.name}</p>
                  <p className="text-sm">{pd.product.description}</p>
                  <span className="text-lg font-bold">
                    {formatToIDR(pd.product.price)}
                  </span>
                  <p className="">STOCK: {pd.totalStock}</p>
                  <p className="">SOLD: {pd.totalSold}</p>
                  <Link
                    to={`/dashboard/product/edit/${slug}`}
                    className={buttonVariants({
                      variant: "outline",
                      className:
                        "w-ful md:border-black dark:border-border w-full",
                    })}
                  >
                    Edit This Product
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductReviews;
