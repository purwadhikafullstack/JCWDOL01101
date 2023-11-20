import React from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { prouctId } = useParams();

  return <div>ProductDetail</div>;
};

export default ProductDetail;
