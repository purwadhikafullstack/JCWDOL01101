import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ManageUser = () => {
  return (
    <>
      <Tabs defaultValue="warehouse" className="justify-center">
        <TabsList className="px-1 gap-4">
          <TabsTrigger value="warehouse">Admin Warehouse</TabsTrigger>
          <TabsTrigger value="user">User Data</TabsTrigger>
        </TabsList>
        <TabsContent value="warehouse">Warehouse data</TabsContent>
        <TabsContent value="user">User data</TabsContent>
      </Tabs>
    </>
  )
}

export default ManageUser
