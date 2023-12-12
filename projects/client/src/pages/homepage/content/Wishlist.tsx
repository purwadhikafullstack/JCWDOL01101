import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WishlistData, useWishlist } from "@/hooks/useWishlist";
import React from "react";
import WishlistItem from "../components/WishlistItem";
import { useTranslation } from "react-i18next";

const Wishlist = () => {
  const { t } = useTranslation();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useWishlist(5);
  const totalProduct = data ? data.pages[0].totalWishlist : 0;
  return (
    <div>
      <h1 className="uppercase font-bold text-3xl mb-10">Wishlist</h1>
      <div className="border p-4">
        <span>
          {totalProduct} {t("wishlistPage.product")}
        </span>
        <Separator className="my-4" />
        <div className="flex flex-col">
          {data &&
            data.pages.map((page, index) =>
              page.wishlist.length > 0 ? (
                page.wishlist.map(
                  ({ productWishlist: product, id }: WishlistData) => (
                    <WishlistItem key={id} product={product} />
                  )
                )
              ) : (
                <div key={index}>
                  <p className="font-bold">
                    {t("wishlistPage.noWishlist.title")}
                  </p>
                  <p>{t("wishlistPage.noWishlist.desc")}</p>
                </div>
              )
            )}
          {hasNextPage && (
            <Button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              variant="outline"
              className="border-black rounded-none w-max mx-auto md:px-20"
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load More"
                : "nothing more to load"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
