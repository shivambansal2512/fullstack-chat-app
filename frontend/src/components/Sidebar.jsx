import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import Avatar from "./Avatar";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Two simple filters: the All/Online tabs, then the search box.
  const filteredUsers = users
    .filter((user) => (showOnlineOnly ? onlineUsers.includes(user._id) : true))
    .filter((user) => user.fullName.toLowerCase().includes(search.toLowerCase()));

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full flex flex-col bg-base-100 border-r border-base-300">
      {/* Header */}
      <div className="p-4 space-y-3 border-b border-base-300">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          <span className="text-xs text-base-content/50">
            {Math.max(onlineUsers.length - 1, 0)} online
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-base-200 border border-base-300 text-sm
              placeholder:text-base-content/40 focus:outline-none focus:border-primary/60"
          />
        </div>

        {/* All / Online tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-base-200">
          {[
            { label: "All", value: false },
            { label: "Online", value: true },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setShowOnlineOnly(tab.value)}
              className={`flex-1 py-1.5 text-sm rounded-lg transition-colors ${
                showOnlineOnly === tab.value
                  ? "bg-base-100 text-base-content shadow-sm"
                  : "text-base-content/50 hover:text-base-content"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filteredUsers.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-2.5 rounded-xl flex items-center gap-3 text-left transition-colors ${
                isSelected ? "bg-primary/15" : "hover:bg-base-300/60"
              }`}
            >
              <div className="relative shrink-0">
                <Avatar user={user} className="size-11 text-sm" />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-base-100" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-medium ${isSelected ? "text-primary" : ""}`}
                >
                  {user.fullName}
                </p>
                <p className="truncate text-xs text-base-content/45">
                  {isOnline ? "Active now" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <p className="text-center text-sm text-base-content/40 py-8">No contacts found</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
