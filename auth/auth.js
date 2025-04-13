import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let accessToken = '';
let refreshToken = '';

export function getAuthUrl() {
  const scope = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'user-top-read',
    'streaming'
  ].join(' ');

  return `https://accounts.spotify.com/authorize?response_type=code&client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}`;
}

export async function exchangeCodeForToken(code) {
  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      client_id: process.env.SPOTIFY_CLIENT_ID,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  accessToken = response.data.access_token;
  refreshToken = response.data.refresh_token;
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log("fetching response->", response.data);
  return response.data;
}

export function getAccessToken() {
  return accessToken;
}
