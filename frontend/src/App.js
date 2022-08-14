import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import styles from './App.module.scss'
import Header from './components/Header'
import Footer from './components/Footer'
import CreatePost from './pages/CreatePost'
import UpdatePost from './pages/UpdatePost'
import MyPosts from './pages/MyPosts'
import NotFound from './pages/NotFound'

function App() {
    // Redux :
    const dispatch = useDispatch()

    // Vérifier si l'user est déja connecté :
    dispatch({ type: 'user/checkIfAlreadyConnect' })

    // Définition des différentes routes :
    return (
        <div className={`${styles.appContainer}`}>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/post" element={<CreatePost />}></Route>
                <Route path="/modifypost/:id" element={<UpdatePost />}></Route>
                <Route path="/myposts" element={<MyPosts />} />
                <Route path="*" element={<NotFound />}></Route>
            </Routes>
            <Footer />
        </div>
    )
}

export default App
