import React from 'react'
import axios from "axios"

 export const axiosInstance = axios.create({
    baseURL: import.meta.env.mode === "development" ? "http://localhost:3005/api/v1" : "/api/v1",
    withCredentials: true
 })
 
