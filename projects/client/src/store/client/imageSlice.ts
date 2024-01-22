import { StateCreator } from "zustand";

interface Image {
  file: File | null;
  url: string;
}

interface EditImage extends Image {
  imageId?: number | null;
}

export interface ImageForm {
  images: Image[] | null[];
  payloadLength: number;
  editImages: EditImage[] | null[];
  setImageForm: (image: Image | null, index: number) => void;
  setEditImageForm: (image: EditImage | null, index: number) => void;
  setPayloadImageLength: (length: number) => void;
  clearImage: () => void;
}

export const createImageFormSlice: StateCreator<ImageForm> = (set) => ({
  images: new Array(5).fill(null),
  payloadLength: 0,
  editImages: new Array(5).fill(null),
  setImageForm: (image: Image | null, index: number) =>
    set((state) => {
      const modifyImage = state.images;
      modifyImage[index] = image;
      return { images: modifyImage };
    }),
  setEditImageForm: (image: EditImage | null, index: number) =>
    set((state) => {
      const modifyImage = state.editImages;
      if (image) {
        modifyImage[index] = image;
      }
      return { editImages: modifyImage };
    }),
  setPayloadImageLength: (length: number) =>
    set(() => {
      return { payloadLength: length };
    }),
  clearImage: () =>
    set(() => ({
      images: new Array(5).fill(null),
      editImages: new Array(5).fill(null),
    })),
});
