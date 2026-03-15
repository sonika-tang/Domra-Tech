// // server/src/server.js
import 'dotenv/config';
import './init.js';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger.js'; 
import db from './models/index.js'; 
import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import wordTranslationRoutes from './routes/wordTranslationRoutes.js'; 
import passport from './config/passport.config.js';
import session from 'express-session';
import favWordRoutes from './routes/favWordRoutes.js';
import CategoryRouter from './routes/categoryRoutes.js';
import WordRequestRouter from './routes/wordRequestRoutes.js';
import correctionRequestRoutes from './routes/correctionRequestRoutes.js';
import { bucket } from './services/firebaseService.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
  origin: [
    'https://domra-tech.vercel.app',
    'http://localhost:5173',
    'http://localhost:51102'
  ],
  methods: ['GET','POST','PUT','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
// app.use(cors({ origin: "*" }));
app.use(session({ secret: 'some_secret_key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); 
app.use('/api', wordTranslationRoutes);
app.use('/api', favWordRoutes);
app.use('/api/correctionRequests', correctionRequestRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/categories', CategoryRouter);
app.use('/api/wordRequests', WordRequestRouter);

// Upload route using Firebase Storage
app.post('/api/upload-url', async (req, res) => {
  try {
    const fileName = `uploads/${Date.now()}.png`;
    const file = bucket.file(fileName);

    const [url] = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType: 'image/png',
    });

    res.json({
      uploadUrl: url,
      fileUrl: `https://storage.googleapis.com/${bucket.name}/${fileName}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// Start server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
