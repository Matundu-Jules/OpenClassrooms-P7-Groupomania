import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import styles from './App.module.scss'
import Header from './components/Header'
import Footer from './components/Footer'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/Home/components/Post/components/UpdatePost'

function App() {
    const dispatch = useDispatch()
    dispatch({ type: 'user/checkIfAlreadyConnect' })

    return (
        <div className={`${styles.appContainer}`}>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/post" element={<CreatePost />}></Route>
                <Route path="/post/:id" element={<UpdatePost />}></Route>
                <Route path="/profile/:id" element={<Profile />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App
