#! /usr/bin/env node
const bcrypt = require('bcryptjs')
const User = require('./models/user')

console.log(
  `This script populates the database. Specified database as argument - e.g.:  

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
  await createUsers();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createUser(username, password, firstname, lastname) {
  return new Promise( (resolve, reject) => {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log("Error when trying to hash the password")
        reject(err)
      } else {
        const userdetail = { 
          username: username, 
          password: hashedPassword,
          firstname: firstname,
          lastname: lastname
        }

        const user = new User(userdetail)

        await user.save()
        console.log(`Added user: ${username}`)
        resolve()
      }
    })
  })
}

async function createUsers() {
  await Promise.all([
    createUser("user1", "password1", "Jane", "Doe"),
    createUser("user2", "password2", "John", "Doe"),
  ])
}