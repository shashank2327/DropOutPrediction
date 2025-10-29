import React, { createContext, useEffect, useState, useContext, Children } from "react"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"

export const FacultyContext = createContext()

export const FacultyProvider = ({children}) => {

    const {user, token, backendUrl} = useAuth()
    axios.defaults.baseURL = backendUrl

    const [profile, setProfile] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [assignedStudents, setAssignedStudents] = useState([])
    const [alerts, setAlerts] = useState([])

    // Function to fetch faculty profile
    const fetchFacultyProfile = async () => {
        try {
            if(!token || user?.role?.toLowerCase() !== "faculty") {
                // navigate('/login, {replace: true})
                return
            }
            const [profileRes, assignedStudentsRes, alertsRes] = await Promise.all([
                axios.get('/api/user/profile', {headers: {accesstoken: token}}),
                axios.get('/api/user/assigned-students', {headers: {accesstoken: token}}),
                axios.get('/api/user/alerts', {headers: {accesstoken: token}})
            ])
            if(profileRes.data.success){
                setProfile(profileRes.data.user)
            }
            else {
                toast.error("Failed to fetch profile data. Try again Later.")
            }
            if(assignedStudentsRes.data.success) {
                setAssignedStudents(assignedStudentsRes.data.students)
            }
            else {
                toast.error("Failed to fetch assigned students. Try again Later.")
            }
            if(alertsRes.data.success) {
                setAlerts(alertsRes.data.alerts)
            }
            else {
                toast.error("Failed to fetch alerts. Try again Later.")
            }

        } catch (error) {
            console.log(error)
            toast.error(error?.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if(token && user?.role?.toLowerCase() === "faculty") {
            fetchFacultyProfile()
        }
    }, [token, user])

    const value = {
        profile,
        assignedStudents, 
        alerts,
        isLoading,
        fetchFacultyProfile

    }
    return (
        <FacultyContext.Provider value={value}>
            {children}
        </FacultyContext.Provider>
    )
}

export const useFaculty = () => {
    const context = useContext(FacultyContext)
    if(context === undefined) {
        throw new Error("useFaculty must be used within a FacultyProvider")
    }
    return context
}
