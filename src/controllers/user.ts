export type UserId = string;

interface IUser {
  id: UserId;
  name: string;
  email: string;
  mobile: string;
  password: string;
  address: IAddress
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
    this.users = []
  }

  create(user: IUser) {
    const newUser = {
      ...user,
      id: (globalUserId++).toString(),
    }
    this.users.push(newUser)
    return newUser
  }

  update(user: IUser) {
    const id = this.users.findIndex(({ id }) => id === user.id)

    if (!id) {
      throw new Error("user not found")
    }

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
