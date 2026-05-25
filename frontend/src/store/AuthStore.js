import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../api";

export const useAuth = create((set) => ({
    currentUser: null,
    isAuthenticated: false,
    loading: false,
    error: null,

  // GET CURRENT USER DETAILS
    getCurrentUserDetails: async () => {
      try {
        const res = await api.get("/common/check-auth");

        set({
          currentUser: res.data.user,
          isAuthenticated: true,
          error: null,
        });

        return res.data.user;
      } catch (err) {
        set({
          currentUser: null,
          isAuthenticated: false,
        });
        throw err;
      }
    },

  // LOGIN FUNCTION
    login: async (email, password, role) => {
    try {
      // set loading true
        set({ loading: true, error: null });

      // API request
        const res = await api.post(
        "/common/login",
        { email, password, role }
        );

      // store token in localStorage for cross-domain requests
      if (res.data.token) {
        localStorage.setItem('authToken', res.data.token)
      }

      // update state
        set({
        currentUser: res.data.user,
        isAuthenticated: true,
        loading: false,
        });

        toast.success("Login successful!", { duration: 3000 });
        return res.data;

    } catch (err) {
      const apiMessage = err.response?.data?.message;
      const isWrongCredentials = err.response?.status === 401 && apiMessage === "wrong credentials";
      const isUnauthorizedRole = err.response?.status === 401 && apiMessage === "unauthorized login";
      const message = isWrongCredentials
        ? "wrong credentials"
        : isUnauthorizedRole
          ? "unauthorized login"
          : (apiMessage || "Login failed");

      console.error(message);

        set({
        loading: false,
      error: message,
        isAuthenticated: false,
        currentUser: null,
        });

        throw err;
    }
    },

  // LOGOUT FUNCTION
    logout: async () => {
    try {
      await api.post("/common/logout", {});
      // clear token from localStorage
      localStorage.removeItem('authToken')
      toast.success("Logged out successfully!", { duration: 3000 });
    } catch (err) {
      console.log("logout err is", err);
    }

    set({
        currentUser: null,
        isAuthenticated: false,
        error: null,
    });
    },

    checkAuthFromCookie: async () => {
      set({ loading: true, error: null });
      try {
        const res = await api.get("/common/check-auth");

        set({
          currentUser: res.data.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (err) {
        set({
          currentUser: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    },
}));