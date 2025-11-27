# Officine Mattio - Product Registration System

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Database Setup

Run the SQL schema in your Supabase project:

```bash
# Navigate to your Supabase project dashboard
# Go to SQL Editor
# Execute the contents of: supabase/schema.sql
```

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

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Database**: Supabase
- **Fonts**: Inter (Google Fonts)
