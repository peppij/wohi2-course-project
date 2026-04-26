const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const seedQuestions = [
  {
    ques: "Introduction to HTTP",
    date: new Date("2026-03-20"),
    answer:
      "HTTP is the foundation of communication on the web. It defines how clients and servers exchange data.",
    keywords: ["http", "web"],
  },
  {
    ques: "Understanding REST APIs",
    date: new Date("2026-03-22"),
    answer:
      "REST is an architectural style that uses standard HTTP methods like GET, POST, PUT, and DELETE.",
    keywords: ["http", "api"],
  },
  {
    ques: "Node.js Basics",
    date: new Date("2026-03-25"),
    answer:
      "Node.js allows you to run JavaScript on the server using a non-blocking, event-driven architecture.",
    keywords: ["javascript", "backend"],
  },
  {
    ques: "Introduction to Databases",
    date: new Date("2026-03-26"),
    answer:
      "Databases store and organize data. Common types include relational databases like PostgreSQL and MySQL.",
    keywords: ["database", "backend"],
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash("1234", 10);
  const user = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  await prisma.question.deleteMany();
  await prisma.keyword.deleteMany();

  for (const question of seedQuestions) {
    await prisma.question.create({
      data: {
        ques: question.ques,
        date: question.date,
        answer: question.answer,
        userId: user.id,
        keywords: {
          connectOrCreate: question.keywords.map((kw) => ({
            where: { name: kw },
            create: { name: kw },
          })),
        },
      },
    });
  }
  console.log("Created user:", user.email);
  console.log("Seed data inserted successfully");
  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());