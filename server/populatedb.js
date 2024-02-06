#! /usr/bin/env node
const Leaderboard = require("./models/user")
const Level = require("./models/level")

console.log(
  `This script populates a admin user to the database. Specified database as argument - e.g.:  

  node populatedb "mongodb+srv://sbingley22:kA2AOUKQji9ce7YJ@cluster0.b9keqnj.mongodb.net/messaging-app?retryWrites=true&w=majority"

  node populatedb "mongodb+srv://sbingley22-main-db-03daa5522a8:UgxB74HgngXgEKKXdjnFEQekhPUTJy@prod-us-central1-3.yr9so.mongodb.net/sbingley22-main-db-03daa5522a8" `
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createLeaderboards();
  await createLevels();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createLeaderboard(level, name, time) {
  const detail = { level: level, name: name, time: time }
  const leaderboard = new Leaderboard(detail)

  await leaderboard.save()
  console.log(`Added leaderboard entry: ${name}`)
}

async function createLevel(index, levelData) {
  const detail = { level: index, levelData: levelData }
  const level = new Level(detail)

  await level.save()
  console.log(`Added level: ${index}`)
}

async function createLevels() {
  const data1 = [
    {
      character: "Dracula",
      x: 0.75,
      y: 0.57,
    },
    {
      character: "Bat",
      x: 0.57,
      y: 0.22,
    },
    {
      character: "Hound",
      x: 0.55,
      y: 0.52,
    },
  ]
  const data2 = [
    {
      character: "Dracula",
      x: 0.92,
      y: 0.42,
    },
    {
      character: "Bat",
      x: 0.92,
      y: 0.62,
    },
    {
      character: "Hound",
      x: 0.78,
      y: 0.94,
    },
  ]
  const data3 = [
    {
      character: "Dracula",
      x: 0.14,
      y: 0.52,
    },
    {
      character: "Bat",
      x: 0.82,
      y: 0.05,
    },
    {
      character: "Hound",
      x: 0.07,
      y: 0.37,
    },
  ]

  await Promise.all([
    createLevel(
      1,
      data1
    ),
    createLevel(
      2,
      data2
    ),
    createLevel(
      3,
      data3
    )
  ])
}

async function createLeaderboards() {
  await Promise.all([
    createLeaderboard(
      1,
      "Abby",
      80.4,
    ),
    createLeaderboard(
      2,
      "Abby",
      74.4,
    ),
    createLeaderboard(
      1,
      "Sean",
      70.0,
    ),
    createLeaderboard(
      2,
      "Sean",
      89.8,
    ),
  ])
}