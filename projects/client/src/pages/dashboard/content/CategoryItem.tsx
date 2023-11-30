import React, { useState, useEffect } from "react";
import service from "@/service";
import { ChromePicker, ColorResult } from 'react-color';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
  color: string;
}

export default function Category() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({name: "", color: "#000000"});
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    service.get(`/categories`).then((response) => {
      if (Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        console.error("Data from API is not an array");
      }
    });
  }, []);

  const addCategory = () => {
    service.post(`/categories`, newCategory).then((response) => {
      if (Array.isArray(categories)) {
        setCategories([...categories, response.data.data]);
      }
      setNewCategory({name: "", color: "#000000"});
    });
  };

  const updateCategory = () => {
    if (editCategory) {
      service.put(`/categories/${editCategory.id}`, editCategory).then((response) => {
        setCategories(categories.map(category => category.id === editCategory?.id ? response.data.data : category));
        setEditCategory(null);
        setShowDialog(false);
      });
    }
  };

  const deleteCategory = (id: number) => {
    service.delete(`/categories/${id}`).then(() => {
      if (Array.isArray(categories)) {
        setCategories(categories.filter((category) => category.id !== id));
      }
    });
  };

  const handleColorChange = (color: ColorResult) => {
    setNewCategory({...newCategory, color: color.hex});
  };

  const handleEditColorChange = (color: ColorResult) => {
    if (editCategory) {
      setEditCategory({...editCategory, color: color.hex});
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md items-center space-x-4 flex-col">
      <h1>Category</h1>
      <div className="flex-shrink-0">
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
          placeholder="Name"
          className="rounded-lg p-2 border border-gray-300"
        />
        <div className="flex items-center mt-2">
          <label className="mr-2">Color:</label>
          <div onClick={() => setShowColorPicker(showColorPicker => !showColorPicker)} className="flex items-center">
            <div style={{ background: newCategory.color, width: 150, height: 20, borderRadius: '5%' }}/>
            {showColorPicker && <ChromePicker color={newCategory.color} onChange={handleColorChange} />}
          </div>
        </div>
        <button onClick={addCategory} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 ">
          Add Category
        </button>
      </div>
      <Dialog open={showDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Make changes to the category here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editCategory && (
            <div className="grid gap-4 py-4">
              <input
                type="text"
                value={editCategory.name}
                onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                placeholder="Name"
                className="rounded-lg p-2 border border-gray-300"
              />
              <div className="flex items-center mt-2">
                <label className="mr-2">Color:</label>
                <div onClick={() => setShowColorPicker(showColorPicker => !showColorPicker)} className="flex items-center">
                  <div style={{ background: editCategory.color, width: 150, height: 20, borderRadius: '5%' }}/>
                  {showColorPicker && <ChromePicker color={editCategory.color} onChange={handleEditColorChange} />}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={updateCategory}>Save changes</Button>
            <Button type="button" onClick={() => setShowDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="mt-4">
        {Array.isArray(categories) && categories.map((category) => (
          <div key={category.id} className="mt-2 flex items-center justify-between w-full border border-gray-300 rounded-lg p-2">
            <div className="flex" >{category.name} <div style={{ background: category.color, width: 20, height: 20, borderRadius: '50%',marginLeft:10 }}/></div>
            <div>
              <button onClick={() => {setEditCategory(category); setShowDialog(true);}} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                Edit
              </button>
              <button onClick={() => deleteCategory(category.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
