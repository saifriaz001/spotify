import express from 'express';
import axios from 'axios';
import { getAccessToken } from '../auth/auth.js';


const router = express.Router();

const spotifyApi = axios.create({
  baseURL: 'https://api.spotify.com/v1',
});

// Middleware to set auth header
router.use(async (req, res, next) => {
    try {
        const token = await getAccessToken(); // ensure it's async if you're refreshing
        spotifyApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        next();
      } catch (error) {
        res.status(401).send('Failed to authenticate with Spotify');
      }
});

// GET /spotify/top-tracks
router.get('/top-tracks', async (req, res) => {
  try {
    const response = await spotifyApi.get('/me/top/tracks',{
        params:{
            limit:10,
            time_range:'short_term'
        }
    });
    console.log('Top Tracks:', response.data.items);
    res.json(response.data.items);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(err.response?.status || 500).send(err.message);
  }
});

// GET /spotify/now-playing
router.get('/now-playing', async (req, res) => {
  try {
    const response = await spotifyApi.get('/me/player/currently-playing');
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.message);
  }
});



router.post('/pause', async (req, res) => {
  try {
    await spotifyApi.put('/me/player/pause');
    res.send('Playback paused');
  } catch (err) {
    console.log('Error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).send(err.message);
  }
});

export default router;
