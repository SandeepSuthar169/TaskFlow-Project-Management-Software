import React from 'react'
import { create } from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios.jsx"


export default useAuthStore = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggingIn: false,
  isChekingAuth: false,

  checkAuth: async () => {
    set({isChekingAuth: true})
    try {
      const res = await axiosInstance.get("/auth/check")

      if(res.data.user || res.data.success) {
        set({authUser: res.data.data})
      } else {
        set({ authUser: null })
      } 


    } catch (error) {
      console.error("Error checking auth", errir);
      toast.error({ authUser: null })
    } finally {
      set({ isChekingAuth: false })
    }
  },

  signup: async (data) => {
    set({ isSignUp: true })
  
    try {
      
      const res = await axiosInstance.post("/auth/register", data)

      set({ authUser: res.data.data })
      toast.success(res.data.message)

    } catch (error) {
      console.error("error Signup user", error);
      toast.error("Enter signing up")
    } finally {
      set({ isSignUp: false })
    } 
  },

  loggingIn: async (data) => {
    set({ isLoggingIn: true })

    try {
      const res = await axiosInstance.post("/auth/login", data)

      set({ authUser: res.data.data })
      toast.success(res.data.message)

    } catch (error) {
      console.error(" Error in loggin time", error);
      toast.error("Envalid your data")
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      
      set({ authUser: null });
      toast.success("Logout successful")
    
    } catch (error) {
      console.error(" Error in login time", error);
      toast.error("logout field")
    }
  }

}))

