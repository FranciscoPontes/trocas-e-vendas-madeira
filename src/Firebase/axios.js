import axios from 'axios';

const baseUrl = axios.create({ baseURL: 'https://cp-project-18016-default-rtdb.firebaseio.com/'});

export default baseUrl;