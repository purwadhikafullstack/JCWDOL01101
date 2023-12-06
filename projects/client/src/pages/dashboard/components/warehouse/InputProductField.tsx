import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useOutsideClick from "@/hooks/useClickOutside"
import { getProduct } from "@/hooks/useProduct"
import { Loader2 } from "lucide-react"
import React, { useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { useDebounce } from "use-debounce"
export type Coordinates = {
  latitude: number
  langitude: number
}

const InputProductField = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [show, setShow] = useState(false)
  const form = useFormContext()
  const [search, setSearch] = useState("")
  const [debounceSearch] = useDebounce(search, 500)
  const { data: products, isLoading: productsLoading } =
    getProduct(debounceSearch)

  useOutsideClick(ref, () => {
    setShow(false)
  })
  return (
    <FormField
      control={form.control}
      name="productName"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="product" className="font-bold">
            Product
          </FormLabel>
          <FormControl>
            <div ref={ref}>
              <Input
                id="product"
                {...field}
                value={search}
                onChange={(e) => {
                  setShow(true)
                  setSearch(e.target.value)
                }}
              />
              {show && products && (
                <div className="mt-2">
                  <div className="cursor-pointer w-full border overflow-auto transition-all duration-200 max-h-[200px] flex flex-col  items-start rounded-md text-sm">
                    {productsLoading ? (
                      <div className="text-center">
                        <Loader2 className="animate-spin " />
                      </div>
                    ) : (
                      <>
                        {products.length > 0 ? (
                          <>
                            {products.map((product) => (
                              <div
                                onClick={() => {
                                  setSearch(product.name)
                                  setShow(false)
                                  form.setValue("productId", product.id)
                                  form.setValue("productName", product.name)
                                }}
                                key={product.id}
                                className="w-full p-2 rounded-md hover:bg-muted flex gap-2"
                              >
                                {/* {product.productImage[1]} */}
                                <p>{product.name}</p>
                              </div>
                            ))}
                          </>
                        ) : (
                          <p className="text-center p-2 mx-auto">
                            no product found
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default InputProductField
