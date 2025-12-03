# AmigaShare 🎉

A React application built with Next.js that helps split expenses fairly among friends based on the number of days each person is staying.

## Features

- **Expense Splitting by Days**: Calculate each person's share proportionally based on how many days they stay
- **Dynamic Participants**: Add or remove participants as needed
- **Real-time Calculation**: Instantly see the breakdown of expenses
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences

## Use Case

Perfect for:
- Vacation rentals where guests arrive/leave on different days
- Party expenses where some people stay longer
- Any shared expense scenario where contribution should be proportional to time spent

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. Enter the total expense amount
2. Add participants with their names and number of days staying
3. Click "Calculate Shares" to see the breakdown
4. Each person's share is calculated proportionally: `(person's days / total days) × total expense`

## Example

If the total expense is $300 and:
- Alice stays 1 day
- Bob stays 2 days  
- Carol stays 3 days

Total days = 6

- Alice pays: $300 × (1/6) = $50.00 (16.7%)
- Bob pays: $300 × (2/6) = $100.00 (33.3%)
- Carol pays: $300 × (3/6) = $150.00 (50.0%)

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
