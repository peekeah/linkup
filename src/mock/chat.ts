import { IChat } from "../controllers/chat";

export const chatMockData: Map<string, IChat[]> =
  new Map([
    [
      "1", [
        {
          id: "c001",
          content: "Hello everyone! Excited to be here, fellow tech enthusiasts.",
          sender: { userId: "u001", name: "Alice" },
          upvotes: ["u002", "u003"],
          date: new Date("2024-10-20T10:15:00"),
          isDeleted: false
        },
        {
          id: "c002",
          content: "Welcome, Alice! Looking forward to discussing the latest in tech.",
          sender: { userId: "u002", name: "Bob" },
          upvotes: ["u001"],
          date: new Date("2024-10-20T10:17:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "2", [
        {
          id: "c003",
          content: "Does anyone have recommendations for great art exhibitions around the world?",
          sender: { userId: "u003", name: "Charlie" },
          upvotes: ["u001", "u002", "u004"],
          date: new Date("2024-10-21T14:30:00"),
          isDeleted: false
        },
        {
          id: "c004",
          content: "Check out the Louvre and the Tate Modern—both are iconic!",
          sender: { userId: "u004", name: "Dave" },
          upvotes: ["u003"],
          date: new Date("2024-10-21T14:45:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "3", [
        {
          id: "c005",
          content: "Has anyone read any great books recently? I need new reading material.",
          sender: { userId: "u005", name: "Eve" },
          upvotes: [],
          date: new Date("2024-10-22T09:00:00"),
          isDeleted: true
        },
        {
          id: "c006",
          content: "I just finished a brilliant novel! Would highly recommend 'The Silent Patient'.",
          sender: { userId: "u006", name: "Frank" },
          upvotes: ["u001", "u004", "u005"],
          date: new Date("2024-10-23T11:20:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "4", [
        {
          id: "c007",
          content: "I'm trying a new fitness routine this week—any advice from fellow fitness freaks?",
          sender: { userId: "u001", name: "Alice" },
          upvotes: ["u003", "u005", "u006"],
          date: new Date("2024-10-23T11:30:00"),
          isDeleted: false
        },
        {
          id: "c008",
          content: "Staying consistent is key! I can share my workout schedule if you're interested.",
          sender: { userId: "u007", name: "Grace" },
          upvotes: ["u002", "u003"],
          date: new Date("2024-10-24T08:00:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "5", [
        {
          id: "c009",
          content: "Who’s up for some gaming this weekend? Let’s team up for a match!",
          sender: { userId: "u002", name: "Bob" },
          upvotes: ["u001", "u007"],
          date: new Date("2024-10-24T08:10:00"),
          isDeleted: false
        },
        {
          id: "c010",
          content: "I’m in! Also found a cool tool for analyzing game stats, interested?",
          sender: { userId: "u008", name: "Hannah" },
          upvotes: ["u001", "u002", "u003", "u004"],
          date: new Date("2024-10-25T16:00:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "6", [
        {
          id: "c011",
          content: "What’s everyone’s favorite genre of music? I’m always looking for new tracks!",
          sender: { userId: "u019", name: "Sam" },
          upvotes: ["u020"],
          date: new Date("2024-10-25T10:00:00"),
          isDeleted: false
        },
        {
          id: "c012",
          content: "I’m really into indie rock lately. Here’s a playlist I love!",
          sender: { userId: "u020", name: "Tina" },
          upvotes: ["u019"],
          date: new Date("2024-10-25T10:20:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "7", [
        {
          id: "c013",
          content: "Just upgraded my camera! Any tips from fellow photographers on shooting in low light?",
          sender: { userId: "u022", name: "Vince" },
          upvotes: ["u023"],
          date: new Date("2024-10-26T08:00:00"),
          isDeleted: false
        },
        {
          id: "c014",
          content: "Make sure to adjust the ISO and shutter speed for better low-light shots!",
          sender: { userId: "u023", name: "Wanda" },
          upvotes: ["u022"],
          date: new Date("2024-10-26T08:30:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "8", [
        {
          id: "c015",
          content: "Where would you recommend traveling this summer? I’m dreaming of a European getaway.",
          sender: { userId: "u024", name: "Xander" },
          upvotes: ["u025"],
          date: new Date("2024-10-27T14:00:00"),
          isDeleted: false
        },
        {
          id: "c016",
          content: "Definitely visit Paris and Rome! You won’t regret it.",
          sender: { userId: "u025", name: "Yara" },
          upvotes: ["u024"],
          date: new Date("2024-10-27T14:15:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "9", [
        {
          id: "c017",
          content: "Just discovered an amazing new restaurant. Their pasta is divine!",
          sender: { userId: "u027", name: "Amy" },
          upvotes: ["u028"],
          date: new Date("2024-10-28T12:00:00"),
          isDeleted: false
        },
        {
          id: "c018",
          content: "That sounds amazing! What’s the name of the place?",
          sender: { userId: "u028", name: "Brian" },
          upvotes: ["u027"],
          date: new Date("2024-10-28T12:15:00"),
          isDeleted: false
        }
      ]
    ],
    [
      "10", [
        {
          id: "c019",
          content: "Planning a hiking trip this weekend! Any tips for beginners?",
          sender: { userId: "u030", name: "Dean" },
          upvotes: ["u031"],
          date: new Date("2024-10-29T09:00:00"),
          isDeleted: false
        },
        {
          id: "c020",
          content: "Make sure to stay hydrated and wear comfortable shoes!",
          sender: { userId: "u031", name: "Ella" },
          upvotes: ["u030"],
          date: new Date("2024-10-29T09:15:00"),
          isDeleted: false
        }
      ]
    ]
  ]);
