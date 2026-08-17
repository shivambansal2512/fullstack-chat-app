import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-full flex">
      {/* Contact list. On phones it hides as soon as a chat is open. */}
      <div
        className={`${selectedUser ? "hidden md:block" : "block"} w-full md:w-80 shrink-0 h-full`}
      >
        <Sidebar />
      </div>

      {/* Chat panel. On phones it only appears once a chat is open. */}
      <div className={`${selectedUser ? "flex" : "hidden md:flex"} flex-1 min-w-0 h-full`}>
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default HomePage;
