import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization:
            'Client-ID c3a4c0f085f71560341d965105ec35b9bd721a1a5478024c644c6038ab808736'
    }

});