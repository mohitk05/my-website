import React from 'react'
import styles from './blog.module.css'
import './blog.css'
import withShaai from '@shaai/react'
import ScrollInk from '@shaai/scroll-ink'

const Shaai = withShaai(ScrollInk)

export default class Blog extends React.Component {

    render() {
        return (
            <div className={styles.Blog}>
                <Shaai match={this.props.match} config={config}/>
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
}