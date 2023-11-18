import React, { useCallback, useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { useDropzone } from "react-dropzone";
import z, { ZodError } from "zod";
import { Upload } from "lucide-react";
import { baseURL } from "@/service";
import { Image } from "../NewProductForm";

const ImageUpload = ({
  image,
  setImage,
  isEdit = false,
  mutationSuccess,
}: {
  isEdit?: boolean;
  image: Image;
  mutationSuccess?: boolean;
  setImage: (val: Image) => void;
}) => {
  const [edit, setEdit] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onabort = () => setError("file reading was aborted");
        reader.onerror = () => setError("file reading has failed");
        reader.onload = () => {
          setEdit(false);
          setImage({ new: edit, url: reader.result as string, file });
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

          try {
            const fileData = {
              name: file.name,
              type: file.type,
              size: file.size,
            };
            fileSchema.parse(fileData);

            setError(null);
          } catch (err) {
            if (err instanceof ZodError) {
              setError(err.errors[0].message);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    },
    [edit, setImage]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <section className="w-full h-full">
      <FormLabel>Image</FormLabel>
      <div
        {...getRootProps()}
        className={`${
          error && "border-primary"
        } w-full h-[200px] rounded-md mt-2 group border overflow-hidden`}
      >
        {!error && image ? (
          <img
            src={
              (edit && image.url) || mutationSuccess
                ? `${baseURL}/${image.url}`
                : (image.url as string)
            }
            alt="pick"
            className="w-full h-full object-contain group-hover:scale-105 transition-all duration-200"
          />
        ) : (
          <div
            className={`${
              error ? "text-primary" : "text-muted-foreground"
            } w-full  h-full flex cursor-pointer justify-center items-center flex-col`}
          >
            <Upload
              className="transform transition-all duration-200 group-hover:-translate-y-1"
              strokeWidth={1}
            />
            <p className="text-xs max-w-[150px] text-center">
              Drag & Drop or Click to upload image
            </p>
          </div>
        )}
        <input {...getInputProps()} />
      </div>
      {error ? (
        <p className="text-xs text-primary">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Max File Size: 5MB, only JPG, JPEG, PNG are supported.
        </p>
      )}
    </section>
  );
};

export default ImageUpload;
