# Cost Manager - RESTful Web Services

Final project for Asynchronous Server-Side Development course - A complete expense management system with RESTful API.

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB ODM
- **Pino** - Professional logging
- **Jest & Supertest** - Automated testing
- **CORS & dotenv** - Security and environment configuration

## Project Structure

```
├── app.js                 # Main application configuration
├── server.js             # Server startup file
├── package.json          # Dependencies and scripts
├── models/
│   ├── Cost.js           # Cost model schema
│   ├── User.js           # User model schema
│   └── Log.js            # Log model schema
├── routes/
│   ├── costs.js          # Cost management routes
│   ├── users.js          # User management routes
│   ├── reports.js        # Monthly reports routes
│   ├── about.js          # Team information
│   └── logs.js           # System logs
└── tests/
    ├── costs.test.js     # Cost API tests
    ├── users.test.js     # User API tests
    ├── reports.test.js   # Reports API tests
    └── misc.test.js      # General tests
```

## WebStorm Setup & Installation

### Clone and Setup in WebStorm

**For Mac:**
1. Open WebStorm
2. File → New → Project from Version Control
3. Paste repository URL and clone
4. Open Terminal in WebStorm: `View → Tool Windows → Terminal` or `⌥F12`

**For Windows:**
1. Open WebStorm
2. File → New → Project from Version Control
3. Paste repository URL and clone
4. Open Terminal in WebStorm: `View → Tool Windows → Terminal` or `Alt+F12`

### Install Dependencies

In WebStorm Terminal:
```bash
npm install
```

## Environment Configuration

Create `.env` file in project root (WebStorm will highlight this file):

```env
MONGO_URI=mongodb+srv://<USER>:<PASS>@<CLUSTER>.<ID>.mongodb.net/costmanager?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

**Important:** URL-encode special characters in password (e.g., @ → %40)

## Running the Application

### In WebStorm Terminal

**Start Production Mode:**
```bash
npm start
```

**Start Development Mode (with nodemon):**
```bash
npm run dev
```

**Run Tests:**
```bash
npm test
```

### WebStorm Run Configurations

You can also set up run configurations in WebStorm:
1. **Run → Edit Configurations**
2. **Add New → Node.js**
3. Set **JavaScript file**: `server.js`
4. Set **Environment variables**: Load from `.env`

## API Endpoints

### Health Check
```bash
GET http://localhost:3000/health
```

### User Management

**Create User:**
```bash
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "id": 123123,
  "first_name": "John",
  "last_name": "Doe",
  "birthday": "1990-01-01"
}
```

**Get All Users:**
```bash
GET http://localhost:3000/api/users
```

**Get Specific User:**
```bash
GET http://localhost:3000/api/users/123123
```

### Cost Management

**Add Cost:**
```bash
POST http://localhost:3000/api/add
Content-Type: application/json

{
  "userid": 123123,
  "description": "Groceries",
  "category": "food",
  "sum": 50.5
}
```

**Available categories:** `food`, `health`, `housing`, `sports`, `education`

### Reports

**Get Monthly Report:**
```bash
GET http://localhost:3000/api/report?id=123123&year=2025&month=1
```

### System Information

**Get Team Info:**
```bash
GET http://localhost:3000/api/about
```

**Get System Logs:**
```bash
GET http://localhost:3000/api/logs
```

## Testing with WebStorm HTTP Client

WebStorm has a built-in HTTP client. Create a `.http` file:

```http
### Health Check
GET http://localhost:3000/health

### Create User
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "id": 123123,
  "first_name": "John",
  "last_name": "Doe",
  "birthday": "1990-01-01"
}

### Add Cost
POST http://localhost:3000/api/add
Content-Type: application/json

{
  "userid": 123123,
  "description": "Coffee",
  "category": "food",
  "sum": 15.0
}

### Get Monthly Report
GET http://localhost:3000/api/report?id=123123&year=2025&month=1
```

## Testing with PowerShell (Windows)

```powershell
# Set base URL
$base = "http://localhost:3000"

# Create user
Invoke-RestMethod -Method POST -Uri "$base/api/users" -ContentType "application/json" `
  -Body '{"id":123123,"first_name":"John","last_name":"Doe","birthday":"1990-01-01"}'

# Add cost
Invoke-RestMethod -Method POST -Uri "$base/api/add" -ContentType "application/json" `
  -Body '{"userid":123123,"description":"Coffee","category":"food","sum":15.0}'

# Get report
Invoke-RestMethod -Method GET -Uri "$base/api/report?id=123123&year=2025&month=1"
```

## Testing with curl (Mac Terminal)

```bash
# Set base URL
BASE="http://localhost:3000"

# Create user
curl -X POST "$BASE/api/users" \
  -H "Content-Type: application/json" \
  -d '{"id":123123,"first_name":"John","last_name":"Doe","birthday":"1990-01-01"}'

# Add cost
curl -X POST "$BASE/api/add" \
  -H "Content-Type: application/json" \
  -d '{"userid":123123,"description":"Coffee","category":"food","sum":15.0}'

# Get report
curl "$BASE/api/report?id=123123&year=2025&month=1"
```

## Deployment on Render

The application is deployed on Render at: `https://your-app-name.onrender.com`

### Render Configuration:
- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Environment Variables:** Set `MONGO_URI` and `NODE_ENV=production`

## Key Features

1. **User Management** - Create and manage users with validation
2. **Cost Tracking** - Add expenses with categories and automatic timestamps
3. **Monthly Reports** - Grouped cost reports with caching for past months
4. **Computed Pattern** - Efficient caching of historical reports
5. **Comprehensive Logging** - All requests logged to database with Pino
6. **Automated Testing** - Full test suite with in-memory MongoDB
7. **Input Validation** - Strict validation for all endpoints
8. **Error Handling** - Proper HTTP status codes and error messages

## Database Schema

### Users Collection
```javascript
{
  id: Number (required, unique),
  first_name: String (required),
  last_name: String (required),
  birthday: Date (required)
}
```

### Costs Collection
```javascript
{
  description: String (required),
  category: String (required, enum: ['food','health','housing','sports','education']),
  userid: Number (required),
  sum: Number (required),
  date: Date (default: now)
}
```

### Logs Collection
```javascript
{
  method: String,
  url: String,
  status: Number,
  timestamp: Date (default: now)
}
```

## Troubleshooting

### Common Issues in WebStorm:

1. **MongoDB Connection Issues:**
   - Check `.env` file exists and has correct MongoDB URI
   - Ensure database name is included in URI: `/costmanager?...`

2. **Port Already in Use:**
   - Change PORT in `.env` file
   - Or kill process: `lsof -ti:3000 | xargs kill` (Mac) or `netstat -ano | findstr :3000` (Windows)

3. **Tests Failing:**
   - Ensure MongoDB Memory Server is installed: `npm install mongodb-memory-server --save-dev`
   - Run tests with: `npm test`

4. **WebStorm Terminal Issues:**
   - Restart WebStorm Terminal: `View → Tool Windows → Terminal → Restart`
   - Check Node.js version: `node --version` (should be ≥16)

## Development Team

- Lir Chen
- Alex Nuriev

## License

This project is developed for educational purposes as part of the Asynchronous Server-Side Development course.
