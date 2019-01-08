import axios from 'axios';

export default axios.create({
    baseURL: 'https://hupity-9b190.firebaseio.com/'
});