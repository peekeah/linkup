class Api {
  private url: string;
  constructor() {
    this.url = process.env.SERVER_HOST | "localhost";

  }
}

export default Api;
