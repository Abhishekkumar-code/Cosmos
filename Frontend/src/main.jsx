import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/app.store.js'
import { Provider } from "react-redux"
import App from "./app/App.jsx"
import './app/App.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
