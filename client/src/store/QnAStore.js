import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore.js";

export const useQnAStore = create((set, get) => ({
  categories: [],
  questions: [],
  answers: [],
  isLoading: false,
  what: "",
  qId: "",
  setQId: (value) => set({ qId: value }),
  setWhat: (value) => set({ what: value }),
  setCategories: (value) => set({ categories: value }),
  setQuestions: (value) => set({ questions: value }),
  setAnswers: (value) => set({ answers: value }),
  setIsLoading: (value) => set({ isLoading: value }),

  // Fetch the list of categories
  getCategories: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/qna/categories");
      set({ categories: res.data });
      set({ what: "category" });
    } catch (error) {
      toast.error("Failed to fetch categories.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new category
  addCategory: async (category) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/qna/categories/add", { category });
      set((state) => ({
        categories: [...state.categories, res.data.category],
      }));
      toast.success("Category added successfully.");
    } catch (error) {
      toast.error("Failed to add category.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove a category
  removeCategory: async (category) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.delete(
        `/qna/categories/${category}/remove`
      );

      if (res.status === 200 && res.data?.success) {
        set((state) => ({
          categories: state.categories.filter((cat) => cat !== category),
        }));
        toast.success("Category removed successfully.");
      } else {
        toast.error("Category could not be removed.");
      }
    } catch (error) {
      toast.error("Failed to remove category.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch questions for a specific category
  getQuestions: async (category) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/qna/categories/${category}/questions`
      );
      set({ questions: res.data || [] });
      console.log(res.data);
      console.log("Updated questions:", get().questions);
    } catch (error) {
      console.error(
        "❌ Failed to fetch questions:",
        err?.response?.data?.message || err.message
      );
      set({ questions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch answers for a specific question
  getAnswers: async (category, questionId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(
        `/qna/categories/${category}/answers/get`,
        {
          questionId,
        }
      );
      set({ answers: res.data });
      console.log("data");
      console.log(res.data);
    } catch (error) {
      toast.error("Failed to fetch answers.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Send a new question
  sendQuestion: async (category, questionData) => {
    try {
      console.log("📦 Logging FormData fields:");
      for (let pair of questionData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      const res = await axiosInstance.post(
        `/qna/categories/${category}/questions`,
        questionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => {
        const qMap = new Map(state.questions.map((q) => [q._id, q]));
        qMap.set(res.data._id, res.data);
        return { questions: Array.from(qMap.values()) };
      });

      toast.success("Question sent successfully.");
    } catch (error) {
      toast.error("Failed to send question.");
    }
  },

  // Send a new answer
  sendAnswer: async (category, answerData) => {
    try {
      const res = await axiosInstance.post(
        `/qna/categories/${category}/answers`,
        answerData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        answers: [...state.answers, res.data],
      }));
      toast.success("Answer sent successfully.");
    } catch (error) {
      toast.error("Failed to send answer.");
    }
  },

  // Connect socket for real-time updates
  connectSocket: () => {
    const { socket } = useAuthStore.getState();
    const { authUser } = useAuthStore.getState();
    if (!socket) return;

    // Real-time new answer
    socket.on("newAnswer", ({ questionId, newAnswer }) => {
      if (newAnswer.senderId !== authUser._id && get().qId === questionId) {
        set((state) => ({
          answers: [...state.answers, newAnswer],
        }));
      }
    });

    // Real-time new question
    socket.on("newQuestion", (newQuestion) => {
      set((state) => {
        const qMap = new Map(state.questions.map((q) => [q._id, q]));
        qMap.set(newQuestion._id, newQuestion);
        return { questions: Array.from(qMap.values()) };
      });
    });
  },
  dissconnectSocket: () => {
    const { socket } = useAuthStore.getState(); // Access shared socket instance from Auth store
    if (!socket) return;
    socket.off("newAnswer");
  },
}));
