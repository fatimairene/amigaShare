# AmigaShare 🎉

A modern expense-splitting application built with Next.js and React that helps friends divide costs fairly based on the number of days each person contributes.

## Features

- **Smart User Management**: Register and manage friends with their information
  - Store names, emails, and birthdates
  - Track upcoming birthdays with day counters
  - Edit and delete user profiles
- **Intelligent Participant Selection**: Add participants in two ways
  - Select from your registered friends
  - Manually add participants not yet registered
- **Dynamic Expense Splitting**: Calculate fair expense distribution
  - Input total expenses and participant details
  - Each person's share is calculated proportionally based on days staying
  - Real-time calculation and breakdown
- **Beautiful User Interface**

  - Responsive design for desktop and mobile
  - Dark mode support
  - Intuitive sidebar navigation
  - Color-coded interface elements

- **Data Persistence**: MongoDB integration for storing user data and expenses

## Use Case

Perfect for:

- Vacation rentals where guests arrive/leave on different days
- Group house expenses with rotating residents
- Party costs where some people stay longer
- Any shared expense scenario where contribution is proportional to participation

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables by creating a `.env.local` file:

```bash
MONGODB_URI=mongodb://localhost:27017/amigaShare
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/amigaShare
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## How It Works

### Managing Friends

1. Go to "My Friends" section
2. Click "+ Add Friend" to register a new friend
3. Fill in name, surname, email, birthday, and description
4. View all friends with upcoming birthday counters

### Splitting Expenses

1. Navigate to "Casa Rural" (Split House) section
2. Add participants (select from registered friends or enter manually)
3. Enter the number of days each person is staying
4. Specify the total expense amount
5. View the fair breakdown instantly

### Calculation Formula

Each person's share = `(person's days / total days) × total expense`

### Example

If the total expense is $300 and:

- Alice stays 1 day
- Bob stays 2 days
- Carol stays 3 days

Total days = 6

- Alice pays: $300 × (1/6) = $50.00 (16.7%)
- Bob pays: $300 × (2/6) = $100.00 (33.3%)
- Carol pays: $300 × (3/6) = $150.00 (50.0%)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Home page (My Friends)
│   ├── globals.css         # Global styles
│   ├── results/
│   │   └── page.tsx        # Results page
│   └── api/
│       └── users/
│           └── route.ts    # User CRUD endpoints
├── components/
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── UsersList.tsx       # Friends management
│   ├── UsersList.module.css
│   ├── ExpenseSplitter.tsx # Expense calculation
│   ├── AddParticipantModal.tsx
│   ├── ParticipantsList.tsx
│   └── shared/
│       ├── types.ts        # TypeScript interfaces
│       ├── utils.ts        # Helper functions
│       └── mockData.ts
└── lib/
    └── mongodb.ts          # Database connection

```

## Tech Stack

- **Frontend**: React 19, Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + CSS Modules
- **Database**: MongoDB with connection pooling
- **Build Tool**: Turbopack for optimized builds
- **Language**: TypeScript for type safety

## API Endpoints

### Users

- `GET /api/users` - List all registered users
- `POST /api/users` - Create a new user
- `PUT /api/users` - Update user information
- `DELETE /api/users` - Remove a user

## Future Enhancements

- Payment tracking and settlement
- Expense history and analytics
- Bill splitting categories
- Receipt photo upload and OCR
- Export reports to PDF/Excel
- Multi-language support

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
