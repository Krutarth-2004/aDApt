import React, { useState, useRef } from "react";
import {
  MessageCircleQuestion,
  Image,
  X,
  ClipboardList,
  File,
} from "lucide-react";
import { useSharedLibStore } from "../store/sharedlibStore.js";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

const SharedlibForm = ({ onClose }) => {
  const { addFile, catId, csId } = useSharedLibStore();
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(""); // Track file type
  const [name, setName] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const allowedTypes = ["image/", "application/pdf", "video/mp4"];
    const isValidType = allowedTypes.some((type) => file.type.startsWith(type));

    if (!isValidType) {
      toast.error(
        "Invalid file type. Only images, PDFs, and MP4s are allowed."
      );
      return;
    }

    try {
      let processedFile = file;
      setFileType(file.type);

      // Compress image if it's an image file
      if (file.type.startsWith("image/")) {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 300,
          useWebWorker: true,
        };
        processedFile = await imageCompression(file, options);
      }

      setFile(processedFile);
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file");
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !name.trim()) {
      toast.error("Please provide both file and filename.");
      return;
    }
    if (!catId || !csId) {
      toast.error("Please select both category and course.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", name.trim());
      formData.append("file", file); // file is already compressed (if needed)

      await addFile(catId, csId, formData); // call from sharedlibStore

      toast.success("File uploaded successfully!");
      onClose?.();
      setFile(null);
      setFileType("");
      setName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send file:", error);
      toast.error("Submission failed");
    }
  };

  return (
    <div className="mt-10 mx-4 outline outline-primary rounded-lg mb-3">
      <form onSubmit={handleSubmit}>
        <h1 className="text-xl w-full justify-center items-center text-center pt-4">
          Share Your File
        </h1>

        <div className="relative py-4 m-4 text-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <File className="size-5 text-base-content/40" />
          </div>
          <input
            type="text"
            className="input input-bordered w-full pl-10"
            placeholder="Filename"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* File Preview Section */}
        {file && (
          <div className="mb-3 flex items-center gap-2 px-4 relative">
            {fileType.startsWith("image/") ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                />
              </div>
            ) : (
              <div className="relative">
                <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-lg border border-zinc-700">
                  {fileType === "application/pdf" ? "PDF" : "Video"}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        )}

        {/* File Upload Input */}
        <div className="flex items-center justify-center w-full px-4 pb-4">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Image className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Images, PDFs, or MP4s
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-outline btn-primary m-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default SharedlibForm;
