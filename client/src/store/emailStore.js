import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useEmailStore = create((set, get) => ({
  categories: [],
  emails: [],
  isLoading: false,

  getCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/mail/categories");
      set({ categories: res.data });
    } catch {
      toast.error("Failed to fetch categories.");
    } finally {
      set({ isLoading: false });
    }
  },

  getEmails: async (categoryId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/mail/categories/${categoryId}/emails`
      );
      set({ emails: res.data });
    } catch {
      toast.error("Failed to fetch emails.");
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/mail/categories/add", {
        category,
      });
      set((state) => ({ categories: [...state.categories, res.data] }));
      toast.success("Category added successfully.");
    } catch (error) {
      console.error(
        "Add category error: ",
        error.response?.data || error.message
      );
      toast.error("Failed to add category.");
    } finally {
      set({ isLoading: false });
    }
  },

  removeCategory: async (categoryId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/mail/categories/${categoryId}/remove`);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== categoryId),
      }));
      toast.success("Category removed successfully.");
    } catch {
      toast.error("Failed to remove category.");
    } finally {
      set({ isLoading: false });
    }
  },

  addEmail: async (categoryId, emailData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(
        `/mail/categories/${categoryId}/emails/add`,
        { category: categoryId, ...emailData }
      );
      set((state) => ({ emails: [...state.emails, res.data] }));
      toast.success("Email added successfully.");
    } catch {
      toast.error("Failed to add email.");
    } finally {
      set({ isLoading: false });
    }
  },

  removeEmail: async (categoryId, emailId) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(
        `/mail/categories/${categoryId}/emails/${emailId}/remove`
      );
      set((state) => ({
        emails: state.emails.filter((email) => email._id !== emailId),
      }));
      toast.success("Email removed successfully.");
    } catch {
      toast.error("Failed to remove email.");
    } finally {
      set({ isLoading: false });
    }
  },
}));
