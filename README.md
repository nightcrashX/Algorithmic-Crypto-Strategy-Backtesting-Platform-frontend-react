# 🚀 Crypto Trading Dashboard — Frontend

A modern, responsive cryptocurrency trading dashboard built with **React + Vite**, designed to provide a TradingView/Binance-inspired trading experience with real-time market data, interactive charts, technical indicators, portfolio management, and demo trading.

The frontend communicates with a **FastAPI backend** for market data, authentication, indicators, trading operations, portfolio data, and other application services.

---

## ✨ Features

### 📊 Advanced Trading Chart

* Interactive candlestick charts
* TradingView-inspired interface
* Multiple timeframes
* Dynamic symbol selection
* Dynamic exchange selection
* Volume visualization
* Chart pagination for historical candles
* Real-time candle updates
* Backend-driven chart data
* Smooth chart synchronization

### 📈 Technical Indicators

* Dynamic technical indicators
* Backend-calculated indicator values
* Live indicator updates with new candles
* Indicator support based on:

  * Exchange
  * Symbol
  * Timeframe
* Indicator management directly from the chart interface

> **Note:** Indicator calculations are handled by the backend. The frontend is responsible for rendering and updating the indicator data.

### ⚡ Real-Time Market Data

* WebSocket-based live market updates
* Live cryptocurrency prices
* Real-time candle updates
* Live trading price synchronization
* Dynamic market asset updates

### 💱 Trading / Order Panel

* Buy and Sell functionality
* Demo trading environment
* Quantity-based order placement
* Live asset prices
* Order execution through backend APIs
* Trading fee support
* Trade records stored through the backend

### 💰 Portfolio

* Demo trading balance
* Portfolio overview
* Asset holdings
* Current asset value
* Profit & Loss tracking
* Live portfolio updates

### 📜 Order History

* Complete order history
* Buy/Sell transaction records
* Date-based filtering
* Pagination
* Exchange and symbol information
* Trade quantity and price details

### 📈 Market Page

* Cryptocurrency market overview
* Live asset prices
* Market data
* Symbol-based navigation
* Binance-inspired market experience

### 🔐 Authentication

* User authentication
* JWT-based authentication
* Protected application routes
* Persistent login session
* Secure API communication

### 🎨 Modern UI

* Responsive design
* Dark trading interface
* Tailwind CSS
* Interactive components
* Smooth animations
* Trading-focused layout
* Desktop-first professional dashboard

---

# 🛠️ Tech Stack

## Frontend

| Technology           | Purpose                  |
| -------------------- | ------------------------ |
| React                | UI development           |
| Vite                 | Development & build tool |
| Tailwind CSS         | Styling                  |
| Lightweight Charts   | Financial charts         |
| React Router         | Application routing      |
| React Hook Form      | Form management          |
| Axios                | API communication        |
| TanStack React Query | Server-state management  |
| Zustand              | State management         |
| Framer Motion        | Animations               |
| React Icons          | Icons                    |
| Day.js               | Date & time handling     |
| clsx                 | Conditional class names  |
| tailwind-merge       | Tailwind class merging   |

## Backend

The frontend communicates with a separate backend built using:

* Python
* FastAPI
* CCXT
* MongoDB
* WebSockets

---

# 🏗️ Project Architecture

```text
Frontend
│
├── Authentication
│
├── Dashboard
│   ├── Trading Chart
│   ├── Indicators
│   ├── Order Panel
│   └── Live Market Data
│
├── Markets
│   └── Live Cryptocurrency Prices
│
├── Portfolio
│   ├── Balance
│   ├── Holdings
│   └── Profit / Loss
│
├── Order History
│   ├── Orders
│   ├── Filters
│   └── Pagination
│
└── Backend API
      │
      ├── REST APIs
      ├── WebSockets
      ├── Indicators
      ├── Trading
      └── Database
```

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

Clone the frontend repository from GitHub:

```bash
git clone https://github.com/nightcrashX/Algorithmic-Crypto-Strategy-Backtesting-Platform-frontend-react.git
```

Navigate into the project directory:

```bash
cd Algorithmic-Crypto-Strategy-Backtesting-Platform-frontend-react
```

Or visit the repository directly:

**GitHub Repository:**
https://github.com/nightcrashX/Algorithmic-Crypto-Strategy-Backtesting-Platform-frontend-react

---

## 2. Install Required Libraries

Install the required frontend dependencies:

```bash
npm install react-router-dom
npm install axios
npm install @tanstack/react-query
npm install zustand
npm install react-hook-form
npm install lightweight-charts
npm install react-icons
npm install framer-motion
npm install dayjs
npm install clsx
npm install tailwind-merge
npm install tailwindcss @tailwindcss/vite
```

### Or install all dependencies together

```bash
npm install react-router-dom axios @tanstack/react-query zustand react-hook-form lightweight-charts react-icons framer-motion dayjs clsx tailwind-merge tailwindcss @tailwindcss/vite
```

> **Recommended:** If you have cloned the repository, simply run `npm install`. All dependencies listed in `package.json` will be installed automatically.

---

# 🔐 Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000
```

For production deployment:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_WS_BASE_URL=wss://your-backend-domain.com
```

> For an HTTPS frontend, use `wss://` for WebSocket connections.

---

# ▶️ Run the Project

Open the project folder in **CMD / Terminal**.

### Step 1 — Install dependencies

