// import {google } from "googleapis"
// import { readFileSync } from "fs";

// // Path to your service account key
// const keyFile = "./teamify-cfi-065d0fd275ff.json";

// // Load the service account key
// const credentials = JSON.parse(readFileSync(keyFile, "utf8"));

// // Authenticate the service account
// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/calendar"],
// });

// // Initialize the Calendar API
// export async function createEvent({
//   summary,
//   description,
//   start,
//   location,
//   end,
//   attendees,
// }: {
//   summary: string;
//   description: string;
//   location:string;
//   start: string;
//   end: string;
//   attendees: string[];
// }) {
//   try {
//     const calendar = google.calendar({ version: "v3", auth });

//     // Define the event details
//     const event = {
//       summary: summary,
//       description: description,
//       location:"online",
//       start: { dateTime: start },
//       end: { dateTime: end },
//       attendees: attendees.map((email: string) => ({ email: email })),
//     };

//     // Add the event to the calendar
//     const calendarId =
//       "c_beab70da3a73fdb498565c0fd60e65ffed1ffb580ce9204ae613074c9114828c@group.calendar.google.com";

//     const res = await calendar.events.insert({
//       auth: auth,
//       calendarId: calendarId,
//       requestBody: event,
//       sendNotifications: true,
//       sendUpdates: "all"
//     });
//   } catch (error) {
//     console.error("Error creating event:", error);
//   }
// }

