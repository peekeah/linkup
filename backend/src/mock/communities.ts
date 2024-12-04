import { ICommunity } from "../controllers/communities";

export const communitiesMockData: ICommunity[] = [
  {
    id: "community1",
    name: "Tech Enthusiasts",
    owner: { userId: "user1", name: "Alice Johnson" },
    admin: [
      { userId: "user2", name: "Bob Smith" },
      { userId: "user3", name: "Charlie Brown" },
    ],
    member: [
      { userId: "user1", name: "Alice Johnson" },
      { userId: "user2", name: "Bob Smith" },
      { userId: "user3", name: "Charlie Brown" },
      { userId: "user7", name: "Grace Hopper" },
    ],
    timeouts: [],
  },
  {
    id: "community2",
    name: "Gaming World",
    owner: { userId: "user6", name: "Frank Ocean" },
    admin: [
      { userId: "user4", name: "Daisy Miller" },
      { userId: "user9", name: "Ivy Woods" },
    ],
    member: [
      { userId: "user2", name: "Bob Smith" },
      { userId: "user6", name: "Frank Ocean" },
      { userId: "user4", name: "Daisy Miller" },
      { userId: "user5", name: "Eve Summers" },
    ],
    timeouts: [
      { userId: "user10", timeout: 60 },
    ],
  },
  {
    id: "community3",
    name: "Book Lovers",
    owner: { userId: "user7", name: "Grace Hopper" },
    admin: [
      { userId: "user8", name: "Hank Pym" },
      { userId: "user1", name: "Alice Johnson" },
    ],
    member: [
      { userId: "user3", name: "Charlie Brown" },
      { userId: "user7", name: "Grace Hopper" },
      { userId: "user8", name: "Hank Pym" },
      { userId: "user1", name: "Alice Johnson" },
    ],
    timeouts: [
      { userId: "user5", timeout: 30 },
    ],
  },
  {
    id: "community4",
    name: "Fitness Buffs",
    owner: { userId: "user10", name: "Jack Sparrow" },
    admin: [
      { userId: "user5", name: "Eve Summers" },
    ],
    member: [
      { userId: "user10", name: "Jack Sparrow" },
      { userId: "user5", name: "Eve Summers" },
      { userId: "user9", name: "Ivy Woods" },
    ],
    timeouts: [],
  },
  {
    id: "community5",
    name: "Nature Explorers",
    owner: { userId: "user9", name: "Ivy Woods" },
    admin: [
      { userId: "user6", name: "Frank Ocean" },
    ],
    member: [
      { userId: "user5", name: "Eve Summers" },
      { userId: "user6", name: "Frank Ocean" },
      { userId: "user9", name: "Ivy Woods" },
    ],
    timeouts: [
      { userId: "user4", timeout: 15 },
    ],
  },
  {
    id: "community6",
    name: "Art Lovers",
    owner: { userId: "user8", name: "Hank Pym" },
    admin: [
      { userId: "user1", name: "Alice Johnson" },
      { userId: "user5", name: "Eve Summers" },
    ],
    member: [
      { userId: "user1", name: "Alice Johnson" },
      { userId: "user5", name: "Eve Summers" },
      { userId: "user6", name: "Frank Ocean" },
      { userId: "user8", name: "Hank Pym" },
    ],
    timeouts: [],
  },
  {
    id: "community7",
    name: "Movie Fans",
    owner: { userId: "user4", name: "Daisy Miller" },
    admin: [
      { userId: "user2", name: "Bob Smith" },
    ],
    member: [
      { userId: "user2", name: "Bob Smith" },
      { userId: "user4", name: "Daisy Miller" },
      { userId: "user9", name: "Ivy Woods" },
      { userId: "user7", name: "Grace Hopper" },
    ],
    timeouts: [
      { userId: "user10", timeout: 20 },
    ],
  },
  {
    id: "community8",
    name: "Coding Gurus",
    owner: { userId: "user7", name: "Grace Hopper" },
    admin: [
      { userId: "user8", name: "Hank Pym" },
    ],
    member: [
      { userId: "user1", name: "Alice Johnson" },
      { userId: "user7", name: "Grace Hopper" },
      { userId: "user8", name: "Hank Pym" },
      { userId: "user3", name: "Charlie Brown" },
    ],
    timeouts: [],
  },
  {
    id: "community9",
    name: "Travel Junkies",
    owner: { userId: "user6", name: "Frank Ocean" },
    admin: [
      { userId: "user10", name: "Jack Sparrow" },
    ],
    member: [
      { userId: "user6", name: "Frank Ocean" },
      { userId: "user10", name: "Jack Sparrow" },
      { userId: "user2", name: "Bob Smith" },
    ],
    timeouts: [],
  },
  {
    id: "community10",
    name: "Foodies United",
    owner: { userId: "user5", name: "Eve Summers" },
    admin: [
      { userId: "user9", name: "Ivy Woods" },
      { userId: "user10", name: "Jack Sparrow" },
    ],
    member: [
      { userId: "user1", name: "Alice Johnson" },
      { userId: "user3", name: "Charlie Brown" },
      { userId: "user5", name: "Eve Summers" },
      { userId: "user9", name: "Ivy Woods" },
      { userId: "user10", name: "Jack Sparrow" },
    ],
    timeouts: [],
  },
];
