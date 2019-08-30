import React from 'react'
import styles from './header.module.css'
import { Link } from 'react-router-dom'

export default class Header extends React.Component {

    render() {
        console.log(this.props.location)
        let currentPath = this.props.location.pathname
        return (
            <div className={styles.Header}>
                <div className={styles.topRow}>
                    <div className={styles.profileImage}></div>
                    <div>
                        <h1 className={styles.name}>Mohit Karekar</h1>
                        <p className={styles.shortBio}>Software Engineer | JavaScript | Open Source</p>
                    </div>
                </div>
                <p className={styles.bio}>I write code and build products. Fullstack developer in love with JavaScript - Node, React and much more. I also love graphics, and everything open source.</p>
                <div className={styles.tabs}>
                    <Link to="/" className={`${styles.tab}${currentPath === '/' ? ` ${styles.active}` : ''}`}><p>Projects</p></Link>
                    <p className={styles.bullet}>•</p>
                    <Link to="/blog" className={`${styles.tab}${currentPath === '/blog' ? ` ${styles.active}` : ''}`}><p>Blog</p></Link>
                    <p className={styles.bullet}>•</p>
                    <Link to="/life" className={`${styles.tab}${currentPath === '/life' ? ` ${styles.active}` : ''}`}><p>Life</p></Link>
                </div>
                <hr className={styles.hrule}/>
            </div>
        )
    }
}