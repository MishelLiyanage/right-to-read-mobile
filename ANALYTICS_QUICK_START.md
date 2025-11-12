# Quick Start Guide - Analytics

## Current Status: Local-Only Mode ✅

Your app is currently tracking analytics **locally only**. This is perfectly fine for development and testing!

### What's Working Now:
- ✅ Reading time tracking for each page
- ✅ Book statistics (total time, pages read)
- ✅ Analytics stored in device AsyncStorage
- ✅ Data persists between app restarts
- ✅ Analytics UI components (sync button, stats)

### What Needs Backend:
- ❌ Auto-sync to cloud database
- ❌ Analytics viewable from admin dashboard
- ❌ Cross-device analytics aggregation
- ❌ Data backup/recovery

---

## Option 1: Continue Local-Only (Easiest)

**Nothing to do!** Your analytics are being tracked locally. You can:
- View pending analytics count in the app
- See reading statistics in debug panel
- Data is safe on the device

**When to use:** Development, testing, single-device deployments

---

## Option 2: Add Backend (For Production)

### Step 1: Copy Environment Template
```bash
cp .env.example .env
```

### Step 2: Choose Your Backend

#### **Option A: AWS (Recommended - $0-15/month)**

1. **Create DynamoDB Tables** (see `ANALYTICS_IMPLEMENTATION.md`)
2. **Deploy Backend API** (Node.js + Express)
3. **Update `.env`:**
   ```bash
   EXPO_PUBLIC_API_URL=https://your-api.execute-api.us-east-1.amazonaws.com/prod
   ```

#### **Option B: Heroku/Railway/Render (Simple)**

1. Deploy the backend code (Node.js app)
2. Update `.env`:
   ```bash
   EXPO_PUBLIC_API_URL=https://your-app.herokuapp.com/api
   ```

#### **Option C: Local Testing**

1. Run backend locally (port 3000)
2. Update `.env`:
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api  # Your computer's IP
   ```

### Step 3: Restart App
```bash
npm start
```

### Step 4: Test Sync
1. Open app menu (⋮) → "Sync Analytics"
2. Check for success message
3. Verify data in DynamoDB/backend

---

## Backend API Code (Quick Start)

### Minimal Express Server

```javascript
// server.js
const express = require('express');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Analytics sync endpoint
app.post('/analytics/sync', async (req, res) => {
  try {
    const { schoolName, serialNumber, analyticsData } = req.body;
    
    console.log('Received analytics:', {
      school: schoolName,
      serial: serialNumber,
      records: analyticsData.pages.length
    });
    
    // TODO: Save to DynamoDB (see ANALYTICS_IMPLEMENTATION.md)
    
    res.json({
      success: true,
      message: 'Analytics received',
      syncTimestamp: Date.now(),
      recordsProcessed: analyticsData.pages.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('Analytics API running on port 3000');
});
```

Run locally:
```bash
npm install express
node server.js
```

---

## Troubleshooting

### "Backend not configured" error
- **Cause:** `.env` file missing or `EXPO_PUBLIC_API_URL` not set
- **Solution:** Either create `.env` with backend URL, or continue using local-only mode

### "Network request failed" error
- **Cause:** Backend URL is set but server is not reachable
- **Solution:** 
  1. Check backend is running
  2. Verify URL is correct in `.env`
  3. Test with: `curl https://your-backend-url/health`

### Auto-sync not working
- **Cause:** Normal if backend not configured
- **Solution:** Set `EXPO_PUBLIC_API_URL` in `.env` file

### Data still showing after sync
- **Cause:** Sync failed, or backend returned error
- **Solution:** Check console logs for error details

---

## Viewing Your Analytics

### In the App (Current)
1. Open app menu → "Sync Analytics"
2. View pending records count
3. See last sync time
4. Check debug panel for reading stats

### Admin Dashboard (Future - Backend Required)
- Build a web dashboard to query DynamoDB
- View analytics by school, book, date range
- Export reports as CSV/Excel
- Generate reading insights

---

## Next Steps

1. **Now:** Continue using local-only mode for development
2. **Later:** When ready for production, set up AWS backend
3. **Future:** Add admin dashboard for viewing analytics

For complete backend setup instructions, see `ANALYTICS_IMPLEMENTATION.md`.
