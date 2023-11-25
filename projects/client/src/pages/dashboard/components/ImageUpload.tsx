import React, { useCallback, useState } from "react";
import { FormLabel } from "@/components/ui/form";
import { useDropzone } from "react-dropzone";
import z, { ZodError } from "zod";
import { Upload } from "lucide-react";
import { baseURL } from "@/service";
import { Image } from "./NewProductForm";
import { useParams } from "react-router-dom";

type ImageState = {
  edit: boolean;
  file: File;
  url: string;
};

const ImageUpload = ({
  image,
  setImageState,
}: {
  image: Image;
  setImageState: (state: ImageState) => void;
}) => {
  const { slug } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [selectImage, setSelectImage] = useState(false);
  const isEditing = !!slug;
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      acceptedFiles.forEach(async (file: File) => {
        try {
          const { name, type, size } = file;
          const sizeValidation = isEditing
            ? z.number().min(0)
            : z.number().min(1);

          const fileSchema = z.object({
            name: z.string(),
            type: z
              .string()
              .regex(
                /^image\/(jpeg|png)$/,
                "Only accepting .jpg, .jpeg, and png"
              ),
            size: sizeValidation.max(5 * 1024 * 1024, "File too big"),
          });

          const fileData = { name, type, size };
          await fileSchema.parseAsync(fileData);

          const reader = new FileReader();

          reader.onabort = () => setError("file reading was aborted");
          reader.onerror = () => setError("file reading has failed");

          reader.onload = () => {
            setSelectImage(true);
            setImageState({ file, url: reader.result as string, edit: true });
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
    [isEditing, setImageState]
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
              isEditing && image.url && !selectImage
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
