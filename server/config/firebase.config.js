require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTH_DOMAIN,
    projectId: "my-social-media-af5c3",
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: "93123726245",
    appId: process.env.FB_APP_ID
}

module.exports = firebaseConfig