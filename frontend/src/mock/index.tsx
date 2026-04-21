export interface UserList {
  name: string;
  lastMessage: {
    avatar: string;
    content: string;
    time: string;
  }
}

export const currentUserMock = {
  email: "alice.johnson@example.com",
  password: "Test@123"
}

export const chatMessagesMock = [
  {
    id: "1",
    content: "Hello everyone, excited to be here!",
    sender: {
      userId: "user1",
      name: "Alice Johnson",
      avatar: "https://example.com/avatar1.png"
    },
    upvotes: ["user2", "user3", "user4"],
    date: new Date("2024-11-21T10:00:00Z"),
    isDeleted: false
  },
  {
    id: "2",
    content: "Does anyone know how to fix this issue?",
    sender: {
      userId: "user2",
      name: "Bob Smith",
      avatar: "https://example.com/avatar2.png"
    },
    upvotes: ["user1", "user3"],
    date: new Date("2024-11-20T15:30:00Z"),
    isDeleted: false
  },
  {
    id: "3",
    content: "Thanks for the help earlier!",
    sender: {
      userId: "user3",
      name: "Charlie Brown",
      avatar: "https://example.com/avatar3.png"
    },
    upvotes: ["user1"],
    date: new Date("2024-11-19T18:45:00Z"),
    isDeleted: false
  },
  {
    id: "4",
    content: "This message has been removed by the author.",
    sender: {
      userId: "user4",
      name: "Diana Miller",
      avatar: "https://example.com/avatar4.png"
    },
    upvotes: [],
    date: new Date("2024-11-19T09:15:00Z"),
    isDeleted: true
  },
  {
    id: "5",
    content: "Check out this new feature we're working on!",
    sender: {
      userId: "user5",
      name: "Ethan Davis",
      avatar: "https://example.com/avatar5.png"
    },
    upvotes: ["user3", "user4"],
    date: new Date("2024-11-18T12:00:00Z"),
    isDeleted: false
  },
  {
    id: "6",
    content: "Can we have a quick meeting tomorrow?",
    sender: {
      userId: "user6",
      name: "Fay Wilson",
      avatar: "https://example.com/avatar6.png"
    },
    upvotes: ["user1", "user2", "user5"],
    date: new Date("2024-11-17T16:20:00Z"),
    isDeleted: false
  },
  {
    id: "7",
    content: "Here's a link to the document: [Link]",
    sender: {
      userId: "user7",
      name: "George Moore",
      avatar: "https://example.com/avatar7.png"
    },
    upvotes: ["user6", "user5"],
    date: new Date("2024-11-16T20:10:00Z"),
    isDeleted: false
  },
  {
    id: "8",
    content: "Looking forward to the weekend!",
    sender: {
      userId: "user8",
      name: "Hannah Taylor",
      avatar: "https://example.com/avatar8.png"
    },
    upvotes: ["user2"],
    date: new Date("2024-11-15T13:55:00Z"),
    isDeleted: false
  },
  {
    id: "9",
    content: "Can someone review this PR?",
    sender: {
      userId: "user9",
      name: "Ian Anderson",
      avatar: "https://example.com/avatar9.png"
    },
    upvotes: ["user1", "user3", "user6"],
    date: new Date("2024-11-14T11:25:00Z"),
    isDeleted: false
  },
  {
    id: "10",
    content: "Thanks, everyone! The issue is resolved now.",
    sender: {
      userId: "user10",
      name: "Jack White",
      avatar: "https://example.com/avatar10.png"
    },
    upvotes: ["user7", "user8", "user9"],
    date: new Date("2024-11-13T08:30:00Z"),
    isDeleted: false
  }
];
