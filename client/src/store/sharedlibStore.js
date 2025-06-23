import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useSharedLibStore = create((set, get) => ({
  categories: [],
  courses: [],
  files: [],
  catId: null,
  csId: null,
  isLoading: false,
  isCategories: false,
  isCourses: false,
  isFiles: false,

  setCatId: (value) => set({ catId: value }),
  setCsId: (value) => set({ csId: value }),

  // Fetch categories
  getCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/sharedlib/course_codes");
      set({
        categories: res.data,
        isCategories: true,
        isCourses: false,
        isFiles: false,
      });
    } catch {
      toast.error("Failed to fetch categories.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch courses for category
  getCourses: async (categoryId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/sharedlib/course_codes/${categoryId}/courses`
      );
      set({
        courses: res.data,
        isCategories: false,
        isCourses: true,
        isFiles: false,
      });
    } catch {
      toast.error("Failed to fetch courses.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch files for course
  getFiles: async (categoryId, courseId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/sharedlib/course_codes/${categoryId}/courses/${courseId}/files`
      );
      set({
        files: res.data,
        isCategories: false,
        isCourses: false,
        isFiles: true,
      });
    } catch {
      toast.error("Failed to fetch files.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Add file using multipart/form-data
  addFile: async (categoryId, courseId, fileData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(
        `/sharedlib/course_codes/${categoryId}/courses/${courseId}/files/add`,
        fileData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      set((state) => ({ files: [...state.files, res.data] }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to add file.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove file
  removeFile: async (categoryId, courseId, fileName) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post(
        `/sharedlib/course_codes/${categoryId}/courses/${courseId}/files/${fileName}/remove`
      );
      set((state) => ({
        files: state.files.filter((file) => file.name !== fileName),
      }));
      toast.success("File removed.");
    } catch {
      toast.error("Failed to remove file.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Add category
  addCategory: async (category) => {
    try {
      const res = await axiosInstance.post("/sharedlib/course_codes/add", {
        category,
      });
      set((state) => ({ categories: [...state.categories, res.data] }));
      toast.success("Category added.");
    } catch {
      toast.error("Failed to add category.");
    }
  },

  // Remove category (case-insensitive match)
  removeCategory: async (categoryName) => {
    try {
      await axiosInstance.post(
        `/sharedlib/course_codes/${categoryName}/remove`
      );
      set((state) => ({
        categories: state.categories.filter(
          (cat) => cat.category.toLowerCase() !== categoryName.toLowerCase()
        ),
      }));
      toast.success("Category removed.");
    } catch {
      toast.error("Failed to remove category.");
    }
  },

  // Add course
  addCourse: async (categoryName, courseData) => {
    try {
      const res = await axiosInstance.post(
        `/sharedlib/course_codes/${categoryName}/courses/add`,
        courseData
      );
      set((state) => ({ courses: [...state.courses, res.data] }));
      toast.success("Course added.");
    } catch {
      toast.error("Failed to add course.");
    }
  },

  // Remove course (case-insensitive match)
  removeCourse: async (categoryName, courseName) => {
    try {
      await axiosInstance.post(
        `/sharedlib/course_codes/${categoryName}/courses/${courseName}/remove`
      );
      set((state) => ({
        courses: state.courses.filter(
          (course) => course.name.toLowerCase() !== courseName.toLowerCase()
        ),
      }));
      toast.success("Course removed.");
    } catch {
      toast.error("Failed to remove course.");
    }
  },
}));
