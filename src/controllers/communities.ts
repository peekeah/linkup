import chat from "./chat";

interface ICommunity {
  id: number;
  name: string;
  owner: IMember;
  admins: IMember[];
  members: IMember[];
  timeouts: ITimeout[];
}

export interface IMember {
  id: number;
  name: string;
  email: string;
}

interface ITimeout extends IMember {
  timeout: number;
  startTime: Date;
}

let globalCommunityId = 1;

class Community {
  private communities: ICommunity[]

  constructor() {
    this.communities = []
  }

  create(name: string, owner: IMember) {
    const id = globalCommunityId++;
    const newEntry = {
      id,
      name,
      owner,
      admins: [],
      members: [],
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

  delete(id: number) {
    this.communities = this.communities.filter(user => user.id !== id)
  }

  getCommunities() {
    return this.communities;
  }

  getCommunity(id: number) {
    const community = this.communities.find(el => el.id === id)

    if (!community) {
      throw new Error("entry not found")
    }
    return community;
  }
}

export default new Community();
