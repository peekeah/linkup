import { userMockData } from "../mock/user";
import { generateHash, verifyHash } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

export type UserId = string;

export interface IUser {
  id: UserId;
  name: string;
  email: string;
  mobile: string;
  password: string;
  address: IAddress;
  // connection: WebSocket;
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

      return generateToken({
        userId: user.id,
        email: user.email,
        userName: user.name
      })
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

    return user;

  }
}

export default new User();
