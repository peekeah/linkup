import { generateHash } from "../src/utils/bcrypt";
import { prisma } from "../src/utils/db";

async function main() {
  /*
   * ==================================================
   * USERS
   * ==================================================
   */
  const password = await generateHash("Test@123")
  await prisma.user.createMany({
    data: [
      { name: "Alice Johnson", email: "alice.johnson@example.com", bio: "💻 Software Developer | 2+ Years of Experience", password },
      { name: "Bob Smith", email: "bob.smith@example.com", bio: "💻 Software Developer | 2+ Years of Experience", password },
      { name: "Charlie Brown", email: "charlie.brown@example.com", bio: "💻 Full Stack Enthusiast", password },
      { name: "Daisy Miller", email: "daisy.miller@example.com", bio: "🚀 Building scalable systems", password },
      { name: "Eve Summers", email: "eve.summers@example.com", password },
      { name: "Frank Ocean", email: "frank.ocean@example.com", password },
      { name: "Grace Hopper", email: "grace.hopper@example.com", password },
      { name: "Hank Pym", email: "hank.pym@example.com", password },
      { name: "Ivy Woods", email: "ivy.woods@example.com", password },
      { name: "Jack Sparrow", email: "jack.sparrow@example.com", password },
    ],
    skipDuplicates: true,
  });

  const users = await prisma.user.findMany();

  const userMap = Object.fromEntries(users.map((u) => [u.email, u.id]));

  /*
   * ==================================================
   * ADDRESSES
   * ==================================================
   */
  await prisma.address.createMany({
    data: [
      {
        street: "123 Tech Street",
        area: "Innovation District",
        city: "Tech City",
        state: "California",
        country: "USA",
        userId: userMap["alice.johnson@example.com"],
      },
      {
        street: "456 Code Lane",
        area: "Innovation District",
        city: "Tech City",
        state: "California",
        country: "USA",
        userId: userMap["bob.smith@example.com"],
      },
      {
        street: "789 Java Avenue",
        city: "Tech City",
        state: "California",
        country: "USA",
        userId: userMap["charlie.brown@example.com"],
      },
      {
        street: "321 Ocean Road",
        city: "Tech City",
        state: "California",
        country: "USA",
        userId: userMap["frank.ocean@example.com"],
      },
      {
        street: "555 Harbor Street",
        city: "Tech City",
        state: "California",
        country: "USA",
        userId: userMap["jack.sparrow@example.com"],
      },
    ],
    skipDuplicates: true,
  });

  /*
   * ==================================================
   * COMMUNITIES
   * ==================================================
   */
  const communityData = [
    { name: "Tech Enthusiasts", owner: "alice.johnson@example.com" },
    { name: "Gaming World", owner: "frank.ocean@example.com" },
    { name: "Book Lovers", owner: "grace.hopper@example.com" },
    { name: "Fitness Buffs", owner: "jack.sparrow@example.com" },
    { name: "Nature Explorers", owner: "ivy.woods@example.com" },
    { name: "Art Lovers", owner: "hank.pym@example.com" },
    { name: "Movie Fans", owner: "daisy.miller@example.com" },
    { name: "Coding Gurus", owner: "grace.hopper@example.com" },
    { name: "Travel Junkies", owner: "frank.ocean@example.com" },
    { name: "Foodies United", owner: "eve.summers@example.com" },
  ];

  for (const c of communityData) {
    await prisma.community.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        ownerId: userMap[c.owner],
      },
    });
  }

  const communities = await prisma.community.findMany();

  const communityMap = Object.fromEntries(
    communities.map((c) => [c.name, c.id])
  );

  /*
   * ==================================================
   * MEMBERS / ADMINS
   * ==================================================
   */
  await prisma.community.update({
    where: { id: communityMap["Tech Enthusiasts"] },
    data: {
      admins: {
        connect: [
          { id: userMap["bob.smith@example.com"] },
          { id: userMap["charlie.brown@example.com"] },
        ],
      },
      members: {
        connect: [
          { id: userMap["alice.johnson@example.com"] },
          { id: userMap["bob.smith@example.com"] },
          { id: userMap["charlie.brown@example.com"] },
          { id: userMap["grace.hopper@example.com"] },
        ],
      },
    },
  });

  await prisma.community.update({
    where: { id: communityMap["Coding Gurus"] },
    data: {
      admins: {
        connect: [{ id: userMap["hank.pym@example.com"] }],
      },
      members: {
        connect: [
          { id: userMap["alice.johnson@example.com"] },
          { id: userMap["grace.hopper@example.com"] },
          { id: userMap["hank.pym@example.com"] },
          { id: userMap["charlie.brown@example.com"] },
        ],
      },
    },
  });

  /*
   * ==================================================
   * CHAT MESSAGES
   * ==================================================
   */
  await prisma.chatMessage.createMany({
    data: [
      {
        content: "Hello, everyone!",
        senderId: userMap["alice.johnson@example.com"],
        communityId: communityMap["Tech Enthusiasts"],
        isDeleted: false,
        createdAt: new Date("2024-12-01T09:30:00"),
      },
      {
        content: "Welcome, Alice! Looking forward to your insights.",
        senderId: userMap["bob.smith@example.com"],
        communityId: communityMap["Tech Enthusiasts"],
        isDeleted: false,
        createdAt: new Date("2024-12-01T10:00:00"),
      },
      {
        content: "What’s everyone working on these days?",
        senderId: userMap["alice.johnson@example.com"],
        communityId: communityMap["Coding Gurus"],
        isDeleted: false,
        createdAt: new Date("2024-12-02T10:45:00"),
      },
      {
        content: "Great question, Alice. I’m building a web app.",
        senderId: userMap["grace.hopper@example.com"],
        communityId: communityMap["Coding Gurus"],
        isDeleted: false,
        createdAt: new Date("2024-12-02T11:00:00"),
      },
    ],
  });

  /*
   * ==================================================
   * TIMEOUTS
   * ==================================================
   */
  await prisma.timeout.createMany({
    data: [
      {
        userId: userMap["jack.sparrow@example.com"],
        communityId: communityMap["Gaming World"],
        expiresAt: new Date(Date.now() + 60 * 60000),
      },
      {
        userId: userMap["eve.summers@example.com"],
        communityId: communityMap["Book Lovers"],
        expiresAt: new Date(Date.now() + 30 * 60000),
      },
    ],
  });

  console.log("✅ Full seed completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });