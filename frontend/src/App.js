import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import styles from './App.module.scss'
import Header from './components/Header'

function App() {
    return (
        <div className={`${styles.appContainer}`}>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile/:id" element={<Profile />} />
            </Routes>
        </div>
    )
}

export default App
