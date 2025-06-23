import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { useLnFStore } from "../store/LnFStore.js";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const LnFForm = ({ place, onClose, onSuccess }) => {
  const { sendLostMessage, sendFoundMessage } = useLnFStore();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [type, setType] = useState("Lost");
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      const compressedFile = await imageCompression(selectedFile, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 300,
        useWebWorker: true,
      });
      setFile(compressedFile);
    } catch (error) {
      console.error("Image compression failed:", error);
      toast.error("Image compression failed");
    }
  };

  const removeImage = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!place || (!text.trim() && !file)) {
      toast.error("Please provide a description or image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text.trim());
      if (file) formData.append("file", file);

      if (type === "Lost") {
        await sendLostMessage(place.trim(), formData);
      } else if (type === "Found") {
        await sendFoundMessage(place.trim(), formData);
      }
      setText("");
      setFile(null);
      setType("Lost");
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-lg max-w-xl w-full mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        Report Lost / Found Item
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Description Input */}
        <div className="mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Item Description"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Type Toggle */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            className={`btn ${type === "Lost" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setType("Lost")}
          >
            Lost
          </button>
          <button
            type="button"
            className={`btn ${
              type === "Found" ? "btn-success" : "btn-outline"
            }`}
            onClick={() => setType("Found")}
          >
            Found
          </button>
        </div>

        {/* Image Preview */}
        {file && (
          <div className="mb-4 flex justify-center">
            <div className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-[-8px] right-[-8px] btn btn-xs btn-circle"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Submit + Cancel */}
        <div className="flex justify-between mt-6">
          <button type="button" onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LnFForm;
