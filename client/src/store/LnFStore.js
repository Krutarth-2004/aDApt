import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useAuthStore } from "./authStore.js";

export const useLnFStore = create((set, get) => ({
  places: [],
  lostMessages: [],
  foundMessages: [],
  replies: [],
  isLoading: false,
  what: "",
  qId: null,

  setWhat: (value) => set({ what: value }),
  setQId: (id) => set({ qId: id }),

  // Fetch places
  getPlaces: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/lnf/places");
      set({ places: res.data });
    } catch {
      toast.error("Failed to fetch places.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a place
  addPlace: async (placeData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/lnf/places/add", placeData);
      set((state) => ({
        places: [...state.places, res.data],
      }));
      toast.success("Place added successfully.");
    } catch {
      toast.error("Failed to add place.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove a place
  removePlace: async (placeId) => {
    set({ isLoading: true });
    console.log(placeId);
    try {
      await axiosInstance.delete(`/lnf/places/${placeId.place}/remove`);
      set((state) => ({
        places: state.places.filter((place) => place !== placeId),
      }));
      toast.success("Place removed successfully.");
    } catch {
      toast.error("Failed to remove place.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Lost messages for a place
  getLostMessages: async (placeId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/lnf/places/${placeId}/messages/lost`
      );
      set({ lostMessages: res.data });
    } catch {
      toast.error("Failed to fetch lost messages.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Found messages for a place
  getFoundMessages: async (placeId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/lnf/places/${placeId}/messages/found`
      );
      set({ foundMessages: res.data });
    } catch {
      toast.error("Failed to fetch found messages.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Send a lost message (multipart)
  sendLostMessage: async (placeId, messageData) => {
    try {
      const res = await axiosInstance.post(
        `/lnf/places/${placeId}/messages/lost`,
        messageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        lostMessages: [...state.lostMessages, res.data],
      }));
      toast.success("Lost message sent successfully.");
    } catch {
      toast.error("Failed to send lost message.");
    }
  },

  // Send a found message (multipart)
  sendFoundMessage: async (placeId, messageData) => {
    try {
      const res = await axiosInstance.post(
        `/lnf/places/${placeId}/messages/found`,
        messageData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        foundMessages: [...state.foundMessages, res.data],
      }));
      toast.success("Found message sent successfully.");
    } catch {
      toast.error("Failed to send found message.");
    }
  },

  // Delete a lost message
  deleteLostMessage: async (placeId, messageId) => {
    try {
      await axiosInstance.delete(
        `/lnf/places/${placeId}/messages/lost/${messageId}`
      );
      set((state) => ({
        lostMessages: state.lostMessages.filter((msg) => msg._id !== messageId),
      }));
      toast.success("Lost message deleted successfully.");
    } catch {
      toast.error("Failed to delete lost message.");
    }
  },

  // Delete a found message
  deleteFoundMessage: async (placeId, messageId) => {
    try {
      await axiosInstance.delete(
        `/lnf/places/${placeId}/messages/found/${messageId}`
      );
      set((state) => ({
        foundMessages: state.foundMessages.filter(
          (msg) => msg._id !== messageId
        ),
      }));
      toast.success("Found message deleted successfully.");
    } catch {
      toast.error("Failed to delete found message.");
    }
  },

  // Fetch replies
  getReplies: async (place, msgId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post(`/lnf/places/${place}/replies`, {
        msgId,
      });
      set({ replies: res.data });
    } catch {
      toast.error("Failed to fetch replies.");
    } finally {
      set({ isLoading: false });
    }
  },

  // Send reply (multipart)
  sendReply: async (place, replyData) => {
    try {
      const res = await axiosInstance.post(
        `/lnf/places/${encodeURIComponent(place)}/reply`,
        replyData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        replies: [...state.replies, res.data],
      }));
      toast.success("Reply sent successfully.");
    } catch {
      toast.error("Failed to send reply.");
    }
  },

  // Real-time socket connection
  connectSocket: () => {
    const { authUser, socket } = useAuthStore.getState();
    if (!socket) return;

    // Setup new reply listener
    socket.on("newReply", ({ msgId, newReply }) => {
      if (newReply.senderId !== authUser._id && get().qId === msgId) {
        set((state) => ({
          replies: [...state.replies, newReply],
        }));
      }
    });

    // Optionally activate real-time updates for messages too
    // socket.on("newLostMessage", (data) => {
    //   set((state) => ({ lostMessages: [...state.lostMessages, data] }));
    // });

    // socket.on("newFoundMessage", (data) => {
    //   set((state) => ({ foundMessages: [...state.foundMessages, data] }));
    // });
  },

  dissconnectSocket: () => {
    const { socket } = useAuthStore.getState();
    if (!socket) return;
    socket.off("newReply");
  },
}));
