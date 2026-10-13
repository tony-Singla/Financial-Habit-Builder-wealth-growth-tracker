# Product Requirements Document (PRD)
## FinHabit: Financial Habit Builder & Wealth Growth Tracker

| Field | Detail |
|---|---|
| Product | FinHabit |
| Type | Responsive full-stack web application (MERN-style: Node.js, Express, MongoDB, JavaScript client) |
| Audience | Students and young professionals starting their financial journey |
| Version | 1.0 |

---

## 1. Overview
Managing personal finances is hard for people who are just starting out. They struggle to save regularly, track expenses and build sustainable money habits. FinHabit helps users develop disciplined financial behaviours (saving regularly, controlling expenses, investing wisely) while tracking income, expenses, savings goals, investments and overall wealth growth over time.

## 2. Problem Statement
- Many individuals lack structured financial planning habits.
- It is difficult to track overall wealth growth over time.
- Existing apps focus mostly on budgeting rather than habit building.

## 3. Competitive Landscape
| Product | Strength | Gap FinHabit addresses |
|---|---|---|
| Mint | Automatic expense tracking and budgets | No habit streaks or challenges |
| YNAB | Strong budgeting method | Limited wealth growth view, no habit tracking |
| Personal Capital | Net worth and investment tracking | Not aimed at beginners, no habit building |

**Positioning:** FinHabit combines habit building with wealth tracking in one simple tool.

## 4. Goals and Success Metrics
| Goal | Metric |
|---|---|
| Improve financial discipline | 60% of active users keep at least one habit streak of 7+ days |
| Increase awareness of spending | Users review the monthly report at least once a month |
| Better savings tracking | Users maintain at least one active savings goal |
| Visible wealth growth | Net worth chart shows 3+ months of history |

## 5. Target Users
- College students managing a stipend or pocket money.
- Early-career professionals building their first savings and investments.
- Freelancers with irregular income who want visibility.

## 6. Scope and Modules

### 6.1 Expense and Income Tracking Module
- Add income records.
- Log daily expenses.
- Categorize expenses (Food, Transport, Rent, Shopping, Bills, Education, Health, Entertainment, Other).
- View expense summaries by category with percentage share.
- Generate monthly spending reports (income, spending, savings, savings rate, change versus the previous month).

### 6.2 Financial Habit Tracking Module
- Create habits (for example save daily, track expenses, invest monthly) with daily or monthly frequency.
- Check in and undo check-ins.
- Track completion streaks.
- Reminders: dashboard banner for pending habits and optional browser notifications.
- Performance progress: percentage completed over 30 days (daily) or 6 months (monthly).

### 6.3 Wealth Growth Tracking Module
- Track total savings.
- Track investments, assets and liabilities.
- Display net worth growth over time.
- Visual charts: net worth line chart, income versus expense bars, category bars.

### 6.4 Savings Goals
- Create goals with target amount and deadline.
- Add savings to a goal and see progress.
- Suggested monthly saving needed to reach the goal on time.

### 6.5 Administration
- Admin panel listing registered users, activity counts and net worth.
- Admin can delete a user and their data.

## 7. Pages (7 interconnected pages)
| # | Page | Route | Purpose |
|---|---|---|---|
| 1 | Login / Register | `#/in` | Secure authentication |
| 2 | Financial Dashboard | `#/dash` | Monthly snapshot, reminders, goals |
| 3 | Expense Tracker | `#/exp` | Add/delete transactions, monthly report |
| 4 | Habit Tracker | `#/habits` | Habits, streaks, reminders |
| 5 | Savings Goals | `#/goals` | Goal creation and contributions |
| 6 | Wealth Analytics | `#/wealth` | Assets, liabilities, net worth chart |
| 7 | Admin Panel | `#/admin` | User management (admin only) |

## 8. Functional Requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-1 | Users can register with name, email and password | Must |
| FR-2 | Users can log in and log out; routes are protected | Must |
| FR-3 | Users can add and delete income and expense records | Must |
| FR-4 | Expenses are categorized and summarized | Must |
| FR-5 | Monthly report with month selector | Must |
| FR-6 | Users can create habits and check in daily or monthly | Must |
| FR-7 | Streaks and progress percentages are calculated automatically | Must |
| FR-8 | Pending-habit reminders appear on the dashboard | Must |
| FR-9 | Users can create savings goals and add savings | Must |
| FR-10 | Users can manage assets and liabilities; net worth is computed | Must |
| FR-11 | Net worth history chart and income versus expense chart | Must |
| FR-12 | Admin can view and delete users | Should |
| FR-13 | Optional browser notifications for reminders | Could |

## 9. Validation and Security
- Email format validated; names require at least 2 characters.
- Passwords require at least 8 characters with letters and a number.
- Passwords are never stored in plain text: hashed with bcrypt (12 rounds) on the server.
- Sessions use signed JWT tokens (7-day expiry); every data and admin route requires a valid token.
- Auth endpoints are rate limited; the API uses Helmet security headers and an origin-restricted CORS policy.
- The server re-validates all submitted data (types, ranges, dates, lengths) before saving.
- Secrets (database URI, JWT secret) are read from environment variables, never committed.
- Duplicate email registration is blocked.
- Amounts must be positive and bounded; dates cannot be in the future.
- All user-entered text is HTML-escaped before display to prevent XSS.
- Admin route is blocked for non-admin users.

## 10. Non-Functional Requirements
- Responsive layout for mobile, tablet and desktop.
- Light and dark theme follows the system setting.
- Visible keyboard focus and sufficient colour contrast.
- Client builds to static files and deploys to any static host; API deploys to any Node host.

## 11. Data Model
| Entity | Fields |
|---|---|
| User | email, name, salt, password hash, role, created date |
| Transaction | id, type (income/expense), date, category, note, amount |
| Habit | id, name, frequency, completion log |
| Goal | id, name, target, saved, deadline |
| Asset | id, name, kind (Savings/Investment/Asset/Liability), value |
| NetWorthSnapshot | month, value |

Data is stored in MongoDB. Each user document holds the profile (name, email, password hash, role) and a `data` object with transactions, habits, goals, assets and net worth history, validated on the server before saving.

## 12. Test Plan
| Area | Test | Expected result |
|---|---|---|
| Auth | Register with weak password | Error message shown |
| Auth | Register an existing email | Blocked with message |
| Auth | Wrong password login | Rejected with a generic message |
| Auth | Call `/api/data` without a token | 401 response |
| Auth | Open `#/admin` as a normal user | Redirected to dashboard |
| Expenses | Add expense with 0 or negative amount | Rejected |
| Expenses | Future date | Rejected |
| Expenses | Add and delete a transaction | Totals and report update |
| Habits | Check in then undo | Streak updates correctly |
| Habits | Skip a day | Streak resets |
| Goals | Add savings | Progress bar and percentage update |
| Wealth | Edit an asset value | Net worth and chart update |
| Admin | Delete a user | User and their data removed |
| Responsive | Resize to 375px width | No horizontal page scroll |

## 13. Expected Impact
- Improved financial discipline among users.
- Increased awareness of spending habits.
- Better savings and wealth growth tracking.
- Stronger financial decision-making.
- Long-term financial stability for users.

## 14. Future Enhancements
- Bank account integration.
- AI-based financial advice system.
- Investment portfolio tracking.
- Mobile application.
- Automated financial reports.
- Normalize user data into separate MongoDB collections for large-scale analytics.

## 15. Deliverables
- Live deployed application link.
- Complete PRD document (this file).
- Source code: `client/` (frontend) and `server/` (Express API).
