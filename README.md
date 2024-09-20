
# ChatApp
* Built with Next Js and Firebase  
A Messaging Service App made in Next Js that allows users a realtime text chat(personal and group) experience. Users are required to Signup/Signin using their email and password. The app provides and simple, easy-to-use UI. The database and authentication are handled in Firebase.

# System design document
Here is the system design doc- https://docs.google.com/document/d/1DpUbMW4mRqBBfrUKZmOvpXHqczgbCReludIy_lvYwWI/edit


## Author Info

Author: Sohum Bansal.   
University: Indian Institute of Technology (IIT), Patna.   
Department: Civil and Environmental Engineering  
Roll No: 2201CE60  
Institute Mail-ID: 2201ce60_sohum@iitp.ac.in  
Personal Mail-ID: sohumbansal147@gmail.com




## Steps to Setup

1. Clone the repository

```bash
  $ git clone https://github.com/sohumbansal/ChatApp
```

2. Firebase Configurations                    

Visit Firebase console, Sign in with your Google account and create a new Project. Copy the and save the firebaseConfig object. Set up firebase Authentication and also create a new Firestore database.


3. Set up environment variables.
cd into the directory. Create a env.js file in the src/app folder. Paste the copied firebaseConfig object. It should like the following:-

```bash
  const  firebaseConfig  = {
      apiKey:  "Your api key",
      authDomain:  "your auth domain",
      projectId:  "your projectId",
      storageBucket:  "your storage bucket url",
      messagingSenderId:  "your messaging sender Id",
      appId:  "Your app Id"
    };
  export { firebaseConfig };
```

4. Install node modules
Open the terminal, cd into the root folder, and run the following command.

```bash
   npm install
   or 
   npm i
```
5. Start the App
In the terminal, run the following command.
```bash
   npm run dev
```
Make sure to use the latest version of Node.
Run the app in the development mode.
Open http://localhost:3000 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.
## Features of my Application

- Simple, Easy to use UI.
- Hassle-free authentication using email and password.
- Provides real-time text chat with other users.
- Allows users to create groups and chat with mutiple users at a time.
- Users can search for other available users.
## Functionality to be added in future

- Option to attach file.
- Voice and video calls.
- AI chatbot integration.
- Availability status of the user.
- Message forwarding and deletion.
- Privacy features(like end to end encryption).
## Tech Stack Used

- Next Js 
- CSS for stylesheet.
- Firebase for authetication and database handling.
- Firestore for data storing.
- Follows Atomic design.
- Uses reusable Components.

