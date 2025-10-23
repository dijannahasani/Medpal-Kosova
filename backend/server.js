const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const config = require('./config');

// ✅ KRIJIMI I APP
const app = express();

// ✅ MIDDLEWARE - CORS Configuration
const corsOptions = {
  origin: [
    config.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://medpal-kosova-937n.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ ROUTES
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const appointmentRoutes = require("./routes/appointments");
app.use("/api/appointments", appointmentRoutes);

const doctorRoutes = require("./routes/doctors");
app.use("/api/doctors", doctorRoutes); // ✅ Rregulluar

const reportRoutes = require("./routes/reports");
app.use("/api/reports", reportRoutes);

app.use("/uploads", express.static("uploads")); // për të shfaqur dokumentet

const documentRoutes = require("./routes/documents");
app.use("/api/documents", documentRoutes);

const workingHoursRoutes = require("./routes/workingHours");
app.use("/api/working-hours", workingHoursRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

app.use("/api/clinic", require("./routes/clinic"));

// ✅ CONNECT TO MONGODB
const connectDB = require('./database');

// Initialize database connection
const initializeApp = async () => {
  await connectDB();
  
  // Start reminder job after DB connection is established
  require("./reminderJob");
  
  console.log('🔄 All services initialized successfully');
};

initializeApp().catch(err => {
  console.error('❌ Failed to initialize application:', err);
  process.exit(1);
});

// ✅ TEST ROUTE - prettier HTML so the status is visible
app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>MedPal API</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background:#f6fbff; display:flex; align-items:center; justify-content:center; height:100vh; margin:0 }
          .card { background: white; border-radius:12px; padding:32px 40px; box-shadow:0 8px 30px rgba(20,40,80,0.08); text-align:center }
          h1 { font-size:36px; margin:0 0 8px }
          p { margin:0; color:#2c3e50; font-size:18px }
          .emoji { font-size:42px; display:block; margin-bottom:12px }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="emoji">🚀</div>
          <h1>MedPal API is running</h1>
          <p>Server is up and listening on port ${process.env.PORT || 5000}</p>
        </div>
      </body>
    </html>
  `);
});

// ✅ START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

