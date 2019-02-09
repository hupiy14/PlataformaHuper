import axios from 'axios';

export default axios.create({
    baseURL: 'https://xpresso2.mobigraph.co',
    headers: {
        apiKey:
            '6hSjEEYWVHTmSUUwvwjJzTpX8_zq8noEYq2-_r5ABnkq98vSw1jvHFKncRlYUA-C'
    }

});