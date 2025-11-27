# Officine Mattio - Product Registration System

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Get your Firebase config from Project Settings → General → Your apps

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Setup

The app will automatically create two collections:
- `customers` - Customer information
- `products` - Product registrations linked to customers

**No manual database setup required!** Collections are created automatically on first use.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Bilingual Support**: Portuguese and Italian
- **Customer Registration**: Name, email, phone, international address
- **Product Registration**: Bike models, serial numbers, wheel types
- **Auto Phone Prefix**: Automatic phone prefix based on selected country
- **Real-time Database**: Firebase Firestore for instant data persistence

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Database**: Firebase Firestore
- **Fonts**: Inter (Google Fonts)

## Deployment

Push to GitHub and deploy to Vercel:
1. Already connected to: https://github.com/zeroventuno/OM-REGISTRO.git
2. Import to Vercel from GitHub
3. Add environment variables in Vercel dashboard
4. Deploy!
