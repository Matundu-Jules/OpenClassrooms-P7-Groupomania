import React from 'react'
import ReactDOM from 'react-dom/client'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { userStore } from './redux/stores/user.store'
import App from './App'
import { ApiContext } from './context/ApiContext'
import './assets/styles/index.scss'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        {/* Utilisation du store Redux */}
        <Provider store={userStore}>
            <BrowserRouter>
                <ApiContext.Provider value="http://localhost:3001/api">
                    <App />
                </ApiContext.Provider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
)

reportWebVitals()
