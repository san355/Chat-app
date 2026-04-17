import React, { useEffect, useState } from "react";
import { loginAndGenerateUserSig } from "../services/userServices";
import {
  UIKitProvider,
  useLoginState,
  LoginStatus,
  ConversationList,
  Chat,
  ChatHeader,
  MessageList,
  MessageInput,
  ContactList,
  ContactInfo,
  Profile,
  Avatar,
  useConversationListState,
} from "@tencentcloud/chat-uikit-react";
import { IoCloseSharp, IoLogoWechat, IoPeople } from "react-icons/io5";
import { IoMdArrowRoundBack, IoMdLogOut } from "react-icons/io";

const ChatWindow = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [userSig, setUserSig] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState("list");
  const [showProfile, setShowProfile] = useState(false);

  const SDKAppID = process.env.REACT_APP_TRTC_APP_ID;
  const userID = localStorage.getItem("trtc_userID") || "";

  useEffect(() => {
    const fetchSig = async () => {
      try {
        const res = await loginAndGenerateUserSig(userID);
        if (res.success) setUserSig(res.user.userSig);
      } catch (error) {
        console.error("Sig error", error);
      } finally {
        setLoading(false);
      }
    };
    if (userID) {
      fetchSig();
    }
  }, [userID]);

  const handleLogout = () => {
    localStorage.removeItem("trtc_userID");
    window.location.href = "/login";
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <UIKitProvider theme="light" language="en-US">
      <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white relative">
        <nav className="w-20 bg-gray-900 hidden md:flex flex-col items-center py-6 text-white flex-shrink-0 justify-between z-30">
          <div className="w-full flex flex-col items-center gap-6">
            <div
              className="cursor-pointer hover:ring-2 ring-indigo-500 rounded-full transition-all"
              onClick={() => setShowProfile(true)}
            >
              <Avatar size={40} />
            </div>
            <div className="w-10 h-[1px] bg-gray-700"></div>

            <TabButtom
              active={activeTab === "chats"}
              onClick={() => {
                setActiveTab("chats");
                setMobileView("list");
              }}
              icon={<IoLogoWechat />}
              label="Chats"
            />

            <TabButtom
              active={activeTab === "contacts"}
              onClick={() => {
                setActiveTab("contacts");
                setMobileView("list");
              }}
              icon={<IoPeople />}
              label="Contacts"
            />
          </div>
          <TabButtom
            onClick={handleLogout}
            icon={<IoMdLogOut />}
            label="Logout"
          />
        </nav>

        <main className="flex-1 flex overflow-hidden bg-white relative h-full">
          {activeTab === "chats" && (
            <ChatView mobileView={mobileView} setMobileView={setMobileView} />
          )}

          {activeTab === "contacts" && (
            <>
              <div
                className={`${
                  mobileView === "list" ? "flex" : "hidden"
                } md:flex w-full md:w-80 border-r flex-col`}
              >
                <div className="h-16 flex items-center px-4 border-b bg-gray-50 flex-shrink-0 font-bold text-xl text-gray-800">
                  Contacts
                </div>
                <ContactList
                  onContactItemClick={() => setMobileView("detail")}
                />
              </div>
              <div className={`${mobileView === "detail" ? "flex" : "hidden"} md:flex flex-1`}>
                <ContactInfo
                  onSendMessage={() => {
                    setActiveTab("chats");
                    setMobileView("detail");
                  }}
                />
              </div>
            </>
          )}
        </main>

        {mobileView === "list" && (
          <nav className="md:hidden flex h-16 bg-gray-900   items-center justify-between text-white flex-shrink-0  z-30">
            <div
              className="scale-75 ml-2 cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              <Avatar size={40} />
            </div>

            <TabButtom
              active={activeTab === "chats"}
              onClick={() => {
                setActiveTab("chats");
                setMobileView("list");
              }}
              icon={<IoLogoWechat />}
              label="Chats"
            />

            <TabButtom
              active={activeTab === "contacts"}
              onClick={() => {
                setActiveTab("contacts");
                setMobileView("list");
              }}
              icon={<IoPeople />}
              label="Contacts"
            />
            <TabButtom
              onClick={handleLogout}
              icon={<IoMdLogOut />}
              label="Logout"
            />
          </nav>
        )}

        {showProfile && (
          <div className="absolute inset-0 z-[100] flex ">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowProfile(false)}
            ></div>
            <div className="relative w-72 md:w-80 h-full bg-white shadow-2xl flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <span className="font-bold">My Profile</span>
                <button
                  onClick={() => setShowProfile(false)}
                  className="text-gray-500 p-2 hover:text-gray-700 transition"
                >
                  <IoCloseSharp size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto ">
                <Profile />
              </div>
            </div>
          </div>
        )}

        <LoginHanlder SDKAPPID={SDKAppID} userID={userID} userSig={userSig} />
      </div>
    </UIKitProvider>
  );
};

function ChatView({ mobileView, setMobileView }) {
  const { activeConversation } = useConversationListState();

  useEffect(() => {
    if (activeConversation && window.innerWidth < 768) {
      setMobileView("detail");
    }
  }, [activeConversation, setMobileView]);

  return (
    <>
      <div
        className={`${
          mobileView === "list" ? "flex " : "hidden"
        } md:flex w-full md:w-80 lg:w-96 flex-col border-r bg-white`}
        style={{ height: "100%" }}
      >
        <div className="h-16 flex items-center px-4 border-b bg-gray-50 flex-shrink-0 font-bold text-xl">
          Messages
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          <ConversationList
            onConversationClick={() => setMobileView("detail")}
          />
        </div>
      </div>

      <div
        className={`${
          mobileView === "detail" ? "flex" : "hidden"
        }. md:flex flex-1 flex-col bg-white`}
        style={{
          height: "100%",
          position: mobileView === "detail" ? "absolute" : "relative",
          inset: mobileView === "detail" ? 0 : "auto",
          zIndex: mobileView === "detail" ? 50 : "auto",
          width: "100%",
        }}
      >
        <div className="md:hidden h-14 flex items-center px-4 border-b bg-white flex-shrink-0 z-10 ">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileView("list");
            }}
            className="text-indigo-600 font-bold flex  items-center gap-2"
          >
            <IoMdArrowRoundBack size={18} /> Back
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Chat>
            <ChatHeader
              onBack={() => {
                setMobileView("list");
              }}
            />
            <MessageList />
            <MessageInput />
          </Chat>
        </div>
      </div>
    </>
  );
}

//Healper function
function TabButtom({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-2 w-full transition-all ${
        active ? "text-indigo-400" : "text-gray-500"
      }`}
    >
      <span className="text-xl flex items-center justify-center">{icon}</span>
      <span className="text-[10px]  uppercase font-bold mt-1">{label}</span>
    </button>
  );
}

function LoginHanlder({ SDKAPPID, userID, userSig }) {
  const { status } = useLoginState({
    SDKAppID: parseInt(SDKAPPID),
    userID,
    userSig,
  });
  if (status === LoginStatus.ERROR)
    return (
      <div className="absolute inset-0 bg-white z-[100] flex items-center justify-center font-bold text-red-500">
        Sync Error. Please Refresh
      </div>
    );
}

function LoadingScreen() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-white font-medium text-indigo-600 tracking-widest">
      LOADING...
    </div>
  );
}

export default ChatWindow;
