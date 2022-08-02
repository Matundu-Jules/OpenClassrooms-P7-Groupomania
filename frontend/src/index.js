import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './assets/styles/index.scss'
import { ApiContext } from './context/ApiContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <ApiContext.Provider value="http://localhost:3000/api">
            <App />
        </ApiContext.Provider>
    </React.StrictMode>
)

reportWebVitals()
