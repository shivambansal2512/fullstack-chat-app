import { NavLink } from "react-router-dom";
import { LogOut, MessagesSquare, Settings, User } from "lucide-react";

import Avatar from "./Avatar";
import { useAuthStore } from "../store/useAuthStore";

const NAV_ITEMS = [
  { to: "/", icon: MessagesSquare, label: "Chats" },
  { to: "/profile", icon: User, label: "Profile" },
  { to: "/settings", icon: Settings, label: "Appearance" },
];

const Rail = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <nav className="w-16 shrink-0 h-full bg-base-200 border-r border-base-300 flex flex-col items-center py-4 gap-2">
      {/* Logo */}
      <div className="size-10 rounded-xl bg-primary flex items-center justify-center mb-3 shadow-lg shadow-primary/20">
        <MessagesSquare className="size-5 text-primary-content" />
      </div>

      {/* Nav icons. NavLink gives us `isActive` for free. */}
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          title={item.label}
          className={({ isActive }) => `
            size-10 rounded-xl flex items-center justify-center transition-colors
            ${isActive ? "bg-primary/15 text-primary" : "text-base-content/50 hover:bg-base-300 hover:text-base-content"}
          `}
        >
          <item.icon className="size-5" />
        </NavLink>
      ))}

      {/* Pushes everything below to the bottom */}
      <div className="flex-1" />

      <div className="rounded-full ring-2 ring-base-300">
        <Avatar user={authUser} className="size-9 text-xs" />
      </div>

      <button
        onClick={logout}
        title="Logout"
        className="size-10 rounded-xl flex items-center justify-center text-base-content/50 hover:bg-error/15 hover:text-error transition-colors"
      >
        <LogOut className="size-5" />
      </button>
    </nav>
  );
};

export default Rail;
