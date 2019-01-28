import axios from 'axios';


const KEY ='AIzaSyBc8xwjAd9W_52aa26QpuztTx3BXjHFKsM';
var SCOPES = 'https://www.googleapis.com/auth/drive';
var CLIENT_ID = '114346141609-03hh8319khfkq8o3fc6m2o02vr4v14m3.apps.googleusercontent.com';

export default axios.create ({
    baseURL: 'https://www.googleapis.com/drive/v3',
    params: {
       // part: 'snippet',
        //maxResults: 5,
        scope:SCOPES,
        clientId: CLIENT_ID,
        apiKey: KEY,
       // q: 'surfboards'

    }

});

;