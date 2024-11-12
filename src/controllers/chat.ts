import { IMember } from "./communities";
import { UserId } from "./user";

interface IChat {
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
    this.chats = new Map();
  }

  initChat(roomId: string) {
    this.chats.set(roomId, [])
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
