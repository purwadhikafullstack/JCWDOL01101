import { Button } from "@/components/ui/button";
import { useBoundStore } from "@/store/client/useStore";
import { Image, X } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import z, { ZodError } from "zod";
export type Image = {
  url: string;
  file: File | undefined | null;
};

const ProductImage = ({ index }: { index: number }) => {
  const [error, setError] = useState("");
  const [imageKey, setImageKey] = useState(0);
  const images = useBoundStore((state) => state.images);
  const setImageForm = useBoundStore((state) => state.setImageForm);
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

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
          setImageForm({ file, url: result as string }, index);
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
  return (
    <div>
      <div
        {...getRootProps()}
        className="w-full text-muted-foreground hover:text-primary group  cursor-pointer hover:border-dashed hover:border-primary border-2 border-dashed rounded-lg h-[150px] flex flex-col justify-center items-center"
      >
        {images[index] ? (
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
      {images[index] && (
        <Button
          onClick={() => {
            setImageForm(null, index);
            setImageKey(imageKey + 1);
          }}
          type="button"
          variant="outline"
          className="w-full text-xs  mt-2 border rounded-md cursor-pointer"
        >
          <X className="w-4 h-4 mr-2" />
          remove
        </Button>
      )}
    </div>
  );
};

export default ProductImage;
