import { IChat } from "../controllers/chat";

export const chatMockData: Map<string, IChat[]> = new Map([
  [
    "community1",
    [
      {
        id: "chat1",
        content: "Hello, everyone!",
        sender: { userId: "user1", name: "Alice Johnson" },
        upvotes: ["user2", "user3"],
        date: new Date("2024-12-01T09:30:00"),
        isDeleted: false,
      },
      {
        id: "chat2",
        content: "Welcome, Alice! Looking forward to your insights.",
        sender: { userId: "user2", name: "Bob Smith" },
        upvotes: ["user1", "user7"],
        date: new Date("2024-12-01T10:00:00"),
        isDeleted: false,
      },
      {
        id: "chat3",
        content: "Great topic, Alice! Let’s discuss.",
        sender: { userId: "user3", name: "Charlie Brown" },
        upvotes: ["user1", "user8"],
        date: new Date("2024-12-01T11:00:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community2",
    [
      {
        id: "chat4",
        content: "Does anyone want to team up for the new RPG?",
        sender: { userId: "user6", name: "Frank Ocean" },
        upvotes: ["user4", "user5"],
        date: new Date("2024-12-02T18:45:00"),
        isDeleted: false,
      },
      {
        id: "chat5",
        content: "Does anyone have recommendations for sci-fi movies?",
        sender: { userId: "user2", name: "Bob Smith" },
        upvotes: ["user4", "user9"],
        date: new Date("2024-12-03T12:00:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community3",
    [
      {
        id: "chat6",
        content: "I’d love to recommend my favorite book on tech history.",
        sender: { userId: "user1", name: "Alice Johnson" },
        upvotes: ["user3", "user5"],
        date: new Date("2024-12-02T14:30:00"),
        isDeleted: false,
      },
      {
        id: "chat7",
        content: "I second Alice's recommendation. A great read!",
        sender: { userId: "user3", name: "Charlie Brown" },
        upvotes: ["user1", "user7"],
        date: new Date("2024-12-02T15:00:00"),
        isDeleted: false,
      },
      {
        id: "chat8",
        content: "Looking forward to the next book club meeting!",
        sender: { userId: "user7", name: "Grace Hopper" },
        upvotes: ["user8", "user1"],
        date: new Date("2024-12-02T16:00:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community4",
    [
      {
        id: "chat9",
        content: "Anyone tried the new seafood recipes?",
        sender: { userId: "user10", name: "Jack Sparrow" },
        upvotes: ["user5", "user9"],
        date: new Date("2024-12-03T10:00:00"),
        isDeleted: false,
      },
      {
        id: "chat10",
        content: "Planning a trip to Japan next spring!",
        sender: { userId: "user10", name: "Jack Sparrow" },
        upvotes: ["user6", "user2"],
        date: new Date("2024-12-04T09:00:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community5",
    [
      {
        id: "chat11",
        content: "Love your enthusiasm, Alice.",
        sender: { userId: "user6", name: "Frank Ocean" },
        upvotes: ["user1", "user5"],
        date: new Date("2024-12-01T15:15:00"),
        isDeleted: false,
      },
      {
        id: "chat12",
        content: "Does anyone have tips for sustainable living?",
        sender: { userId: "user5", name: "Eve Summers" },
        upvotes: ["user6", "user9"],
        date: new Date("2024-12-02T17:30:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community6",
    [
      {
        id: "chat13",
        content: "This topic is fascinating! Let’s dive deeper.",
        sender: { userId: "user1", name: "Alice Johnson" },
        upvotes: ["user5", "user8"],
        date: new Date("2024-12-01T15:00:00"),
        isDeleted: false,
      },
      {
        id: "chat14",
        content: "Loving the new art styles being discussed here.",
        sender: { userId: "user5", name: "Eve Summers" },
        upvotes: ["user1", "user6"],
        date: new Date("2024-12-01T16:00:00"),
        isDeleted: false,
      },
      {
        id: "chat15",
        content: "That’s a great suggestion, Alice.",
        sender: { userId: "user8", name: "Hank Pym" },
        upvotes: ["user1", "user5"],
        date: new Date("2024-12-01T15:45:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community7",
    [
      {
        id: "chat16",
        content: "I just watched a fantastic documentary on AI!",
        sender: { userId: "user4", name: "Daisy Miller" },
        upvotes: ["user2", "user9"],
        date: new Date("2024-12-03T13:30:00"),
        isDeleted: false,
      },
      {
        id: "chat17",
        content: "Any recommendations for horror movies?",
        sender: { userId: "user9", name: "Ivy Woods" },
        upvotes: ["user4", "user2"],
        date: new Date("2024-12-03T14:00:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community8",
    [
      {
        id: "chat18",
        content: "What’s everyone working on these days?",
        sender: { userId: "user1", name: "Alice Johnson" },
        upvotes: ["user7", "user9"],
        date: new Date("2024-12-02T10:45:00"),
        isDeleted: false,
      },
      {
        id: "chat19",
        content: "Great question, Alice. I’m building a web app.",
        sender: { userId: "user7", name: "Grace Hopper" },
        upvotes: ["user1", "user8"],
        date: new Date("2024-12-02T11:00:00"),
        isDeleted: false,
      },
      {
        id: "chat20",
        content: "Excited to see the new projects here!",
        sender: { userId: "user8", name: "Hank Pym" },
        upvotes: ["user1", "user7"],
        date: new Date("2024-12-02T12:30:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community9",
    [
      {
        id: "chat21",
        content: "Looking forward to the next cooking challenge!",
        sender: { userId: "user9", name: "Ivy Woods" },
        upvotes: ["user10", "user5"],
        date: new Date("2024-12-03T09:15:00"),
        isDeleted: false,
      },
    ],
  ],
  [
    "community10",
    [
      {
        id: "chat22",
        content: "Anyone tried the new vegan recipes trending online?",
        sender: { userId: "user1", name: "Alice Johnson" },
        upvotes: ["user8", "user10"],
        date: new Date("2024-12-03T08:15:00"),
        isDeleted: false,
      },
      {
        id: "chat23",
        content: "Looking forward to trying out new recipes.",
        sender: { userId: "user3", name: "Charlie Brown" },
        upvotes: ["user5", "user10"],
        date: new Date("2024-12-03T09:00:00"),
        isDeleted: false,
      },
      {
        id: "chat24",
        content: "I’ve tried some recipes recently, Alice!",
        sender: { userId: "user5", name: "Eve Summers" },
        upvotes: ["user1", "user3"],
        date: new Date("2024-12-03T08:30:00"),
        isDeleted: false,
      },
      {
        id: "chat25",
        content: "Anyone tried the new seafood recipes?",
        sender: { userId: "user10", name: "Jack Sparrow" },
        upvotes: ["user5", "user9"],
        date: new Date("2024-12-03T10:00:00"),
        isDeleted: false,
      },
    ],
  ],
]);
