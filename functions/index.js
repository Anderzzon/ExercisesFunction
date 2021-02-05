const functions = require("firebase-functions");
const fetch = require("node-fetch");

const admin = require("firebase-admin");
admin.initializeApp();

// Auth trigger
// exports.newUserSignUp = functions.auth.user().onCreate((user) => {
//   admin.firestore().collection("Users").doc(user.uid).set();
//   console.log("User created: ", user.uid);
// });

// Runs every hour 8AM - 5PM
exports.scheduledFunction = functions.pubsub.schedule("0 * * * *")
    .timeZone("Europe/Stockholm")
    .onRun((context) => {
      const date = new Date();
      const day = date.getDay();
      const hour = date.getHours();
      if (day !== 6 && day!== 0) {
        if (hour >= 7 && hour <= 16) {
          randomExcersise();
        } else {
          console.log("After hours");
        }
      } else {
        console.log("weekend");
      }
      return null;
    });

const randomExcersise = () => {
  const ref = admin.firestore().collection("Exercises");
  const data = [];
  ref.get()
      .then(function(docs) {
        docs.forEach(function(doc) {
          const singleDoc = doc.data();
          data.push(singleDoc);
        });
        const randomExercise = data[~~(Math.random() * data.length)];
        getAllUsers(randomExercise);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
};

const getAllUsers = (exercise) => {
  const ref = admin.firestore().collection("Users");
  ref.get()
      .then(function(docs) {
        docs.forEach(function(doc) {
          const user = doc.data();
          sendPushNotification(user, exercise);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
};

const sendPushNotification = (user, exercise) => {
  const message = {
    to: user.push_token,
    body: "Time for your next exercise: " + exercise.name,
    data: {
      name: exercise.name,
      exercise: exercise.id,
    },
  };
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
