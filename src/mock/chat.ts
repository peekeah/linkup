import { IChat } from "../controllers/chat";

export const chatMockData: Map<string, IChat[]> =
  new Map([
    [
      "community1",
      [
        {
          id: "c001",
          content: "Hello everyone! Excited to be here.",
          sender: { userId: "u001", name: "Alice" },
          upvotes: ["u002", "u003"],
          date: new Date("2024-10-20T10:15:00"),
          isDeleted: false
        },
        {
          id: "c002",
          content: "Welcome, Alice! Looking forward to great discussions.",
          sender: { userId: "u002", name: "Bob" },
          upvotes: ["u001"],
          date: new Date("2024-10-20T10:17:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "community2",
      [
        {
          id: "c003",
          content: "Does anyone have tips on learning TypeScript?",
          sender: { userId: "u003", name: "Charlie" },
          upvotes: ["u001", "u002", "u004"],
          date: new Date("2024-10-21T14:30:00"),
          isDeleted: false
        },
        {
          id: "c004",
          content: "Here’s a great TypeScript guide: [link]",
          sender: { userId: "u004", name: "Dave" },
          upvotes: ["u003"],
          date: new Date("2024-10-21T14:45:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "community3",
      [
        {
          id: "c005",
          content: "This message was removed.",
          sender: { userId: "u005", name: "Eve" },
          upvotes: [],
          date: new Date("2024-10-22T09:00:00"),
          isDeleted: true
        },
        {
          id: "c006",
          content: "How do you handle async in JavaScript?",
          sender: { userId: "u006", name: "Frank" },
          upvotes: ["u001", "u004", "u005"],
          date: new Date("2024-10-23T11:20:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "community4",
      [
        {
          id: "c007",
          content: "Using Promises and async/await really helped me.",
          sender: { userId: "u001", name: "Alice" },
          upvotes: ["u003", "u005", "u006"],
          date: new Date("2024-10-23T11:30:00"),
          isDeleted: false
        },
        {
          id: "c008",
          content: "Just started a new project! Will share updates soon.",
          sender: { userId: "u007", name: "Grace" },
          upvotes: ["u002", "u003"],
          date: new Date("2024-10-24T08:00:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "community5",
      [
        {
          id: "c009",
          content: "Looking forward to seeing your project, Grace!",
          sender: { userId: "u002", name: "Bob" },
          upvotes: ["u001", "u007"],
          date: new Date("2024-10-24T08:10:00"),
          isDeleted: false
        },
        {
          id: "c010",
          content: "I found a cool tool for debugging. Anyone interested?",
          sender: { userId: "u008", name: "Hannah" },
          upvotes: ["u001", "u002", "u003", "u004"],
          date: new Date("2024-10-25T16:00:00"),
          isDeleted: false
        }
      ]
    ]
  ]);
