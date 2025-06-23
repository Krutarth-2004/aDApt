import React, { useState, useEffect } from "react";
import { useEmailStore } from "../store/emailStore";
import { useAuthStore } from "../store/authStore";
import EmailForm from "../components/EmailForm";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EmailPg = () => {
  const {
    getCategories,
    categories,
    emails,
    getEmails,
    addCategory,
    removeCategory,
    removeEmail,
  } = useEmailStore();

  const { authUser } = useAuthStore();
  const [view, setView] = useState("categories");
  const [currentCategory, setCurrentCategory] = useState(null);
  const [actionMode, setActionMode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setCurrentCategory(category);
    await getEmails(category._id);
    setView("emails");
  };

  const handleCategorySubmit = async () => {
    if (!inputValue.trim()) return;

    if (actionMode === "add") {
      await addCategory(inputValue.trim());
    } else if (actionMode === "remove") {
      const match = categories.find((c) => c.category === inputValue.trim());
      if (match) {
        await removeCategory(match._id);
      } else {
        toast.error("Category not found");
      }
    }

    setActionMode("");
    setInputValue("");
  };

  const handleDeleteEmail = async (emailId) => {
    await removeEmail(currentCategory._id, emailId);
  };

  const isViewingEmails = view === "emails";
  const isViewingCategories = view === "categories";

  return (
    <div className="m-8 pt-16">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        {/* Left: Back button */}
        <button
          className="btn btn-ghost text-primary hover:bg-primary hover:text-white flex items-center gap-2"
          onClick={() => {
            if (isViewingEmails) {
              setView("categories");
              setCurrentCategory(null);
            } else {
              navigate("/");
            }
            setActionMode("");
            setInputValue("");
            setShowModal(false);
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>

        {/* Right: Action buttons or input form */}
        <div className="flex gap-2">
          {isViewingCategories && authUser?.role === "admin" && (
            <>
              {!actionMode ? (
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
              ) : (
                <>
                  <input
                    type="text"
                    className="input input-bordered"
                    placeholder={
                      actionMode === "add"
                        ? "New Category"
                        : "Category to Remove"
                    }
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <button
                    className="btn btn-outline btn-success"
                    onClick={handleCategorySubmit}
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
            </>
          )}

          {isViewingEmails && authUser && (
            <button
              className="btn btn-outline btn-primary"
              onClick={() => setShowModal(true)}
            >
              Add Email
            </button>
          )}
        </div>
      </div>

      {/* Category View */}
      {isViewingCategories && (
        <>
          {categories.length === 0 ? (
            <div className="text-xl font-semibold text-primary">
              No categories found...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 ms-5">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="card outline outline-primary text-primary text-2xl justify-center items-center font-bold flex hover:bg-primary hover:text-black cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="card-body text-center">
                    {category.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Email View */}
      {isViewingEmails && (
        <>
          <div className="text-2xl font-semibold mb-4 text-primary ms-5">
            {currentCategory?.category}
          </div>

          <div className="grid gap-4 ms-5">
            {emails.length === 0 ? (
              <div className="text-lg text-gray-600">No emails found.</div>
            ) : (
              emails.map((email) => (
                <div
                  key={email._id}
                  className="card outline outline-primary p-4 text-xl text-primary flex justify-between items-center"
                >
                  <div className="card-body">
                    <div>
                      <strong>Name:</strong> {email.name}
                    </div>
                    <div>
                      <strong>Email:</strong> {email.mail}
                    </div>
                  </div>
                  {authUser?.role === "admin" && (
                    <button
                      className="btn btn-outline btn-error"
                      onClick={() => handleDeleteEmail(email._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modal for Adding Email */}
      {showModal && (
        <>
          <input
            type="checkbox"
            id="add-email-modal"
            className="modal-toggle"
            checked
            readOnly
          />
          <div className="modal modal-open">
            <div className="modal-box relative">
              <label
                htmlFor="add-email-modal"
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setShowModal(false)}
              >
                ✕
              </label>
              <h3 className="text-2xl font-bold mb-4 text-primary">
                Add Email
              </h3>
              <EmailForm
                selectedCategory={currentCategory}
                onSuccess={() => setShowModal(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EmailPg;
