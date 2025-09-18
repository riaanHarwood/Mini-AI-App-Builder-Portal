import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './pages/Chat.jsx'
import './pages/Login.jsx'
import './pages/Register.jsx'
import './pages/ForgotPassword.jsx'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
