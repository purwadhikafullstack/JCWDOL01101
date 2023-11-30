import React, { useState, useEffect } from "react";
import { ChromePicker, ColorResult } from 'react-color';
import { Button } from "@/components/ui/button";
import { useCategories, useFetchCategory } from "@/hooks/useCategory";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCategoryMutation, useDeleteCategoryMutation, useEditCategoryMutation } from "@/hooks/useCategoryMutation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  color: z.string().min(2).max(50),
})

const formEditSchema = z.object({
  name: z.string().min(2).max(50),
  color: z.string().min(2).max(50),
})

export default function ManageCategory() {
  const [showColorPicker, setShowColorPicker] = useState({ post: false, edit: false });
  const { data: categoriess, isLoading } = useCategories();
  const categoryMutation = useCategoryMutation();
  const editCategoryMutation = useEditCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const { data: category } = useFetchCategory(currentCategoryId);
  const [isEdit, setIsEdit] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: "#000000"
    },
  })

  const formEdit = useForm<z.infer<typeof formEditSchema>>({
    resolver: zodResolver(formEditSchema),
    defaultValues: {
      name: "",
      color: "#000000"
    },
  })

  useEffect(() => {
    if (category) {
      formEdit.setValue("name", category.name)
      formEdit.setValue("color", category.color)
    }
  }, [category])

  function onSubmit(values: z.infer<typeof formSchema>) {
    categoryMutation.mutate(values)
  }

  function onEdit(values: z.infer<typeof formSchema>) {
    if (currentCategoryId) {
      editCategoryMutation.mutate({ ...values, id: currentCategoryId });
    }
  }

  function onDelete(id: number) {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id);
    }
  }

  useEffect(() => {
    if (categoryMutation.isSuccess) {
      form.reset({ name: "", color: "#000000" })
    }
  }, [categoryMutation.isSuccess])

  return (
    <div className="container">
      <div className="flex justify-evenly">
        <div className="border p-4">
          <p className="font-bold">Add Category</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Color</FormLabel>
                    <FormControl>
                      <div onClick={() => setShowColorPicker({ ...showColorPicker, post: !showColorPicker.post })} className="flex items-center">
                        <div className="relative p-4">
                          <div style={{ backgroundColor: field.value }} className={` w-[150px] h-[20px] rounded-sm`} />
                          {showColorPicker.post && <ChromePicker className="absolute right-0 top-0 transform translate-x-[100%]" color={field.value} onChange={(color) => field.onChange(color.hex)} />}
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">
                {categoryMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit</Button>
            </form>
          </Form>
        </div>
        <div className="border p-4">
          <p className="font-bold">Edit Category</p>
          {!isEdit ? <p>Choose an item to edit</p> : (
            <Form {...formEdit}>
              <form onSubmit={formEdit.handleSubmit(onEdit)} className="space-y-1">
                <FormField
                  control={formEdit.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={formEdit.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Color</FormLabel>
                      <FormControl>
                        <div onClick={() => setShowColorPicker({ ...showColorPicker, edit: !showColorPicker.edit })} className="flex items-center">
                          <div className="relative p-4">
                            <div style={{ backgroundColor: field.value }} className={` w-[150px] h-[20px] rounded-sm`} />
                            {showColorPicker.edit && <ChromePicker className="absolute right-0 top-0 transform translate-x-[100%]" color={field.value} onChange={(color) => field.onChange(color.hex)} />}
                          </div>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-around">
                  <Button type="submit">
                    {categoryMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Submit
                  </Button>
                  <Button onClick={() => { setIsEdit(false) }} className="bg-slate-950 hover:bg-slate-500">
                    {categoryMutation.isPending && <Loader2 className="w-4 h-4 mr-2" />}
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
      <div className="mt-4">
        {isLoading ? <p>Loading...</p> : (
          <>{(categoriess) && categoriess.map((category) => (
              <div key={category.id} className="mt-2 flex items-center justify-between w-full border border-gray-300 rounded-lg p-2">
                <div className="flex justify-evenly" >{category.name}<div style={{ background: category.color, width: 20, height: 20, borderRadius: '50%', marginLeft: 10 }} /></div>
                <div>
                  <button onClick={() => { setCurrentCategoryId(category.id), setIsEdit(true) }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                    Edit
                  </button>
                  <button onClick={() => onDelete(category.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                  </button>
                </div>
              </div>
            ))}</>
        )}
      </div>
    </div>
  );
}

