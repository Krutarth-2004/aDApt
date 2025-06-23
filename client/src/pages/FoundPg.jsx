import React, { useEffect, useState } from "react";
import { useLnFStore } from "../store/LnFStore.js";
import { useAuthStore } from "../store/authStore";
import foundMarkImage from "../assets/search_mark.jpg";
import ReplyInput from "../components/ReplyInput";
import LnFForm from "../components/LnFForm";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/user.jpg";

const FoundPg = () => {
  const {
    getPlaces,
    addPlace,
    removePlace,
    getFoundMessages,
    deleteFoundMessage,
    places,
    foundMessages,
    getReplies,
    replies,
    connectSocket,
    dissconnectSocket,
  } = useLnFStore();

  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const [actionMode, setActionMode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [currentPlace, setCurrentPlace] = useState(null);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedText, setSelectedText] = useState(null);
  const [view, setView] = useState("place"); // "place", "lnf", "chat"
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    connectSocket();
    return () => dissconnectSocket();
  }, [connectSocket, dissconnectSocket]);

  const handleAction = async () => {
    if (!inputValue.trim()) return;

    if (actionMode === "add") {
      await addPlace({ place: inputValue.trim() });
    } else if (actionMode === "remove") {
      await removePlace({ place: inputValue.trim() });
    }

    await getPlaces();
    setActionMode("");
    setInputValue("");
  };

  const handlePlaceClick = async (place) => {
    setCurrentPlace(place);
    await getFoundMessages(place);
    setView("lnf");
  };

  const handleMsgClick = async (id, img, text) => {
    setSelectedMsgId(id);
    setSelectedImg(img?.url || img); // in case it's just URL string
    setSelectedText(text);
    await getReplies(currentPlace, id);
    setView("chat");
  };

  const handleDelete = async () => {
    await deleteFoundMessage(currentPlace, selectedMsgId);
    setView("lnf");
  };

  const goBack = () => {
    if (view === "chat") setView("lnf");
    else if (view === "lnf") setView("place");
    else if (view === "place") navigate("/");
    setActionMode("");
    setInputValue("");
  };

  const truncateText = (text, len) =>
    text.length > len ? text.slice(0, len) + "..." : text;

  return (
    <div className="m-8 pt-16">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="btn btn-ghost text-primary hover:bg-primary hover:text-white flex items-center"
          onClick={goBack}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {authUser?.role === "admin" && view === "place" && (
          <div className="flex gap-2">
            {!actionMode ? (
              <>
                <button
                  className="btn btn-outline btn-primary"
                  onClick={() => setActionMode("add")}
                >
                  Add Place
                </button>
                <button
                  className="btn btn-outline btn-error"
                  onClick={() => setActionMode("remove")}
                >
                  Remove Place
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder={
                    actionMode === "add" ? "New Place" : "Place to Remove"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  className="btn btn-outline btn-success"
                  onClick={handleAction}
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

        {view === "lnf" && (
          <button
            className="btn btn-outline btn-primary flex items-center gap-1"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Add
          </button>
        )}
      </div>

      {/* Places View */}
      {view === "place" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-4 ms-5">
          {places.map((placeObj, index) => (
            <div
              key={index}
              className="card outline outline-primary text-primary text-2xl font-bold justify-center items-center flex hover:bg-primary hover:text-black cursor-pointer"
              onClick={() => handlePlaceClick(placeObj.place)}
            >
              <div className="card-body text-center">{placeObj.place}</div>
            </div>
          ))}
        </div>
      )}

      {/* Messages View */}
      {view === "lnf" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 my-6 ms-5">
          {foundMessages.map((msg) => (
            <div
              key={msg._id}
              className="card outline outline-primary outline-2 shadow-2xl flex flex-col hover:bg-primary hover:text-black transition-colors cursor-pointer h-80"
              onClick={() => handleMsgClick(msg._id, msg.file, msg.text)}
            >
              <figure>
                <img
                  src={msg.file?.url || foundMarkImage}
                  alt="Found Item"
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body text-xl">
                <p>{truncateText(msg.text, 50)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chat View */}
      {view === "chat" && (
        <>
          <div className="flex justify-center items-center w-full">
            <div className="card bg-base-100 w-full shadow-xl p-4 m-4">
              <div className="card-actions justify-start">
                <button
                  className="btn btn-primary text-xl"
                  onClick={handleDelete}
                >
                  Mark as Claimed
                </button>
              </div>
              <figure>
                <img
                  className="sm:max-w-[500px]"
                  src={selectedImg || foundMarkImage}
                  alt="Selected"
                />
              </figure>
              <div className="card-body text-2xl">
                <p>{selectedText}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {replies.map((reply, index) => (
              <div
                key={index}
                className={
                  authUser?._id === reply.senderId
                    ? "chat chat-end"
                    : "chat chat-start"
                }
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img src={logo} alt="User Logo" />
                  </div>
                </div>
                <div className="chat-bubble flex flex-col">
                  {reply.file && (
                    <img
                      src={reply.file?.url || reply.file}
                      alt="Reply"
                      className="sm:max-w-[200px] rounded-md mb-2"
                    />
                  )}
                  <p className="text-xl">
                    {reply.text || "No content available."}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ReplyInput msgId={selectedMsgId} place={currentPlace} />
        </>
      )}

      {/* Add Modal */}
      {showForm && view === "lnf" && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <LnFForm
            place={currentPlace}
            onClose={() => setShowForm(false)}
            onSuccess={() => getFoundMessages(currentPlace)}
          />
        </div>
      )}
    </div>
  );
};

export default FoundPg;
