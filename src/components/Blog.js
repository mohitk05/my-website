import React from 'react'
import { Route } from 'react-router-dom';
import styles from './blog.module.css'
import './blog.css'
import withShaai from '@shaai/react'
import ScrollInk from '@shaai/scroll-ink'
import history from './../history'

const Shaai = withShaai(ScrollInk)

export default class Blog extends React.Component {

    render() {
        return (
            <div className={styles.Blog}>
                <Route path="/blog/post/" render={props => {
                    return <div className={styles.back} onClick={() => props.history.goBack()}>← Back</div>
                }} />
                <Shaai match={this.props.match} config={config}/>
                <p className={styles.footerBlog}>This blog is built with <a href="https://github.com/shaaijs/core">Shaai</a>.</p>
            </div>
        )
    }
}

const config = {
    source: {
        name: 'CMS',
        config: {
            blogCode: 'w8qmg8on7c1567099425934'
        }
    },
    history
}