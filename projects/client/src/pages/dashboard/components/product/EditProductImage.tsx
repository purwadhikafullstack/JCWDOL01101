import React from "react";
import { useDeleteProductImage } from "@/hooks/useProductMutation";
import { useBoundStore } from "@/store/client/useStore";
import { Image } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import z, { ZodError } from "zod";
import DeleteImageDialog from "./DeleteImageDialog";
export type Image = {
  url: string;
  file: File | undefined;
};

const EditProductImage = ({ index }: { index: number }) => {
  const { slug } = useParams();
  if (!slug) {
    return;
  }
  const deleteProductImage = useDeleteProductImage();
  const [error, setError] = React.useState("");
  const [imageKey, setImageKey] = React.useState(0);
  const images = useBoundStore((state) => state.editImages);
  const payloadLength = useBoundStore((state) => state.payloadLength);
  const setEditImageForm = useBoundStore((state) => state.setEditImageForm);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const onDrop = React.useCallback(
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
            size: z.number().max(1 * 1024 * 1024, "File too big"),
          });

          const fileData = { name, type, size };
          await fileSchema.parseAsync(fileData);

          const reader = new FileReader();

          reader.onabort = () => setError("file reading was aborted");
          reader.onerror = () => setError("file reading has failed");

          const fileRead = new Promise((resolve, reject) => {
            reader.onload = () => {
              resolve(reader.result);
            };
          });

          reader.readAsDataURL(file);
          const result = await fileRead;
          if (result) {
            forceUpdate();
          }
          setEditImageForm({ file, url: result as string }, index);
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDeleteImage = () => {
    if (images[index]?.imageId && slug) {
      deleteProductImage.mutate({
        imageId: images[index]?.imageId!,
      });
    }
    setEditImageForm(null, index);
    setImageKey(imageKey + 1);
  };
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
        <>
          <DeleteImageDialog
            isDisabled={payloadLength <= 1}
            handleDeleteImage={handleDeleteImage}
            mutationPending={deleteProductImage.isPending}
            mutationSuccess={deleteProductImage.isSuccess}
          />
          {payloadLength <= 1 && (
            <p className="text-sm text-primary">
              Product must have at least 1 image
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default EditProductImage;
