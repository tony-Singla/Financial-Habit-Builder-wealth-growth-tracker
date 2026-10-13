# Financial-Habit-Builder-wealth-growth-tracker
<<<<<<< HEAD
# FinHabit: Financial Habit Builder & Wealth Growth Tracker

A full-stack web app that helps students and young professionals build consistent financial habits while tracking income, expenses, savings goals, investments and net worth over time.

## Features
- **Expense and income tracking:** add income, log expenses, 9 categories, category summaries, monthly reports.
- **Habit tracking:** daily or monthly habits, check-ins, streaks, 30-day or 6-month progress, reminders.
- **Wealth growth tracking:** savings, investments, assets, liabilities, net worth line chart, income versus expense chart.
- **Savings goals:** targets, deadlines, contributions, suggested monthly saving.
- **Admin panel:** user list, activity summary, delete user.
- **Security:** bcrypt password hashing, JWT authentication, rate-limited auth routes, Helmet, restricted CORS, server-side validation, XSS-safe rendering.

## Pages
Login/Register, Dashboard, Expense Tracker, Habit Tracker, Savings Goals, Wealth Analytics, Admin Panel.

## Project structure
```
client/                 Frontend (Vite, vanilla JavaScript)
  index.html
  src/main.js           App logic, routing, charts, API calls
  src/style.css         Styles (light and dark theme)
  .env.example          VITE_API_URL
  netlify.toml          Netlify build config
server/                 Express API
  index.js              App setup, CORS, MongoDB connection, admin seeding
  routes/               auth, data, admin
  middleware/auth.js    JWT and admin guards
  models/User.js        Mongoose model
  utils/sanitize.js     Server-side validation of user data
  .env.example          PORT, MONGO_URI, JWT_SECRET, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD
render.yaml             Render blueprint for the API
PRD.md                  Product Requirements Document
```

## Environment variables
Copy each `.env.example` to `.env` and fill in the values.

| File | Key | Purpose |
|---|---|---|
| server/.env | `MONGO_URI` | MongoDB connection string (for example from MongoDB Atlas) |
| server/.env | `JWT_SECRET` | Long random string used to sign tokens |
| server/.env | `CLIENT_URL` | Frontend origin allowed by CORS (comma-separate several) |
| server/.env | `PORT` | API port (defaults to 5000) |
| server/.env | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Creates the admin account on first start (password 8+ characters) |
| client/.env | `VITE_API_URL` | Base URL of the API, for example `http://localhost:5000` |

## Run locally
```
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```
The client runs on http://localhost:5173 (set `CLIENT_URL=http://localhost:5173`).

## API
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Logged in |
| GET, PUT | `/api/data` | Logged in |
| GET | `/api/admin/users` | Admin |
| DELETE | `/api/admin/users/:id` | Admin |
| GET | `/api/health` | Public |

## Deploy
1. **Database:** create a MongoDB Atlas cluster and copy the connection string into `MONGO_URI`.
2. **API (Render, Railway or similar):** root directory `server`, build `npm install`, start `npm start`. Set the server env vars. `render.yaml` is included for Render.
3. **Client (Netlify or Vercel):** root directory `client`, build `npm run build`, output `dist`. Set `VITE_API_URL` to the deployed API URL.
4. Set the API's `CLIENT_URL` to the deployed client URL, then redeploy the API.

## Testing checklist
See section 12 of `PRD.md`.
=======
# Financial-Habit-Builder-wealth-growth-tracker
>>>>>>> 43d5a966342adafef36e69f1c6db4ef2d65e94fb
