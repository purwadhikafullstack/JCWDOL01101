import { Image } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import z, { ZodError } from "zod";
import { Image as ImageType } from "../product/ProductImage";
import { useSearchParams } from "react-router-dom";
import { baseURL } from "@/service";
type CategoryImageFormProps = {
  error: string;
  image: ImageType | null;
  setError: (msg: string) => void;
  setImage: React.Dispatch<React.SetStateAction<ImageType | null>>;
};
const CategoryImageForm = ({
  error,
  image,
  setError,
  setImage,
}: CategoryImageFormProps) => {
  const [searchParams] = useSearchParams();
  const edit = !!searchParams.get("edit") || false;
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
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
          setImage({ file, url: reader.result as string });
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
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div className="flex-1">
      <div
        {...getRootProps()}
        className={`${
          error && "border-primary"
        }w-full text-muted-foreground hover:text-primary group  cursor-pointer hover:border-dashed hover:border-primary border-2 border-dashed flex flex-col justify-center items-center`}
      >
        {image ? (
          <div className="w-full h-[300px]">
            <img
              src={
                edit && !image.file
                  ? `${baseURL}/images/${image.url}`
                  : image.url
              }
              className="object-contain w-full h-full"
            />
          </div>
        ) : (
          <div
            className={`flex flex-col h-[300px] items-center justify-center ${
              error && "text-primary"
            }`}
          >
            <Image className="w-10 h-10" strokeWidth={1} />
            <p>add image category</p>
          </div>
        )}
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default CategoryImageForm;
