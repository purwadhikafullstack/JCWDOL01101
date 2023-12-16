import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type PriceFilterFormProps = {
  param: string;
  placeholder: string;
};

const PriceFilterForm = ({ param, placeholder }: PriceFilterFormProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [price, setPrice] = useState({
    value: "",
    formatted: "",
  });

  useEffect(() => {
    if (!searchParams.get(param)) {
      setPrice({ ...price, formatted: "" });
    }
  }, [searchParams.get(param)]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchParams((params) => {
      params.set(param, price.value);
      return params;
    });
  };

  const handlePriceOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim().replace(/\D/g, "");
    const formatted = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(Number(value))
      .replace(/Rp\s?/g, "");
    setPrice({ value, formatted });
  };
  return (
    <div className="border w-full focus-within:ring-2 focus-within:ring-primary rounded-lg flex items-center">
      <div className="w-max h-full bg-muted border-r py-2 px-4 rounded-l-lg font-bold text-muted-foreground text-sm">
        Rp
      </div>
      <form onSubmit={onSubmit}>
        <input
          value={price.formatted}
          onChange={handlePriceOnChange}
          placeholder={placeholder}
          className="w-full outline-none py-1 pl-2 rounded-r-lg bg-background"
        />
      </form>
    </div>
  );
};

export default PriceFilterForm;
