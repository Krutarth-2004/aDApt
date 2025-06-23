import React, { useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { useQnAStore } from "../store/QnAStore";

const AnswerInput = ({ questionId, category }) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendAnswer, setQId } = useQnAStore();

  const handleFileChange = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 300,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(uploadedFile, options);
      setFile(compressedFile);
      setFilePreview(URL.createObjectURL(compressedFile));
    } catch (err) {
      console.error("Error compressing image:", err);
      toast.error("Failed to process image");
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendAnswer = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) {
      toast.error("Type an answer or upload an image");
      return;
    }

    if (!questionId) {
      toast.error("No question selected");
      return;
    }

    try {
      setQId(questionId);
      const formData = new FormData();
      formData.append("questionId", questionId);
      formData.append("text", text.trim());
      if (file) formData.append("file", file);

      await sendAnswer(category, formData);

      setText("");
      removeFile();
      toast.success("Answer sent!");
    } catch (err) {
      console.error("Failed to send answer:", err);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="p-4 w-full">
      {filePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={filePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendAnswer} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type your answer..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              file ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !file}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default AnswerInput;
