import React, { useEffect, useState } from "react";
import { useQnAStore } from "../store/QnAStore";
import { useAuthStore } from "../store/authStore";
import QnAForm from "../components/QnAForm";
import AnswerInput from "../components/AnswerInput";
import { ArrowLeft } from "lucide-react";
import questionMarkImage from "../assets/question_mark.jpg";
import { useNavigate } from "react-router-dom";
import logo from "../assets/user.jpg";

const QnAPg = () => {
  const {
    getCategories,
    addCategory,
    removeCategory,
    getAnswers,
    getQuestions,
    categories,
    questions,
    answers,
    connectSocket,
    dissconnectSocket,
  } = useQnAStore();

  const { authUser } = useAuthStore();

  const [view, setView] = useState("category");
  const [inputValue, setInputValue] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [actionMode, setActionMode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    connectSocket();
    return () => dissconnectSocket();
  }, [connectSocket, dissconnectSocket]);

  useEffect(() => {
    // Debug: detect duplicate question IDs
    const ids = questions.map((q) => q._id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      console.warn("Duplicate question _id(s):", duplicates);
    }
  }, [questions]);

  const handleCategoryClick = async (category) => {
    setCurrentCategory(category);
    try {
      await getQuestions(category);
    } catch (err) {
      console.warn("No questions found or fetch failed:", err);
    }
    setView("qna");
  };

  const handleQuestionClick = async (questionId, img, content) => {
    setSelectedQuestionId(questionId);
    setSelectedImg(img?.url);
    setSelectedText(content);
    await getAnswers(currentCategory, questionId);
    setView("chat");
  };

  const handleSubmitAction = async () => {
    if (!inputValue.trim()) return;
    actionMode === "add"
      ? await addCategory(inputValue.trim())
      : await removeCategory(inputValue.trim());
    setActionMode("");
    setInputValue("");
  };

  const goBack = () => {
    if (view === "chat") {
      setView("qna");
    } else if (view === "qna") {
      setView("category");
    } else if (view === "category") {
      navigate("/");
    }
    setActionMode("");
    setInputValue("");
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

        <div className="flex gap-2">
          {/* Admin Category Controls */}
          {authUser?.role === "admin" &&
            view === "category" &&
            (!actionMode ? (
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
                    actionMode === "add" ? "Add category" : "Category to remove"
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
            ))}

          {/* Add Question Button in QnA View */}
          {view === "qna" && (
            <button
              className="btn btn-outline btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close Form" : "➕ Add Question"}
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      {view === "category" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {[...new Set(categories)].map((cat) => (
            <div
              key={cat}
              className="card outline outline-primary text-primary text-2xl font-bold justify-center items-center flex hover:bg-primary hover:text-black cursor-pointer"
              onClick={() => handleCategoryClick(cat)}
            >
              <div className="card-body text-center">{cat}</div>
            </div>
          ))}
        </div>
      )}

      {/* Questions */}
      {view === "qna" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...new Map(questions.map((q) => [q._id, q])).values()].map(
              (q) => (
                <div
                  key={q._id}
                  className="card outline outline-primary p-4 shadow-xl hover:bg-primary hover:text-black cursor-pointer"
                  onClick={() => handleQuestionClick(q._id, q.file, q.text)}
                >
                  <img
                    src={q.file?.url || questionMarkImage}
                    alt="Question"
                    className="rounded-lg h-40 object-cover w-full"
                  />
                  <p className="text-xl mt-2">
                    {q.text.length > 60 ? q.text.slice(0, 60) + "..." : q.text}
                  </p>
                </div>
              )
            )}
          </div>

          {showForm && (
            <div className="mt-10">
              <QnAForm
                category={currentCategory}
                onSuccess={() => setShowForm(false)}
              />
            </div>
          )}
        </>
      )}

      {/* Chat */}
      {view === "chat" && (
        <>
          <div className="card bg-base-100 shadow-xl p-4">
            <img
              className="max-w-full md:max-w-[500px] mx-auto"
              src={selectedImg || questionMarkImage}
              alt="Selected Question"
            />
            <p className="text-2xl text-center mt-4">{selectedText}</p>
          </div>

          <div className="space-y-4 py-6">
            {answers.map((a, i) => {
              const isMine = a.senderId === authUser?._id;

              return (
                <div
                  key={a._id || i}
                  className={`chat ${isMine ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 h-10 rounded-full border">
                      <img src={logo} alt="Avatar" />
                    </div>
                  </div>
                  <div
                    className={`chat-bubble ${
                      isMine
                        ? "bg-primary text-white"
                        : "bg-base-200 text-black"
                    }`}
                  >
                    {a.file?.url && (
                      <img
                        src={a.file.url}
                        alt="Attachment"
                        className="max-w-[200px] rounded mb-2"
                      />
                    )}
                    <p className="text-lg">{a.text || "No content"}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <AnswerInput
            questionId={selectedQuestionId}
            category={currentCategory}
          />
        </>
      )}
    </div>
  );
};

export default QnAPg;
