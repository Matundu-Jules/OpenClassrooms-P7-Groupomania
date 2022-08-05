import { useSelector } from 'react-redux'
import styles from './Post.module.scss'

function Post({ post }) {
    return <div>{post.title}</div>
}

export default Post