```bash
npm install
```

### Step 2 — Start the development server

```bash
npm run dev
```

The frontend will normally start at:

```text
http://localhost:5173
```

---

# 🏭 Production Build

To create a production-ready build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

# 🔌 Backend Requirement

Make sure the **FastAPI backend** is running before starting the complete application.

The frontend communicates with the backend through:

* REST APIs
* WebSockets

### Local Backend

```text
http://localhost:8000
```

### Example WebSocket

```text
ws://localhost:8000/live/ws/candles/binance/BTCUSDT/15m
```

### Production WebSocket

```text
wss://your-backend-domain.com/live/ws/candles/binance/BTCUSDT/15m
```

---

# 📡 Data Flow

The application follows a backend-driven architecture.

```text
Crypto Exchange
       │
       ▼
 FastAPI Backend
       │
       ├──────── REST API ────────► React Frontend
       │
       └──────── WebSocket ───────► React Frontend
                                      │
                                      ▼
                              Trading Dashboard
```

---

# 📊 Chart Data Flow

```text
Exchange
   ↓
Backend
   ↓
Historical OHLCV API
   ↓
Frontend Chart
   ↓
WebSocket Live Candles
   ↓
Real-Time Chart Update
```

---

# 📈 Indicator Data Flow

Technical indicators are calculated on the backend and rendered by the frontend.

```text
OHLCV Data
    ↓
Backend Indicator Engine
    ↓
Indicator Calculation
    ↓
API Response
    ↓
Frontend Indicator Manager
    ↓
Chart Rendering
```

This keeps the indicator calculation logic centralized on the backend.

---

# 📜 Chart Pagination

Historical chart data is loaded using **backend pagination** instead of loading the complete historical dataset at once.

```text
User Scrolls Back
       ↓
Frontend Requests More Data
       ↓
Backend Pagination
       ↓
Historical Candles
       ↓
Chart Updates
```

This helps reduce:

* Initial loading time
* Browser memory usage
* API response size
* Chart rendering overhead

---

# 💹 Demo Trading

The platform includes a demo trading environment.

```text
Demo Balance
     ↓
Select Asset
     ↓
Buy / Sell
     ↓
Enter Quantity
     ↓
Place Order
     ↓
Backend Processes Trade
     ↓
Portfolio Updated
     ↓
Order History Updated
```

> No real funds are used.

---

# 💰 Portfolio Management

The portfolio section provides information about the user's demo trading account.

It can include:

* Available balance
* Invested amount
* Asset holdings
* Current market value
* Unrealized Profit & Loss
* Trade history

Portfolio values are synchronized with backend data and current market prices.

---

# 📜 Order History

Users can view previously executed demo trades.

Supported functionality includes:

* Buy/Sell records
* Symbol
* Exchange
* Quantity
* Price
* Date & time
* Date filtering
* Pagination

---

# 🔐 Authentication

Authentication uses JWT-based authorization.

```text
Login
  ↓
Backend Authentication
  ↓
JWT Token
  ↓
Frontend Session
  ↓
Authenticated API Requests
  ↓
Protected Dashboard
```

Protected routes prevent unauthorized access to trading functionality.

---

# 🎯 Key Design Goals

### Performance

* Backend pagination
* Efficient WebSocket updates
* Optimized chart rendering
* Reduced unnecessary API requests

### Scalability

* Modular React components
* Reusable chart components
* Backend-driven indicators
* Dynamic exchange/symbol/timeframe handling

### User Experience

* Trading-focused UI
* Responsive layout
* Real-time updates
* Smooth interactions
* Clear market information

### Maintainability

* Separation of UI and business logic
* API service layer
* Reusable components
* Centralized state management
* Backend-driven business logic

---

# 🚧 Current Development

The project is actively being improved.

Planned / ongoing features may include:

* 🤖 AI-assisted trading insights
* 📊 Advanced strategy tools
* 🧪 Strategy backtesting
* 📈 Additional technical indicators
* 🔔 Price alerts
* 📱 Improved mobile responsiveness
* ⚡ Further chart performance optimization

---

# 🖥️ Main Application Sections

The application includes interfaces such as:

* 🔐 Login / Authentication
* 📊 Trading Dashboard
* 📈 Advanced Chart
* 💹 Market
* 💰 Portfolio
* 💱 Order Panel
* 📜 Order History
* 📊 Indicator Management

---

# 🔮 Future Improvements

Possible future enhancements:

* Advanced order types
* Trading strategies
* Strategy backtesting
* AI-powered market analysis
* Additional exchange integrations
* Advanced portfolio analytics
* Price alerts
* Watchlists
* Trading notifications
* Improved mobile UI

---

# ⚠️ Disclaimer

This project is intended for **educational and demonstration purposes**.

The trading functionality is designed as a demo/simulated trading environment and does not represent financial advice or real-money investment functionality.

Always conduct your own research before making financial decisions.

---

# 👨‍💻 Developer

Developed as part of an **SDE Internship Project**.

### Project Focus

```text
React
Vite
Financial Charts
Real-Time WebSockets
REST APIs
Technical Indicators
Demo Trading
Portfolio Management
Market Data
```

---

## ⭐ Repository

If you find this project useful, consider giving the repository a ⭐ on GitHub.

**Frontend Repository:**
https://github.com/nightcrashX/Algorithmic-Crypto-Strategy-Backtesting-Platform-frontend-react
