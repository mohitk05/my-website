import React from 'react'
import styles from './header.module.css'
import { Link } from 'react-router-dom'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { IoMdMail } from 'react-icons/io'

export default class Header extends React.Component {

    render() {
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
                <div className={styles.socialIcons}>
                    <a href="https://github.com/mohitk05" target="_blank"><FaGithub className={styles.socialIcon} /></a>
                    <a href="https://twitter.com/MohitKarekar" target="_blank"><FaTwitter className={styles.socialIcon} /></a>
                    <a href="mailto:karekar.mohit@gmail.com"><IoMdMail className={styles.socialIcon} /></a>
                </div>
                <div className={styles.tabs}>
                    <Link to="/" className={`${styles.tab}${currentPath === '/' ? ` ${styles.active}` : ''}`}><p>Projects</p></Link>
                    <p className={styles.bullet}>•</p>
                    <Link to="/blog" className={`${styles.tab}${/^\/blog.*$/.test(currentPath) ? ` ${styles.active}` : ''}`}><p>Blog</p></Link>
                    <p className={styles.bullet}>•</p>
                    <Link to="/life" className={`${styles.tab}${currentPath === '/life' ? ` ${styles.active}` : ''}`}><p>Life</p></Link>
                </div>
                <hr className={styles.hrule} />
            </div>
        )
    }
}