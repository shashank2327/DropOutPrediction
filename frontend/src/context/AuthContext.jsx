import React, { createContext, useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-hot-toast'

const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem("token") || null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["accesstoken"] = token
        }
        else {
            delete axios.defaults.headers.common["accesstoken"]
        }
        setLoading(false)
    }, [token])

    //Signup function
    const signup = async (userData) => {
        try {
            let role = userData.role
            if(role == 'faculty') role = 'user'
            const response = await axios.post(`/api/${role}/signup`, userData)
            if (response.data.success) {
                const user = response.data.user || response.data.student
                setUser(user)
                setToken(response.data.accesstoken)
                localStorage.setItem("token", response.data.accesstoken)
                axios.defaults.headers.common["accesstoken"] = response.data.accesstoken
                toast.success(response.data.message)
            }
            else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    //login function
    const login = async (userData) => {
        try {
            const { data } = await axios.post('/api/user/login', userData)
            if (data.success) {
                const user = data.user
                setUser(user)
                setToken(data.accesstoken)
                localStorage.setItem("token", data.accesstoken)
                axios.defaults.headers.common["accesstoken"] = data.accesstoken
                toast.success(data.message)
            }
            else {
                const response = await axios.post('/api/student/login', userData)
                if (response.data.success) {
                    const student = response.data.student
                    setUser(student)
                    setToken(response.data.accesstoken)
                    localStorage.setItem("token", response.data.accesstoken)
                    axios.defaults.headers.common["accesstoken"] = response.data.accesstoken
                    toast.success(response.data.message)
                }
                else {
                    toast.error("No user exists with these credentials")
                }
            }
        } catch (error) {
            console.error(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    //logout function
    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["accesstoken"]
        toast.success("Logged out Successfully!!")
    }

    const value = {
        backendUrl,
        signup,
        login,
        logout,
        token,
        user,
        loading

    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};

