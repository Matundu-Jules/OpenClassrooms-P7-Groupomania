import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ApiContext } from './context/ApiContext'
import './assets/styles/index.scss'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ApiContext.Provider value="http://localhost:3001/api">
                <App />
            </ApiContext.Provider>
        </BrowserRouter>
    </React.StrictMode>
)

reportWebVitals()
