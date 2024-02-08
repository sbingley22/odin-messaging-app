#! /usr/bin/env node

console.log(
  `This script populates the database. Specified database as argument - e.g.:  

  node populatedb "mongodb+srv://sbingley22:kA2AOUKQji9ce7YJ@cluster0.b9keqnj.mongodb.net/messaging-app?retryWrites=true&w=majority"

  node populatedb "mongodb+srv://sbingley22-main-db-03daa5522a8:UgxB74HgngXgEKKXdjnFEQekhPUTJy@prod-us-central1-3.yr9so.mongodb.net/sbingley22-main-db-03daa5522a8" `
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const bcrypt = require('bcryptjs')
const User = require('./models/user')
const Profile = require('./models/profile')
const Thread = require('./models/thread')

const users = []

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await addFriends();
  await addThreads();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function createUser(index, username, password, firstname, lastname, about, interests, image) {
  return new Promise( (resolve, reject) => {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        console.log("Error when trying to hash the password")
        reject(err)
      } else {

        const profiledetail = {
          firstname: firstname,
          lastname: lastname,
          about: about,
          interests: interests,
          image: image
        }

        const profile = new Profile(profiledetail)
        await profile.save()

        const userdetail = { 
          username: username, 
          password: hashedPassword,
          firstname: firstname,
          lastname: lastname,
          profile: profile._id,
          friends: [],
          threads: []
        }

        const user = new User(userdetail)
        await user.save()

        users[index] = user
        console.log(`Added user: ${username}`)
        resolve()
      }
    })
  })
}

async function createUsers() {
  await Promise.all([
    createUser(0, "user1", "password1", "Jane", "Doe", "I am an unknown person. Just fill in the blanks!", "I have no interests and all the interests.", "https://img.freepik.com/free-photo/cheerful-good-looking-young-woman-wearing-white-shirt-with-blonde-hair-smiling-pleasantly-while-receiving-some-positive-news-pretty-girl-looking-with-joyful-smile_176420-13579.jpg?w=996&t=st=1707382032~exp=1707382632~hmac=a4857c027409ae6f01934dc25dc487f1e8fe546f0290a65627680855e56a8a94"),
    createUser(1, "user2", "password2", "John", "Doe", "I am an unknown person. Just fill in the blanks!", "I have no interests and all the interests.", "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg"),
    createUser(2, "user3", "password3", "Abby", "Able", "Ready, Willing, and Able sir!", "Everything!!!", "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg?size=626&ext=jpg&ga=GA1.1.34264412.1707350400&semt=ais"),
  ])
}

async function addFriends() {
  users[0].friends.push(users[1]._id)
  users[0].friends.push(users[2]._id)
  await users[0].save()
  users[1].friends.push(users[0]._id)
  await users[1].save()
  users[2].friends.push(users[0]._id)
  await users[2].save()

  console.log("Friends added")
}

async function addThreads() {
  const threaddetail = {
    title: "Welcome!",
    messages: [
      {
        name: "Jane Doe",
        msg: "Hello everyone! Nice to meet you!"
      },
      {
        name: "John Doe",
        msg: "Hello Jane."
      },
      {
        name: "Abby Able",
        msg: "Hi everyone!"
      },
      {
        name: "Jane Doe",
        msg: "This is going to be fun!"
      }
    ]
  }

  const thread = new Thread(threaddetail)
  await thread.save()

  users[0].threads.push(thread._id)
  await users[0].save()
  
  users[1].threads.push(thread._id)
  await users[1].save()
  
  users[2].threads.push(thread._id)
  await users[2].save()

  console.log("Threads added")
}