import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { emitToUser } from "../lib/socket.js";
import { isCloudinaryConfigured, uploadImage } from "../lib/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesRead = async (req, res) => {
  try {
    const { id: senderId } = req.params;
    const receiverId = req.user._id;

    await Message.updateMany(
      { senderId, receiverId, read: false },
      { read: true }
    );

    emitToUser(senderId, "messagesRead", { by: String(receiverId) });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in markMessagesRead:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text?.trim() && !image) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    // Upload to Cloudinary and keep only the URL, so the message document
    // stays small no matter how big the photo was.
    let imageUrl;
    if (image) {
      if (!isCloudinaryConfigured) {
        return res
          .status(503)
          .json({ message: "Image uploads are not configured on the server" });
      }

      try {
        imageUrl = await uploadImage(image, "chatty/messages");
      } catch (error) {
        console.log("Cloudinary upload failed:", error.message);
        return res.status(502).json({ message: "Could not upload image, please try again" });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    emitToUser(receiverId, "newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
