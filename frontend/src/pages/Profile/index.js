import styles from './Profile.module.scss'
import { useParams } from 'react-router-dom'

function Profile() {
    const params = useParams()
    console.log(params)
    return (
        <div>
            <h1>Mon profil</h1>
        </div>
    )
}

export default Profile
