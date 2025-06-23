import React, { useState, useRef } from "react";
import { MessageCircleQuestion, Image, X } from "lucide-react";
import { useQnAStore } from "../store/QnAStore.js";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const QnAForm = ({ category, onSuccess }) => {
  const { sendQuestion } = useQnAStore();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 300,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setFile(compressedFile);
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("Failed to compress image");
    }
  };

  const removeImage = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      toast.error("Please enter a question or upload an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text.trim());
      if (file) formData.append("file", file);

      await sendQuestion(category, formData);

      setText("");
      removeImage();
      toast.success("Question submitted!");

      if (onSuccess) onSuccess(); // ✅ Close form on success
    } catch (err) {
      console.error("Failed to send question:", err);
      toast.error("Failed to submit question");
    }
  };

  return (
    <div className="mt-10 mx-4 outline outline-primary rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="relative py-4 m-4 text-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MessageCircleQuestion className="size-5 text-base-content/40" />
          </div>
          <input
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Ask your question..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {file && (
          <div className="mb-3 flex items-center gap-2 px-4">
            <div className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center w-full px-4 pb-4">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Image className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, or GIF (Max. 600px)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-outline btn-primary m-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default QnAForm;
