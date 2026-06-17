import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { seedDatabaseIfEmpty } from './data/db.js'

// Seed the local database engine, then mount the React canvas layout
seedDatabaseIfEmpty().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
});