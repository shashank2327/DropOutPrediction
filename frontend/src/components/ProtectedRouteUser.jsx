import React from 'react'
import { AuthContext, useAuth } from "../context/AuthContext.jsx";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRouteUser = () => {
   const { user, loading, token } = useAuth()
   if(loading) {
    return <div> Loading... </div>
   }
   if(!token || (user?.role !== 'faculty')) {
    return <Navigate to='/login' replace/>
   }
   return <Outlet/>
}

export default ProtectedRouteUser