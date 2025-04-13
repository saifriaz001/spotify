// index.js
import express from 'express';
import dotenv from 'dotenv';
import spotifyRoutes from "./endpoints/endpoints.js";
import { getAuthUrl, exchangeCodeForToken }  from "./auth/auth.js"; // Adjust the path as necessary

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Redirect user to Spotify login
app.get('/login', (req, res) => {
  res.redirect(getAuthUrl());
});

// Spotify OAuth callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    await exchangeCodeForToken(code);
    res.send('Authentication successful! You can now use Spotify routes.');
  } catch (err) {
    res.status(500).send('Authentication failed');
  }
});

app.use('/spotify', spotifyRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
