import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App'
import './index.css'
import { OpenAPI } from './shared/api/core/OpenAPI';

// 환경 변수에서 API 기본 URL 설정
if (typeof import.meta.env.VITE_API_BASE_URL === 'string') {
  OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
