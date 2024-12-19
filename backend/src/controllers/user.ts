import { userMockData } from "../mock/user";
import { SupportedOutgoingUserMessages } from "../schema/user";
import { activeClients } from "../store/clients";
import { generateHash, verifyHash } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import communities from "./communities";

export type UserId = string;

export interface IUser {
  id: UserId;
  name: string;
  email: string;
  mobile: string;
  password: string;
  address: IAddress;
  chatHistory: ChatHistory[];
  // connection: WebSocket;
}

interface LastMessage {
  content: string;
  date: Date;
}

// #NOTE: Add for private message
export interface ChatHistory extends LastMessage {
  communityId: string;
  communityName: string;
}

interface IAddress {
  street: string;
  area: string;
  city: string;
  state: string;
  country: string;
}

let globalUserId = 1;

class User {
  private users: IUser[];

  constructor() {
    // Note: User mock data initialization
    this.users = userMockData;
  }

  async create(user: IUser) {
    const newUser = {
      ...user,
      password: await generateHash(user.password),
      id: (globalUserId++).toString(),
    }
    this.users.push(newUser)
    return newUser
  }

  async login(email: string, password: string) {
    try {

      const user = this.users.find(user => user.email === email)

      if (!user) {
        throw new Error("User does not exist")
      }

      const comparePassword = await verifyHash(password, user.password)

      if (!comparePassword) {
        throw new Error("Password is incorrect")
      }

      const userData = {
        userId: user.id,
        userName: user.name,
        email: user.email,
        token: generateToken({
          userId: user.id,
          email: user.email,
          userName: user.name,
        })
      }

      return userData
    } catch (err) {
      throw err
    }
  }

  update(user: IUser) {
    const id = this.users.findIndex(({ id }) => id === user.id)

    if (!id) {
      throw new Error("user not found")
    }

    // Todo: Prevent password update
    this.users[id] = user
  }

  delete(id: string) {
    this.users = this.users.filter(user => user.id !== id)
  }

  getUsers() {
    return this.users;
  }

  getUser(id: string) {
    const user = this.users.find(el => el.id === id)

    if (!user) {
      throw new Error("user not found")
    }

    const { chatHistory, password, ...userData } = user;

    return userData;

  }

  updateChatHistory(id: UserId, communityId: string, communityName: string, message: LastMessage) {

    let user = this.users.find(el => el.id === id)

    if (!user) {
      return null
    }

    user.chatHistory = user.chatHistory.filter(el => el.communityId !== communityId);

    const newMsg = {
      communityId,
      communityName,
      ...message,
    }

    user.chatHistory = [newMsg, ...user.chatHistory]

    const community = communities.getCommunity(communityId);

    // Broadcast recent chats to all clients
    community.member.forEach(member => {
      const conn = activeClients.get(member.userId)
      if (conn) {
        conn.send(JSON.stringify({
          type: SupportedOutgoingUserMessages.ChatHistory,
          data: user.chatHistory
        }))
      }
    });

  }

  searchUser(search: string) {
    return this.users.flatMap((user) => {
      user.name.toLowerCase().includes(search?.toLowerCase()) ? ({
        id: user.id,
        name: user.name,
        avatar: user.email
      }) : []
    })
  }

  getChatHistory(id: UserId) {
    const user = this.users.find(el => el.id === id)

    if (!user) {
      throw new Error("user not found")
    }

    return user.chatHistory;

  }
}

export default new User();
