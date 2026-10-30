import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  MessageSquare,
  Trash2,
  Search,
  RefreshCw,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Terminal,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import {
  getDevelopers,
  getDeveloperMessages,
  deleteDeveloper,
} from "../services/admin.api.js";

export default function Admin() {
  const [developers, setDevelopers] = useState([]);
  const [selectedDev, setSelectedDev] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingDevs, setLoadingDevs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalDev, setDeleteModalDev] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [messageFilter, setMessageFilter] = useState("all"); // 'all' or 'user'

  const fetchDevs = async () => {
    try {
      setLoadingDevs(true);
      const data = await getDevelopers();
      if (data.success) {
        setDevelopers(data.developers || []);
        // Auto-select first developer if none selected
        if (!selectedDev && data.developers?.length > 0) {
          handleSelectDev(data.developers[0]);
        }
      }
    } catch (err) {
      console.error(err);
      showStatus("error", err?.response?.data?.message || "Failed to fetch developers");
    } finally {
      setLoadingDevs(false);
    }
  };

  useEffect(() => {
    fetchDevs();
  }, []);

  const handleSelectDev = async (dev) => {
    setSelectedDev(dev);
    try {
      setLoadingMessages(true);
      const data = await getDeveloperMessages(dev._id);
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
      showStatus("error", "Failed to fetch developer messages");
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModalDev) return;
    try {
      setDeleting(true);
      const data = await deleteDeveloper(deleteModalDev._id);
      if (data.success) {
        setDevelopers((prev) => prev.filter((d) => d._id !== deleteModalDev._id));
        if (selectedDev?._id === deleteModalDev._id) {
          setSelectedDev(null);
          setMessages([]);
        }
        showStatus("success", `Developer ${deleteModalDev.username} deleted.`);
      }
    } catch (err) {
      console.error(err);
      showStatus("error", err?.response?.data?.message || "Failed to delete developer");
    } finally {
      setDeleting(false);
      setDeleteModalDev(null);
    }
  };

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredDevs = developers.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.username?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q)
    );
  });

  const displayedMessages = messages.filter((m) => {
    if (messageFilter === "user") return m.role === "user";
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#06080F] text-slate-100 relative overflow-hidden select-none">
      {/* Background cyber grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px] pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-gradient-to-b from-purple-950/20 via-indigo-950/15 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/[0.06]">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-mono mb-2">
              <Shield className="w-3 h-3 text-fuchsia-400" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span>Developer Fleet & Message Logs</span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Inspect developer emails, monitor real-time conversation queries, and manage database records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDevs}
              disabled={loadingDevs}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingDevs ? "animate-spin" : ""}`} />
              <span>Refresh Fleet</span>
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 rounded-xl border text-xs flex items-center justify-between ${
                statusMessage.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-300"
              }`}
            >
              <span>{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Grid: Left = Developer Fleet, Right = Messages */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Developer List (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-[#090D1C]/85 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-xl shadow-purple-950/20">
            {/* Search & Counter header */}
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#060814] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-2 rounded-lg border border-white/[0.08] outline-none focus:border-purple-500/40"
                />
              </div>
              <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 whitespace-nowrap">
                {filteredDevs.length} Devs
              </span>
            </div>

            {/* Developer List */}
            <div className="divide-y divide-white/[0.04] max-h-[640px] overflow-y-auto">
              {loadingDevs ? (
                <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
                  <span>Loading developers...</span>
                </div>
              ) : filteredDevs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No developers found matching query.
                </div>
              ) : (
                filteredDevs.map((dev) => {
                  const isSelected = selectedDev?._id === dev._id;
                  return (
                    <div
                      key={dev._id}
                      onClick={() => handleSelectDev(dev)}
                      className={`p-4 transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                        isSelected
                          ? "bg-purple-600/15 border-l-2 border-purple-400"
                          : "hover:bg-white/[0.02]"
                      }`}
                    >
                      {/* Avatar & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-[1.5px] shrink-0">
                          <div className="w-full h-full bg-[#0A0D1B] rounded-[10px] flex items-center justify-center font-bold text-xs text-purple-300">
                            {dev.username?.charAt(0).toUpperCase() || "D"}
                          </div>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-white truncate">
                              {dev.username}
                            </span>
                            {dev.verified ? (
                              <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                                Unverified
                              </span>
                            )}
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 truncate font-mono">
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{dev.email}</span>
                          </div>

                          {/* Message counts */}
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1.5">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-indigo-400" />
                              {dev.messagesCount || 0} messages
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-600" />
                              {new Date(dev.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action: Delete Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteModalDev(dev);
                          }}
                          title="Delete developer from database"
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isSelected
                              ? "text-purple-400 translate-x-0.5"
                              : "text-slate-600 group-hover:text-slate-400"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Selected Developer Message Stream (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#090D1C]/85 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-xl shadow-purple-950/20 flex flex-col min-h-[600px]">
            {selectedDev ? (
              <>
                {/* Developer Profile Header Banner */}
                <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-gradient-to-r from-purple-950/30 via-transparent to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-sm text-purple-300">
                      {selectedDev.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-white">
                          {selectedDev.username}
                        </h2>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25">
                          {selectedDev.role}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-purple-400" />
                        <span>{selectedDev.email}</span>
                      </p>
                    </div>
                  </div>

                  {/* Filter switches */}
                  <div className="flex items-center gap-1.5 bg-[#060814] p-1 rounded-xl border border-white/[0.06] self-start sm:self-auto">
                    <button
                      onClick={() => setMessageFilter("all")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        messageFilter === "all"
                          ? "bg-purple-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      All Logs ({messages.length})
                    </button>
                    <button
                      onClick={() => setMessageFilter("user")}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        messageFilter === "user"
                          ? "bg-purple-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Developer Only ({messages.filter((m) => m.role === "user").length})
                    </button>
                  </div>
                </div>

                {/* Message Log Body */}
                <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[580px] space-y-4">
                  {loadingMessages ? (
                    <div className="p-16 text-center text-xs text-slate-500 flex flex-col items-center gap-3">
                      <div className="w-7 h-7 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
                      <span>Retrieving messages from MongoDB...</span>
                    </div>
                  ) : displayedMessages.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 space-y-2">
                      <MessageSquare className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                      <p className="text-xs">No messages recorded for this developer yet.</p>
                      <p className="text-[11px] text-slate-600">
                        When {selectedDev.username} chats with agents, prompts will stream here.
                      </p>
                    </div>
                  ) : (
                    displayedMessages.map((msg) => {
                      const isUser = msg.role === "user";
                      return (
                        <div
                          key={msg._id}
                          className={`flex gap-3 text-xs leading-relaxed ${
                            isUser ? "items-start" : "items-start"
                          }`}
                        >
                          {/* Role Icon */}
                          <div
                            className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                              isUser
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                            }`}
                          >
                            {isUser ? (
                              <User className="w-3.5 h-3.5" />
                            ) : (
                              <Bot className="w-3.5 h-3.5" />
                            )}
                          </div>

                          {/* Bubble */}
                          <div
                            className={`flex-1 p-3.5 rounded-xl border ${
                              isUser
                                ? "bg-[#0E1326] border-purple-500/20 text-slate-200"
                                : "bg-[#070A16] border-white/[0.06] text-slate-300"
                            }`}
                          >
                            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/[0.05]">
                              <span className="font-semibold text-[11px] text-slate-400">
                                {isUser ? selectedDev.username : "Cosmos Agent"}
                              </span>
                              <span className="text-[10px] font-mono text-slate-600 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <p className="whitespace-pre-wrap break-words leading-relaxed">
                              {msg.content}
                            </p>

                            {msg.chat?.title && (
                              <div className="mt-2 text-[10px] text-slate-500 font-mono">
                                Chat: {msg.chat.title}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              /* No selection state */
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500">
                <Users className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-medium text-slate-300">
                  No Developer Selected
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Click on any developer from the fleet list on the left to inspect
                  their profile and messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Developer Confirmation Modal */}
      <AnimatePresence>
        {deleteModalDev && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-[#0B0E1E] border border-rose-500/30 p-6 shadow-2xl space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">
                  Delete Developer: {deleteModalDev.username}?
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <strong className="text-white">{deleteModalDev.email}</strong>?
                  This action is permanent and will cascade delete all their chats and message history from the database.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModalDev(null)}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/40 transition-colors flex items-center gap-1.5"
                >
                  {deleting ? (
                    <span>Deleting...</span>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Developer</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
