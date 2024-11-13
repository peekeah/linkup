import { chatMockData } from "../mock/chat";
import { IMember } from "./communities";
import { UserId } from "./user";

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

  getChats(roomId: string, limit: number | undefined, offset: number | undefined) {
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

    chat.push({
      id: (globalChatId++).toString(),
      content,
      sender,
      upvotes: [],
      date: new Date(),
      isDeleted: false
    })

    this.chats.set(roomId, chat)

  }

  deleteChat(roomId: string, chatId: string) {
    const chat = this.chats.get(roomId)

    if (!chat) throw new Error("Chat not found")

    let messageId = chat.findIndex(({ id }) => id === chatId)

    if (!messageId) throw new Error("Message not found")

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

    if (!messageId) throw new Error("Message not found")

    const message = chat[messageId];
    message.upvotes.push(userId)
    chat[messageId] = message;

    this.chats.set(roomId, chat)
  }

  downvote(userId: UserId, roomId: string, chatId: string) {
    const chat = this.chats.get(roomId)

    if (!chat) throw new Error("Chat not found")

    let messageId = chat.findIndex(({ id }) => id === chatId)

    if (!messageId) throw new Error("Message not found")

    let message = chat[messageId];
    message.upvotes = message.upvotes.filter(id => id !== userId)
    chat[messageId] = message;

    this.chats.set(roomId, chat)
  }

}

export default new Chat();
