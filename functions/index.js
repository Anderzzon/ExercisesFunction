const functions = require("firebase-functions");
const fetch = require("node-fetch");

const admin = require("firebase-admin");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Auth trigger
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  console.log("User created: ", user.uid);

  const message = {
    to: "ExponentPushToken[DOu9c1KSwIB35nu2-eZuSs]",
    body: "Test Notification",
  };

  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
});

// Scheduled function - working!
// exports.scheduledFunction =
// functions.pubsub.schedule("every 60 minutes").onRun((context) => {
//   console.log("This will be run every 5 minutes!");
//   const message = {
//     to: "ExponentPushToken[DOu9c1KSwIB35nu2-eZuSs]",
//     body: "Repeated Notification",
//   };

//   fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       "Accept": "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });
//   return null;
// });
