import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import React from "react"
import { Outlet } from "react-router-dom"

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="container mt-4">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default MainLayout
