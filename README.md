# firechat

## Steps 
- Goto Firebase and create an app There
    - Goto Console page: https://console.firebase.google.com/
    - Click Add project & provide all requested information & selecting all default options for creating a project; When Created, press continue
    - Will open project page
    - Click on Web button (rounded button with "</>" icon) to Register app; 
        - Specify App Name
        - Click 'Register app
    - Copy config from firebaseConfig object
    - Click 'Continue to console'
    - Enable Auth: Side Bar -> Build -> Authentication
        - Click Get Started
        - Select 'Email/Password' under Native providers -> Enable Email/Password -> Save
    - Enable Firestore: Side Bar -> Firestore Database 
        - Click create database
        - select 'Start i production mode -> next
        - Select Cloud Firestor location -> Enable
    - Setup Rules: Side Bar -> Firestore Database 
        - Select Rules Tab
        - Copy and Paste following Rules
        ```
        rules_version = '2';
        service cloud.firestore {
            match /databases/{database}/documents {
                match /{document=**} {
                allow read, write: if
                    // request.time < timestamp.date(2023, 3, 31);
                    false;
                }
                
                match /users/{docId} {
                    allow read: if request.auth.uid != null;
                    allow create: if isOwner();
                }
                
                match /userchats/{docId} {    	
                    allow read: if request.auth.uid == docId;
                    allow create: if request.auth.uid == docId;
                    allow update: if request.auth.uid == docId;
                
                }
                
                match /userchats/{docId}/chats/{chatId} {
                    allow read: if request.auth.uid != null;
                    allow create: if request.auth.uid == docId || request.auth.uid == request.resource.data.destUid;
                    allow update: if request.auth.uid == docId || request.auth.uid == request.resource.data.destUid;

                }
                
                match /chats/{chatId} {
                    allow read, create, update: 
                        if request.auth.uid != null 
                        && exists(/databases/$(database)/documents/users/$(request.auth.uid)) 
                }
                
                function isOwner(){
                    let isSginedIn = request.auth.uid != null;
                    let isOwner = request.auth.uid == request.resource.data.uid;
                    return isSginedIn && isOwner
                }
            }
        }
        ```





- come back to this project & Add .env file and update it with following values 
    - (You can find the firebaseConfig object information under Project Settings: Project Overview -> gear -> project settings -> look at Your apps section -> Web apps)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```
- `npm install`
- `npm run dev`
    - Runs the app in the development mode.\
    - Open [http://localhost:5127](http://localhost:5127) to view it in your browser.