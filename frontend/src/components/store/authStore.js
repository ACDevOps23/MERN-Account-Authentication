import { create } from "zustand";
import axios from "axios";

import { config } from "dotenv";

config();

const authAPI_URL = process.env.AUTH_API_URL;

axios.defaults.withCredentials = true; // axios will put the cookies & JWT tokens in the header of the request

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async(name, email, password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${authAPI_URL}/sign-up`, { name, email, password });
            set({user:response.data.newUser, isAuthenticated: true, isLoading: false})
        } catch(error) {
            set({error: error.response.data.message || "Error signing up", isLoading: false});
            throw error;
        }
    },

    verifyEmail: async(code) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${authAPI_URL}/verify-email`, { code });
            set({user:response.data.user, isAuthenticated: true, isLoading: false});
            return response.data;
        } catch(error) {
            set({error: error.response.data.nessage || "invalid or expired verification code", isLoading: false});
            throw error;
        }
    },

    login: async(email, password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${authAPI_URL}/login`, { email, password });
            set({isAuthenticated: true, user: response.data.user, error: null, isLoading: false})
  
        } catch(error) {
            set({error: error.response.data.message || "Error logging in", isLoading: false});
            throw error;
        }
    },

    logout: async() => {
        set({ isLoading: true, error: null});
        try {
            await axios.post(`${authAPI_URL}/logout`);
            set({user: null, isAuthenticated: false, error: null, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false});
            throw error;
        }
    },

    forgotPassword: async(email) => {
        set({ isLoading: true, error: null});
        try {
            const response = await axios.post(`${authAPI_URL}/forgot-password`, { email });
            set({ message: response.data.message, isLoading: false });
        } catch(error) {
            set({ error: "Error sending password refactor email", isLoading: false});
            throw error;
        }
    },

    resetPassword: async(token, password) => {
        set({isLoading: true, error: null});
        try {
            const response = await axios.post(`${authAPI_URL}/reset-password/${token}`, {password});
            set({message: response.data.message, isLoading: false});
        } catch (error) {
            set({ error: error.response.data.message || "Error resetting password", isLoading: false});
            throw error;
        }
    },

    checkAuth: async() => {
        set({ isCheckingAuth: false, error: null});
        try {
            const response = await axios.get(`${authAPI_URL}/checkAuth`);
            set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false});
        } catch(error) {
            set({error: null, isCheckingAuth: false, isAuthenticated: false});
            throw error;
        }   
    }

}));