// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.193.133.227:8080/api',    //안드로이드 에뮬레이터에서 스프링주부트 서버 주소소
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    },
});

export default api;