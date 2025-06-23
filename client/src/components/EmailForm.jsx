import React, { useState } from "react";
import { MessageCircleQuestion, Mail } from "lucide-react";
import { useEmailStore } from "../store/emailStore.js";
import toast from "react-hot-toast";

const EmailForm = ({ selectedCategory, onSuccess }) => {
  const { addEmail } = useEmailStore();
  const [mail, setMail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !mail.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (!selectedCategory?._id) {
      toast.error("Category not selected");
      return;
    }

    try {
      await addEmail(selectedCategory._id, { name, mail });
      setMail("");
      setName("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="mb-4 relative">
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
        />
      </div>

      {/* Name Field */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Full Name"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Submit
      </button>
    </form>
  );
};

export default EmailForm;
