import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAndGenerateUserSig } from "../services/userServices";

const Login = () => {
  const navigate = useNavigate();
  const [userID, setUserID] = useState("");
  const [nickName, setNickName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedInUserID = localStorage.getItem("trtc_userID");
    if (loggedInUserID) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handeLogin = async (e) => {
    e.preventDefault();

    if (!userID.trim()) {
      setError("please enter userId");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await loginAndGenerateUserSig(userID, nickName);
      if (response.success) {
        localStorage.setItem("trtc_userID", userID);
        navigate("/");
      }
    } catch (error) {
      setError(error.message || "login failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Chat
            <p className="text-gray-500">Login to start messaging</p>
          </h1>
        </div>
        {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
                </div>
        )}

        <form onSubmit={handeLogin} className="space-y-5">
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">
                UserId (Unique Id)
               </label>
               <input
                type="text"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                placeholder="e.g dheeraj_123"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none  transition-all"
                required
               />
            </div>

                        <div>
               <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your Name (Optional)
               </label>
               <input
                type="text"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                placeholder="e.g Dheeraj"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none  transition-all"
               />
            </div>


            <button
             type="submit"
             disabled={loading}
             className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:bg-indigo-300"
            >
                {loading ? 'Processing...': 'Start Chatting'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
