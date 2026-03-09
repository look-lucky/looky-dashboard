import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios';
import App from './app/App'
import './index.css'
import { OpenAPI } from './shared/api/core/OpenAPI';
import { setupInterceptors } from './shared/api/setupInterceptors';

// Interceptor 설정
setupInterceptors();

// 환경 변수에서 API 기본 URL 설정
if (typeof import.meta.env.VITE_API_BASE_URL === 'string') {
  OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL;
}

// Refresh token is cookie-based, so cross-origin auth requests must include credentials.
OpenAPI.WITH_CREDENTIALS = true;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
