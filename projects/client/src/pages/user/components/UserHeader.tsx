import React from "react"
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"

const UserHeader = () => {
  const [site, setSite] = useState("Dashboard")
  const location = useLocation()

  useEffect(() => {
    const paths = location.pathname.split("/")
    const site = paths[paths.length - 1]
    const formatSite = site.replace(/-/g, " ")
    setSite(formatSite || "Profile")
  }, [location.pathname])

  return (
    <div className="flex justify-start items-center bg-backgorund p-6 border-b">
      <h2 className="capitalize text-2xl font-medium">{site}</h2>
    </div>
  )
}

export default UserHeader
