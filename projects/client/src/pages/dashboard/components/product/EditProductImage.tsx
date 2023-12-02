import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteProductImage } from "@/hooks/useProductMutation";
import { useBoundStore } from "@/store/client/useStore";
import { Image, Loader2, Trash } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import z, { ZodError } from "zod";
export type Image = {
  url: string;
  file: File | undefined;
};

const EditProductImage = ({ index }: { index: number }) => {
  const { slug } = useParams();
  const [imageId, setImageId] = useState<number | null>(null);
  if (!slug) {
    return;
  }
  const deleteProductImage = useDeleteProductImage(imageId!, slug);
  useEffect(() => {
    if (imageId && slug) {
      deleteProductImage.mutate();
    }
  }, [imageId, slug]);

  const [error, setError] = useState("");
  const [imageKey, setImageKey] = useState(0);
  const images = useBoundStore((state) => state.editImages);
  const setEditImageForm = useBoundStore((state) => state.setEditImageForm);
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: File) => {
        try {
          setError("");
          const { name, type, size } = file;

          const fileSchema = z.object({
            name: z.string(),
            type: z
              .string()
              .regex(
                /^image\/(jpeg|png)$/,
                "Only accepting .jpg, .jpeg, and png"
              ),
            size: z.number().max(5 * 1024 * 1024, "File too big"),
          });

          const fileData = { name, type, size };
          await fileSchema.parseAsync(fileData);

          const reader = new FileReader();

          reader.onabort = () => setError("file reading was aborted");
          reader.onerror = () => setError("file reading has failed");

          reader.onload = () => {
            setEditImageForm(
              {
                imageId: images[index]?.imageId || null,
                file,
                url: reader.result as string,
              },
              index
            );
          };
          reader.readAsDataURL(file);
        } catch (err) {
          if (err instanceof ZodError) {
            setError(err.errors[0].message);
          } else {
            setError("An error occured during file processing");
          }
        }
      });
    },
    [images]
  );

  useEffect(() => {
    if (deleteProductImage.isSuccess) {
      setEditImageForm(
        {
          imageId: null,
          file: null,
          url: "",
        },
        index
      );
    }
  }, [deleteProductImage.isSuccess]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div>
      <div
        {...getRootProps()}
        className="w-full text-muted-foreground hover:text-primary group  cursor-pointer hover:border-dashed hover:border-primary border-2 border-dashed rounded-lg h-[150px] flex flex-col justify-center items-center"
      >
        {images[index] && images[index]?.url ? (
          <div className="w-full h-full overflow-hidden">
            <img
              src={images[index]?.url}
              className="object-contain w-full h-full"
            />
          </div>
        ) : (
          <>
            <Image className="w-10 h-10" strokeWidth={1} />
            <span>Foto {index + 1}</span>
          </>
        )}
      </div>
      <p className="text-xs text-primary">{error}</p>
      <input {...getInputProps()} />
      {images[index] && images[index]?.url && images[index]?.imageId && (
        <Button
          onClick={() => {
            if (images[index]?.imageId) {
              setImageId(images[index]?.imageId!);
            }
            setEditImageForm(null, index);
            setImageKey(imageKey + 1);
          }}
          type="button"
          variant="outline"
          className="w-full text-xs  mt-2 border rounded-md cursor-pointer border-primary text-primary hover:text-primary/80"
        >
          {deleteProductImage.isPending ? (
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          ) : (
            <Trash className="w-4 h-4 mr-2" />
          )}
          delete
        </Button>
      )}
    </div>
  );
};

export default EditProductImage;
