import React, { createContext, useEffect, useState, useContext } from "react"
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useAuth } from "./AuthContext.jsx"

export const StudentContext = createContext()

export const StudentProvider = ({ children }) => {
    const { user, token, backendUrl } = useAuth()
    axios.defaults.baseURL = backendUrl

    const [profile, setProfile] = useState(null)
    const [attendance, setAttendance] = useState([])
    const [academics, setAcademics] = useState([])
    const [fees, setFees] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const fetchStudentData = async () => {
        try {
            if (!token || user?.role?.toLowerCase() !== "student") {
                // navigate('/login', {replace: true}) 
                return
            }

            const [profileRes, attendanceRes, academicsRes, feesRes] = await Promise.all([
                axios.get("/api/student/profile", { headers: { accesstoken: token } }),
                axios.get("/api/student/my-attendance", { headers: { accesstoken: token } }),
                axios.get("/api/student/my-academics", { headers: { accesstoken: token } }),
                axios.get("/api/student/my-fees", { headers: { accesstoken: token } }),
            ]);

            if (profileRes.data.success) setProfile(profileRes.data.student);
            else toast.error("Failed to fetch profile data.");

            if (attendanceRes.data.success) setAttendance(attendanceRes.data.attendance);
            else toast.error("Failed to fetch attendance data.");

            if (academicsRes.data.success) setAcademics(academicsRes.data.academics);
            else toast.error("Failed to fetch academic records.");

            if (feesRes.data.success) setFees(feesRes.data.fees);
            else toast.error("Failed to fetch fee records.");

        } catch (error) {
            console.log(error)
            toast.error(error?.message || "An error occurred while fetching student data.")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token && user?.role?.toLowerCase() === "student") {
            fetchStudentData();
        }
    }, [token, user])

    const value = {
        profile,
        attendance,
        academics,
        fees,
        isLoading,
        fetchStudentData,

    }

    return (
        <StudentContext.Provider value={value}>
            {children}
        </StudentContext.Provider>
    )
}

export const useStudent = () => {
    return useContext(StudentContext)
}