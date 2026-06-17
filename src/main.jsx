import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { seedDatabaseIfEmpty } from './data/db.js'

// Seed the local database engine, then mount the React canvas layout
const seedWithTimeout = Promise.race([
  seedDatabaseIfEmpty(),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Database seeding timeout')), 10000)
  )
])

seedWithTimeout
  .catch(error => {
    console.error('Database initialization error, mounting app anyway:', error)
  })
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
});