import admin from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

// Initialize Firebase Admin
const bucketName = "guild-hackathon.appspot.com";

if (!admin.apps.length) {
  // Construct the absolute path to your service account key using process.cwd()
  const serviceAccountPath = path.resolve(
    process.cwd(),
    "lib/firebaseServiceAccount.json"
  );

  // Initialize Firebase Admin SDK with the service account key
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    storageBucket: bucketName,
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function generateSignedUrl(fileId: string, userId: string) {
  const fileRef = bucket.file(`files/${userId}/${fileId}`);

  try {
    // Make the file publicly accessible
    await fileRef.makePublic();

    // Create a signed URL for the file
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60, // URL expires in 1 hour
    });

    console.log(`The signed URL for the file is ${url}`);
    return url;
  } catch (error: any) {
    console.error("Failed to generate the signed URL:", error);
    throw new Error("Failed to generate the signed URL.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, userId } = body;

    // Call the function to upload the file and update Firestore
    const url = await generateSignedUrl(fileId, userId);

    // Update Firestore with the new public URL if needed
    await db.collection("files").doc(fileId).update({
      url,
    });

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
