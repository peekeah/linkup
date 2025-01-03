import { UserType } from "../middlewares/auth";
import { chatMockData } from "../mock/chat";
import communities, { IMember } from "./communities";
import user, { UserId } from "./user";

export interface IChat {
  id: string;
  content: string;
  sender: IMember;
  upvotes: UserId[],
  date: Date;
  isDeleted: boolean;
}

let globalChatId = 1;

class Chat {
  private chats: Map<string, IChat[]>;

  constructor() {
    // Note: Chat mock data initialization
    // this.chats = new Map();
    this.chats = chatMockData;
  }

  initChat(roomId: string) {
    this.chats.set(roomId, [])
  }

  getChats(roomId: string, limit?: number | undefined, offset?: number | undefined) {
    const existCommunity = this.chats.has(roomId)

    if (!existCommunity) throw new Error("Community not found")

    const chat = this.chats.get(roomId)

    if (!chat) {
      throw new Error("Chat not found")
    }

    return limit && offset
      ? chat.slice(-1 * limit, -1 * offset)
      : chat.slice();
  }


  addChat(roomId: string, content: string, sender: IMember) {
    const chat = this.chats.get(roomId)

    if (!chat) {
      throw new Error("Chat not found")
    }

    const id = (globalChatId++).toString();
    const date = new Date();
    chat.push({
      id,
      content,
      sender,
      upvotes: [],
      date,
      isDeleted: false
    })

    // Update last message in user state
    const community = communities.getCommunity(roomId);
    user.updateChatHistory(sender.userId, roomId, community.name, { content, date })
    this.chats.set(roomId, chat)
  }

  updateChat(roomId: string, chatId: string, content: string, userId: UserId, userType: UserType) {
    const chat = this.chats.get(roomId);
    if (!chat) {
      throw new Error("Chat not found")
    }

    let messageId = chat.findIndex(({ id }) => id === chatId);

    if (messageId === -1) {
      throw new Error("message not found")
    }

    if (userType === "user" && userId !== chat[messageId].sender.userId) {
      throw new Error("Unauthorized access")
    }

    chat[messageId] = {
      ...chat[messageId],
      content
    }
  }

  deleteChat(roomId: string, chatId: string, userId: UserId, userType: UserType) {

    const chat = this.chats.get(roomId)

    if (!chat) throw new Error("Chat not found")

    let messageId = chat.findIndex(({ id }) => id === chatId)

    if (messageId === -1) throw new Error("Message not found")

    if (userType === "user" && userId !== chat[messageId].sender.userId) {
      throw new Error("Unauthorized access")
    }

    chat[messageId] = {
      ...chat[messageId],
      content: "",
      isDeleted: true
    }
  }

  upvote(userId: string, roomId: string, chatId: string) {
    const chat = this.chats.get(roomId)

    if (!chat) throw new Error("Chat not found")

    let messageId = chat.findIndex(({ id }) => id === chatId)

    if (messageId === -1) throw new Error("Message not found")

    const message = chat[messageId];

    const existUpvote = message.upvotes.includes(userId)

    if (!existUpvote) {
      message.upvotes.push(userId)
    } else {
      message.upvotes = message.upvotes.filter(el => el !== userId)
    }
    chat[messageId] = message;
    this.chats.set(roomId, chat)
  }
}

export default new Chat();
