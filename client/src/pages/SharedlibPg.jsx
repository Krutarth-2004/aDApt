import React, { useEffect, useState } from "react";
import { useSharedLibStore } from "../store/sharedlibStore";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SharedlibForm from "../components/SharedlibForm";
import { ArrowLeft } from "lucide-react";

const SharedlibPg = () => {
  const {
    categories,
    courses,
    files,
    getCategories,
    getCourses,
    getFiles,
    addCategory,
    removeCategory,
    addCourse,
    removeCourse,
    removeFile,
    addFile,
    catId,
    csId,
    setCatId,
    setCsId,
  } = useSharedLibStore();

  const { authUser } = useAuthStore();
  const [view, setView] = useState("categories");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [actionMode, setActionMode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setCurrentCategory(category);
    setCatId(category._id);
    await getCourses(category._id);
    setView("courses");
  };

  const handleCourseClick = async (course) => {
    setCurrentCourse(course);
    setCsId(course._id);
    await getFiles(catId, course._id);
    setView("files");
  };

  const handleCategoryAction = async () => {
    if (!inputValue.trim()) return;
    actionMode === "add"
      ? await addCategory(inputValue.trim())
      : await removeCategory(inputValue.trim());
    setActionMode("");
    setInputValue("");
  };

  const handleCourseAction = async () => {
    if (!inputValue.trim()) return;
    actionMode === "add"
      ? await addCourse(currentCategory.category, { name: inputValue.trim() })
      : await removeCourse(currentCategory.category, inputValue.trim());
    setActionMode("");
    setInputValue("");
  };

  const handleFileDelete = async () => {
    if (!inputValue.trim()) return;
    await removeFile(catId, csId, inputValue.trim());
    setActionMode("");
    setInputValue("");
  };

  const goBack = () => {
    if (view === "files") {
      setView("courses");
    } else if (view === "courses") {
      setView("categories");
    } else {
      navigate("/");
    }
    setActionMode("");
    setInputValue("");
  };

  const renderControls = () => {
    if (view === "categories" && authUser?.role === "admin") {
      return (
        <>
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setActionMode("add")}
          >
            Add Category
          </button>
          <button
            className="btn btn-outline btn-error"
            onClick={() => setActionMode("remove")}
          >
            Remove Category
          </button>
        </>
      );
    }

    if (view === "courses" && authUser?.role === "admin") {
      return (
        <>
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setActionMode("add")}
          >
            Add Course
          </button>
          <button
            className="btn btn-outline btn-error"
            onClick={() => setActionMode("remove")}
          >
            Remove Course
          </button>
        </>
      );
    }

    if (view === "files" && authUser?.role === "admin") {
      return (
        <>
          <button
            className="btn btn-outline btn-primary"
            onClick={() => setFileModalOpen(true)}
          >
            Add File
          </button>
          <button
            className="btn btn-outline btn-error"
            onClick={() => setActionMode("remove")}
          >
            Remove File
          </button>
        </>
      );
    }

    return null;
  };

  const handleSubmitAction = () => {
    if (view === "categories") handleCategoryAction();
    else if (view === "courses") handleCourseAction();
    else if (view === "files") handleFileDelete();
  };

  return (
    <div className="m-8 pt-16">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn btn-ghost text-primary hover:bg-primary hover:text-white"
          onClick={goBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>

        {authUser?.role === "admin" && (
          <div className="flex gap-2">
            {!actionMode ? (
              renderControls()
            ) : (
              <>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder={
                    actionMode === "add"
                      ? view === "files"
                        ? "File name"
                        : "New name"
                      : "Name to Remove"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  className="btn btn-outline btn-success"
                  onClick={handleSubmitAction}
                >
                  Done
                </button>
                <button
                  className="btn btn-outline btn-warning"
                  onClick={() => {
                    setActionMode("");
                    setInputValue("");
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Categories */}
      {view === "categories" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 ms-5">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="card outline outline-primary text-primary text-2xl font-bold justify-center items-center flex hover:bg-primary hover:text-black cursor-pointer"
              onClick={() => handleCategoryClick(cat)}
            >
              <div className="card-body text-center">{cat.category}</div>
            </div>
          ))}
        </div>
      )}

      {/* Courses */}
      {view === "courses" && (
        <>
          <div className="text-2xl font-semibold mb-4 text-primary ms-5">
            {currentCategory?.category}
          </div>
          {courses.length === 0 ? (
            <div className="text-lg text-gray-600 ms-5">No courses found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 ms-5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="card outline outline-primary text-primary text-2xl font-bold justify-center items-center flex hover:bg-primary hover:text-black cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  <div className="card-body text-center">{course.name}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Files */}
      {view === "files" && (
        <>
          <div className="text-2xl font-semibold mb-4 text-primary ms-5">
            {currentCourse?.name}
          </div>
          {files.length === 0 ? (
            <div className="text-lg text-gray-600 ms-5">No files found.</div>
          ) : (
            <div className="grid gap-4 ms-5">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="card outline outline-primary p-4 text-xl text-primary flex justify-between items-center cursor-pointer hover:bg-primary hover:text-black"
                  onClick={() => window.open(file?.file?.url, "_blank")}
                >
                  <div className="card-body">
                    <div>{file.title}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(file.uploadedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* File Upload Modal */}
      {fileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-600 z-10"
              onClick={() => setFileModalOpen(false)}
            >
              &times;
            </button>
            <SharedlibForm onClose={() => setFileModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedlibPg;
