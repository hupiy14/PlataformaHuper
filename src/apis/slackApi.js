import axios from 'axios';


const id = '482555533539.532672221010';
const secret = '18c94d458dbe66c7f7fc0d3f2684e63f';
const code = '482555533539.595119947568.f6f9987e813252f1bd9808ace8dc3eabadfa00f2b8482cc73a02ed154513c5c2';
//http://localhost:3000/?code=482555533539.595119947568.f6f9987e813252f1bd9808ace8dc3eabadfa00f2b8482cc73a02ed154513c5c2&state=
export default axios.create ({
    baseURL: 'https://slack.com/oauth',
   /* params: {
        scope: 'identity.basic',
        client_id: id,
        //client_secret: secret,
        //code: code,
       

    }*/

});