# Cost Manager - RESTful Web Services

Final project for Asynchronous Server-Side Development course - A complete expense management system with RESTful API.

## Live Application

**Deployed URL:** https://final-project-server-side-h0n0.onrender.com

## Technology Stack

- **Node.js & Express.js** - Server framework
- **MongoDB Atlas** - Cloud database with Mongoose ODM
- **Pino** - Professional logging system
- **Jest & Supertest** - Automated testing with in-memory MongoDB
- **CORS & dotenv** - Security and environment configuration

## Project Structure

```
├── server.js             # Server startup
├── app.js                # Main application configuration
├── package.json          # Dependencies and npm scripts
├── models/
│   ├── User.js           # User schema
│   ├── Cost.js           # Cost schema
│   └── Log.js            # Log schema
├── routes/
│   ├── users.js          # User CRUD operations
│   ├── costs.js          # Cost management
│   ├── reports.js        # Monthly reports with caching
│   ├── about.js          # Team information
│   └── logs.js           # System logs
└── tests/
    ├── users.test.js     # User API tests
    ├── costs.test.js     # Cost API tests
    ├── reports.test.js   # Report API tests
    └── misc.test.js      # System tests
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/users` | Create user |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user with total costs |
| POST | `/api/add` | Add cost entry |
| GET | `/api/report?id={id}&year={year}&month={month}` | Monthly report |
| GET | `/api/about` | Team information |
| GET | `/api/logs` | Last 200 system logs |

## Testing the Live Application

### Step-by-Step Testing Sequence

Copy and run these commands in order to test all functionality:

#### 1. Health Check
```bash
GET https://final-project-server-side-h0n0.onrender.com/health
```
**Expected:** `{"ok":true}`

#### 2. Create User
```bash
POST https://final-project-server-side-h0n0.onrender.com/api/users
Content-Type: application/json

{
  "id": 123123,
  "first_name": "mosh",
  "last_name": "israeli", 
  "birthday": "1990-01-01"
}
```
**Expected:** User object with same data

#### 3. Add Cost Entry
```bash
POST https://final-project-server-side-h0n0.onrender.com/api/add
Content-Type: application/json

{
  "userid": 123123,
  "description": "milk",
  "category": "food",
  "sum": 8
}
```
**Expected:** Cost object with auto-generated date
**Valid categories:** food, health, housing, sports, education

#### 4. Get Monthly Report
```bash
GET https://final-project-server-side-h0n0.onrender.com/api/report?id=123123&year=2025&month=1
```
**Expected:** JSON with costs grouped by categories:
```json
{
  "userid": 123123,
  "year": 2025,
  "month": 1,
  "costs": [
    {"food": [{"sum":8,"description":"milk","day":15}]},
    {"health": []},
    {"housing": []},
    {"sports": []},
    {"education": []}
  ]
}
```

#### 5. Get User with Total
```bash
GET https://final-project-server-side-h0n0.onrender.com/api/users/123123
```
**Expected:** `{"first_name":"mosh","last_name":"israeli","id":123123,"total":8}`

#### 6. List All Users
```bash
GET https://final-project-server-side-h0n0.onrender.com/api/users
```
**Expected:** Array of all users

#### 7. View Team Information
```bash
GET https://final-project-server-side-h0n0.onrender.com/api/about
```
**Expected:** 
```json
[
  {"first_name":"lir","last_name":"chen"},
  {"first_name":"alex","last_name":"nuriev"}
]
```

#### 8. View System Logs
```bash
GET https://final-project-server-side-h0n0.onrender.com/api/logs
```
**Expected:** Array of recent system logs with timestamps

### Testing with PowerShell (Windows)

```powershell
# Set base URL
$base = "https://final-project-server-side-h0n0.onrender.com"

# 1. Health check
Invoke-RestMethod -Method GET -Uri "$base/health"

# 2. Create user
Invoke-RestMethod -Method POST -Uri "$base/api/users" -ContentType "application/json" `
  -Body '{"id":123123,"first_name":"mosh","last_name":"israeli","birthday":"1990-01-01"}'

# 3. Add cost
Invoke-RestMethod -Method POST -Uri "$base/api/add" -ContentType "application/json" `
  -Body '{"userid":123123,"description":"milk","category":"food","sum":8}'

# 4. Get monthly report (formatted)
Invoke-RestMethod -Method GET -Uri "$base/api/report?id=123123&year=2025&month=1" | ConvertTo-Json -Depth 10

# 5. Get user with total
Invoke-RestMethod -Method GET -Uri "$base/api/users/123123"

# 6. List all users (table format)
Invoke-RestMethod -Method GET -Uri "$base/api/users" | Format-Table id, first_name, last_name

# 7. Team info
Invoke-RestMethod -Method GET -Uri "$base/api/about"

# 8. System logs (formatted)
Invoke-RestMethod -Method GET -Uri "$base/api/logs" | ConvertTo-Json -Depth 5
```

### Testing with curl (Mac/Linux)

```bash
BASE="https://final-project-server-side-h0n0.onrender.com"

# 1. Health check
curl "$BASE/health"

# 2. Create user
curl -X POST "$BASE/api/users" \
  -H "Content-Type: application/json" \
  -d '{"id":123123,"first_name":"mosh","last_name":"israeli","birthday":"1990-01-01"}'

# 3. Add cost
curl -X POST "$BASE/api/add" \
  -H "Content-Type: application/json" \
  -d '{"userid":123123,"description":"milk","category":"food","sum":8}'

# 4. Get monthly report
curl "$BASE/api/report?id=123123&year=2025&month=1"

# 5. Get user with total
curl "$BASE/api/users/123123"

# 6. List all users
curl "$BASE/api/users"

# 7. Team info
curl "$BASE/api/about"

# 8. System logs
curl "$BASE/api/logs"
```

## Key Features Implemented

### 1. User Management
- Create users with validation
- Retrieve user information with calculated totals
- List all registered users

### 2. Cost Tracking
- Add expenses with category validation
- Automatic timestamp assignment
- Prevention of backdated entries

### 3. Monthly Reports (Computed Pattern)
- Generate reports grouped by categories
- Automatic caching for past months
- Efficient data retrieval and processing

### 4. System Logging
- All HTTP requests logged to database
- Pino integration for professional logging
- Last 200 logs accessible via API

### 5. Data Validation
- Strict input validation on all endpoints
- Proper HTTP status codes
- Comprehensive error handling

## Database Schemas

### User Collection
```javascript
{
  id: Number (required, unique),
  first_name: String (required),
  last_name: String (required),
  birthday: Date (required)
}
```

### Cost Collection
```javascript
{
  description: String (required),
  category: String (required, enum: ['food','health','housing','sports','education']),
  userid: Number (required),
  sum: Number (required),
  date: Date (default: current timestamp)
}
```

### Log Collection
```javascript
{
  method: String,
  url: String,
  status: Number,
  timestamp: Date (default: current timestamp)
}
```

## Automated Testing

The project includes comprehensive Jest tests:

```bash
# Run all tests (uses in-memory MongoDB)
npm test

# Expected output:
PASS tests/users.test.js
PASS tests/costs.test.js  
PASS tests/reports.test.js
PASS tests/misc.test.js
```

## Development Team

- **Lir Chen**
- **Alexander Nuriev**

---

**Note:** This application implements the Computed Design Pattern for monthly reports, ensuring efficient caching of historical data and optimal performance for frequently accessed reports.
