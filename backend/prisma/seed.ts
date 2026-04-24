import { prisma } from "../src/utils/db";

async function main() {
  /*
   * ==================================================
   * USERS (OAuth-only)
   * ==================================================
   */
  await prisma.user.createMany({
    data: [
      { 
        name: "Alice Johnson", 
        email: "alice.johnson@example.com", 
        bio: "Software Developer | 2+ Years of Experience",
        image: "https://avatars.githubusercontent.com/u/1?v=4",
        googleId: "google_alice_12345"
      },
      { 
        name: "Bob Smith", 
        email: "bob.smith@example.com", 
        bio: "Software Developer | 2+ Years of Experience",
        image: "https://avatars.githubusercontent.com/u/2?v=4",
        googleId: "google_bob_23456"
      },
      { 
        name: "Charlie Brown", 
        email: "charlie.brown@example.com", 
        bio: "Full Stack Enthusiast",
        image: "https://avatars.githubusercontent.com/u/3?v=4",
        googleId: "google_charlie_34567"
      },
      { 
        name: "Daisy Miller", 
        email: "daisy.miller@example.com", 
        bio: "Building scalable systems",
        image: "https://avatars.githubusercontent.com/u/4?v=4",
        googleId: "google_daisy_45678"
      },
      { 
        name: "Eve Summers", 
        email: "eve.summers@example.com",
        image: "https://avatars.githubusercontent.com/u/5?v=4",
        googleId: "google_eve_56789"
      },
      { 
        name: "Frank Ocean", 
        email: "frank.ocean@example.com",
        image: "https://avatars.githubusercontent.com/u/6?v=4",
        googleId: "google_frank_67890"
      },
      { 
        name: "Grace Hopper", 
        email: "grace.hopper@example.com",
        image: "https://avatars.githubusercontent.com/u/7?v=4",
        googleId: "google_grace_78901"
      },
      { 
        name: "Hank Pym", 
        email: "hank.pym@example.com",
        image: "https://avatars.githubusercontent.com/u/8?v=4",
        googleId: "google_hank_89012"
      },
      { 
        name: "Ivy Woods", 
        email: "ivy.woods@example.com",
        image: "https://avatars.githubusercontent.com/u/9?v=4",
        googleId: "google_ivy_90123"
      },
      { 
        name: "Jack Sparrow", 
        email: "jack.sparrow@example.com",
        image: "https://avatars.githubusercontent.com/u/10?v=4",
        googleId: "google_jack_01234"
      },
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
    { name: "Tech Enthusiasts", owner: "alice.johnson@example.com", category: "Technology" },
    { name: "Web Dev Hub", owner: "bob.smith@example.com", category: "Technology" },
    { name: "Design Masters", owner: "grace.hopper@example.com", category: "Design" },
    { name: "UI/UX Collective", owner: "daisy.miller@example.com", category: "Design" },
    { name: "Startup Founders", owner: "frank.ocean@example.com", category: "Business" },
    { name: "Marketing Pros", owner: "eve.summers@example.com", category: "Business" },
    { name: "Career Growth", owner: "jack.sparrow@example.com", category: "Career" },
    { name: "Remote Workers", owner: "ivy.woods@example.com", category: "Career" },
    { name: "Learning Hub", owner: "charlie.brown@example.com", category: "Education" },
    { name: "Study Group", owner: "alice.johnson@example.com", category: "Education" },
    { name: "Fitness Buffs", owner: "bob.smith@example.com", category: "Health & Fitness" },
    { name: "Wellness Warriors", owner: "grace.hopper@example.com", category: "Health & Fitness" },
    { name: "Gaming World", owner: "frank.ocean@example.com", category: "Entertainment" },
    { name: "Movie Fans", owner: "daisy.miller@example.com", category: "Entertainment" },
    { name: "Travel Junkies", owner: "eve.summers@example.com", category: "Travel & Lifestyle" },
    { name: "Foodies United", owner: "jack.sparrow@example.com", category: "Travel & Lifestyle" },
    { name: "Creative Artists", owner: "ivy.woods@example.com", category: "Creative Arts" },
    { name: "Writers Club", owner: "charlie.brown@example.com", category: "Creative Arts" },
    { name: "Local Community", owner: "alice.johnson@example.com", category: "Social & Community" },
    { name: "Pet Lovers", owner: "bob.smith@example.com", category: "Social & Community" },
  ];

  for (const c of communityData) {
    await prisma.community.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        ownerId: userMap[c.owner],
        category: c.category,
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
  // Note: Timeouts commented out to avoid unique constraint conflicts
  // await prisma.timeout.createMany({
  //   data: [
  //     {
  //       userId: userMap["jack.sparrow@example.com"],
  //       communityId: communityMap["Gaming World"],
  //       expiresAt: new Date(Date.now() + 60 * 60000),
  //     },
  //     {
  //       userId: userMap["eve.summers@example.com"],
  //       communityId: communityMap["Book Lovers"],
  //       expiresAt: new Date(Date.now() + 30 * 60000),
  //     },
  //   ],
  // });

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