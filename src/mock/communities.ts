import { ICommunity } from "../controllers/communities";

export const communitiesMockData: ICommunity[] = [
  {
    id: "1",
    name: "Tech Enthusiasts",
    owner: { userId: "u001", name: "Alice" },
    admin: [
      { userId: "u002", name: "Bob" },
      { userId: "u003", name: "Charlie" }
    ],
    member: [
      { userId: "u001", name: "Alice" },
      { userId: "u002", name: "Bob" },
      { userId: "u003", name: "Charlie" },
      { userId: "u004", name: "Dave" }
    ],
    timeouts: [
      { userId: "u004", timeout: 300 },
    ]
  },
  {
    id: "2",
    name: "Art Lovers",
    owner: { userId: "u005", name: "Eve" },
    admin: [
      { userId: "u006", name: "Frank" }
    ],
    member: [
      { userId: "u005", name: "Eve" },
      { userId: "u006", name: "Frank" },
      { userId: "u007", name: "Grace" }
    ],
    timeouts: []
  },
  {
    id: "3",
    name: "Book Club",
    owner: { userId: "u008", name: "Hannah" },
    admin: [],
    member: [
      { userId: "u008", name: "Hannah" },
      { userId: "u009", name: "Ivan" },
      { userId: "u010", name: "Judy" }
    ],
    timeouts: [
      { userId: "u010", timeout: 120 }
    ]
  },
  {
    id: "4",
    name: "Fitness Freaks",
    owner: { userId: "u011", name: "Kate" },
    admin: [{ userId: "u012", name: "Leo" }],
    member: [
      { userId: "u011", name: "Kate" },
      { userId: "u012", name: "Leo" },
      { userId: "u013", name: "Mona" },
      { userId: "u014", name: "Nick" }
    ],
    timeouts: []
  },
  {
    id: "5",
    name: "Gamers United",
    owner: { userId: "u015", name: "Oscar" },
    admin: [{ userId: "u016", name: "Pat" }],
    member: [
      { userId: "u015", name: "Oscar" },
      { userId: "u016", name: "Pat" },
      { userId: "u017", name: "Quinn" },
      { userId: "u018", name: "Ray" }
    ],
    timeouts: [{ userId: "u018", timeout: 500 }]
  },
  {
    id: "6",
    name: "Music Lovers",
    owner: { userId: "u019", name: "Sam" },
    admin: [{ userId: "u020", name: "Tina" }],
    member: [
      { userId: "u019", name: "Sam" },
      { userId: "u020", name: "Tina" },
      { userId: "u021", name: "Uma" }
    ],
    timeouts: []
  },
  {
    id: "7",
    name: "Photography Club",
    owner: { userId: "u022", name: "Vince" },
    admin: [],
    member: [
      { userId: "u022", name: "Vince" },
      { userId: "u023", name: "Wanda" }
    ],
    timeouts: [{ userId: "u023", timeout: 150 }]
  },
  {
    id: "8",
    name: "Travel Buffs",
    owner: { userId: "u024", name: "Xander" },
    admin: [{ userId: "u025", name: "Yara" }],
    member: [
      { userId: "u024", name: "Xander" },
      { userId: "u025", name: "Yara" },
      { userId: "u026", name: "Zane" }
    ],
    timeouts: []
  },
  {
    id: "9",
    name: "Foodies",
    owner: { userId: "u027", name: "Amy" },
    admin: [{ userId: "u028", name: "Brian" }],
    member: [
      { userId: "u027", name: "Amy" },
      { userId: "u028", name: "Brian" },
      { userId: "u029", name: "Cara" }
    ],
    timeouts: [{ userId: "u029", timeout: 180 }]
  },
  {
    id: "10",
    name: "Nature Explorers",
    owner: { userId: "u030", name: "Dean" },
    admin: [],
    member: [
      { userId: "u030", name: "Dean" },
      { userId: "u031", name: "Ella" }
    ],
    timeouts: []
  }
];
