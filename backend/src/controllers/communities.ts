import { communitiesMockData } from "../mock/communities";
import { OutgoingCommunityMessages, SupportedCommunityMessages } from "../schema/community";
import { activeClients } from "../store/clients";
import chat from "./chat";
import { UserId } from "./user";

export interface ICommunity {
  id: string;
  name: string;
  owner: IMember;
  admin: IMember[];
  member: IMember[];
  timeouts: ITimeout[];
}

export interface IUpdateCommunity {
  id: string;
  name: string;
}

export interface IMember {
  userId: UserId,
  name: string;
}

interface ITimeout {
  userId: UserId,
  timeout: number
}

let globalCommunityId = 1;

class Community {
  private communities: ICommunity[]

  constructor() {
    // Note: Mock data initializaton
    this.communities = communitiesMockData;
  }

  create(name: string, owner: IMember) {
    const id = (globalCommunityId++).toString();

    const newEntry = {
      id,
      name,
      owner,
      admin: [],
      member: [],
      timeouts: [],
    }

    this.communities.push(newEntry)
    chat.initChat(id)

    return newEntry
  }

  update(payload: IUpdateCommunity) {
    const id = this.communities.findIndex(({ id }) => id === payload.id)

    if (!id) {
      throw new Error("Community not found")
    }

    let community = this.communities[id];

    this.communities[id] = {
      ...community,
      name: payload.name
    }
  }

  delete(id: string) {
    this.communities = this.communities.filter(user => user.id !== id)
  }

  getCommunities() {
    return this.communities;
  }

  getCommunity(id: string) {
    const community = this.communities.find(el => el.id === id)

    if (!community) {
      throw new Error("entry not found")
    }
    return community;
  }

  joinCommunity(id: string, userId: UserId, userName: string) {

    const idx = this.communities.findIndex((community) => id === community.id)

    if (idx === -1) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx]?.member?.find(user => user.userId === userId)

    if (existUser) throw new Error("user already joined");

    this.communities[idx].member.push({ userId, name: userName })
  }

  leaveCommunity(id: string, userId: UserId) {

    const idx = this.communities.findIndex((community) => id === community.id)

    if (idx === -1) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx].member.find(user => user.userId === userId)

    if (!existUser) throw new Error("User is not member of community");

    this.communities[idx].member = this.communities[idx].member.filter(user => user.userId !== userId)

  }

  addAdmin(id: string, userId: UserId, userName: string) {
    const idx = this.communities.findIndex(community => community.id === id);

    if (idx === -1) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx].member.find(user => user.userId === userId)

    if (!existUser) throw new Error("User is not member of community");

    const existAdmin = this.communities[idx].admin.find(user => user.userId === userId)

    if (existAdmin) throw new Error("Already admin")

    this.communities[idx].admin.push({ userId, name: userName })

  }

  removeAdmin(id: string, userId: UserId) {
    const idx = this.communities.findIndex(community => community.id === id);

    if (idx === -1) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx].member.find(user => user.userId === userId)

    if (!existUser) throw new Error("User is not member of community");

    const existAdmin = this.communities[idx].admin.find(user => user.userId === userId)

    if (!existAdmin) throw new Error("User is not an admin")

    this.communities[idx].admin = this.communities[idx].admin.filter(user => user.userId !== userId)

  }

  // Todo: Add authorization
  giveTimeout(id: string, userId: UserId, timeout: number) {

    const idx = this.communities.findIndex(community => community.id === id);

    if (idx === -1) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx].member.find(user => user.userId === userId)

    if (!existUser) throw new Error("User is not member of community");

    this.communities[idx].timeouts.push({
      userId,
      timeout
    })

  }

  clearTimeout(id: string, userId: UserId) {

    const idx = this.communities.findIndex(community => community.id === id);

    if (idx === -1) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx].member.find(user => user.userId === userId)

    if (!existUser) throw new Error("User is not member of community");

    this.communities[idx].timeouts = this.communities[idx].timeouts.filter(el => el.userId !== userId)
  }

  broadcastMessage(roomId: string) {
    const community = this.communities.find(el => el.id === roomId);

    if (!community) throw new Error("Community not found")

    const messages = chat.getChats(roomId)

    community.member.forEach(member => {
      const conn = activeClients.get(member.userId)
      const response: OutgoingCommunityMessages = {
        type: SupportedCommunityMessages.BrodcastMessages,
        data: {
          roomId: roomId,
          messages: messages
        }
      }
      if (conn) {
        conn.send(JSON.stringify(response))
      }
    });
  }

  broadcastUpvotes(roomId: string, messageId: string) {
    const community = this.communities.find(el => el.id === roomId);

    if (!community) throw new Error("Community not found")

    const messages = chat.getChats(roomId)

    const message = messages.find(el => el.id === messageId)

    if (!message) {
      throw new Error("Message not found")
    }

    community.member.forEach(member => {
      const conn = activeClients.get(member.userId)
      if (conn) {
        const response: OutgoingCommunityMessages = {
          type: SupportedCommunityMessages.BroadcastUpvote,
          data: {
            roomId,
            messageId,
            message
          }
        }
        conn.send(JSON.stringify(response))
      }
    });
  }

}

export default new Community();
