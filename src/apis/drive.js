/**Api google dirve */
import axios from 'axios';
import { apiKeyGoogle } from './stringConnection'
const KEY = apiKeyGoogle;
var SCOPES = 'https://www.googleapis.com/auth/drive';
var CLIENT_ID = '874067485777-l5ineqqp5u8s7ifseal94u2ip61q0f94.apps.googleusercontent.com';

export default axios.create({
    baseURL: 'https://www.googleapis.com/drive/v3',
    params: {
        scope: SCOPES,
        clientId: CLIENT_ID,
        apiKey: KEY,
    }
});
