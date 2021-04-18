import dotenv from 'dotenv';
dotenv.config();

import express  from 'express';
import bodyParser  from 'body-parser';
import mongoose  from 'mongoose';
import cors  from 'cors';
import planRoutes from './routes/plans.routes.js';
import imageRoutes from './routes/images.routes.js';
import mealRoutes from './routes/meals.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import usersRoutes from './routes/users.routes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));
app.use('/plans', planRoutes);
app.use('/images', imageRoutes);
app.use('/meals', mealRoutes);
app.use('/settings', settingsRoutes);
app.use('/users', usersRoutes);

const ATLAS_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
mongoose.connect(ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false);
