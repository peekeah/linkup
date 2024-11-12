import chat from "./chat";
import { UserId } from "./user";

interface ICommunity {
  id: string;
  name: string;
  owner: IMember;
  admins: IMember[];
  member: IMember[];
  timeouts: ITimeout[];
}

export interface IMember {
  userId: UserId,
  name: string;
}

/*
interface ITimeout extends IMember {
  timeout: number;
  startTime: Date;
}
*/

interface ITimeout {
  userId: UserId,
  timeout: number
}

let globalCommunityId = 1;

class Community {
  private communities: ICommunity[]

  constructor() {
    this.communities = []
  }

  create(name: string, owner: IMember) {
    // const id = (globalCommunityId++).toString();
    const id = globalCommunityId++;
    const newEntry = {
      id: id.toString(),
      name,
      owner,
      admins: [],
      member: [],
      timeouts: [],
    }

    this.communities.push(newEntry)
    chat.initChat(id.toString())

    return newEntry
  }

  update(community: ICommunity) {
    const id = this.communities.findIndex(({ id }) => id === community.id)

    if (!id) {
      throw new Error("Entry not found")
    }

    this.communities[id] = community
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

    if (!id) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx].member.findIndex(user => user.userId === userId)

    if (existUser) throw new Error("user already joined");

    this.communities[idx].member.push({ userId, name: userName })
  }

  leaveCommunity(id: string, userId: UserId) {

    const idx = this.communities.findIndex((community) => id === community.id)

    if (!id) {
      throw new Error("Community not found")
    }

    const existUser = this.communities[idx].member.findIndex(user => user.userId === userId)

    if (!existUser) throw new Error("user does not exist");

    this.communities[idx].member = this.communities[idx].member.filter(user => user.userId !== userId)

  }

  // Todo: Add authorization
  giveTimeout(id: string, userId: UserId, timeout: number) {
    const community = this.communities.find((community) => id === community.id)

    if (!community) throw new Error("Community not found")

    community.timeouts.push({
      userId,
      timeout
    })

    const idx = this.communities.findIndex(el => el.id === id)

    this.communities[idx] = community

  }

  clearTimeout(id: string, userId: UserId) {
    let community = this.communities.find((community) => id === community.id)

    if (!community) throw new Error("Community not found")

    community.timeouts = community.timeouts.filter(el => el.userId !== userId)
    const idx = this.communities.findIndex(el => el.id === id)

    this.communities[idx] = community
  }

}

export default new Community();
