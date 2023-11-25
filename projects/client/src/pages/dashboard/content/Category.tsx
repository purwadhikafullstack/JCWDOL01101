import React, { useState, useEffect } from "react";
import service from "@/service";
import { response } from "express";

export default function Category() {
    type CategoryType = {
        id: number;
        name: string;
        imageUrl: string;
    }

    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', imageUrl: 0 });

    useEffect(() => {
        service.get(`/categories/get`)
            .then((response) => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("There was an error!", error);
            });
    }, []);

    // const addCategory = () => {
    //     service.post(`/categories/post`, newCategory).then(() => {
    //         setCategories([...categories, response.data]);
    //     })
    //     .catch(error => {
    //         console.error("There was an error!", error);
    //       });
    // };

    // const deleteCategory = (id: number) => {
    //     service.delete(`/categories/delete/${id}`).then(() => {
    //         setCategories(categories.filter((category) => category.CategoryID !== CategoryID));
    //     });
    // };

    return (
        <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md items-center space-x-4 flex-col">
            <h1>Category</h1>
            <div className="flex-shrink-0">
                {/* <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="rounded-lg p-2 border border-gray-300"
                />
                <button onClick={addCategory} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">
                    Add Category
                </button> */}
            </div>
            <div>
                {categories.map((category) => (
                    <div key={category.id} className="mt-2 flex items-center justify-between w-full border border-gray-300 rounded-lg p-2">
                        <div>{category.name}</div>
                        {/* <button onClick={() => deleteCategory(category.CategoryID)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Delete
                        </button> */}
                    </div>

                ))}
            </div>
        </div>
    );
}