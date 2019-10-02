import React from 'react'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import styles from './life.module.css'

export default class Life extends React.Component {

    render() {
        return (
            <div className={styles.Life}>
                No life found. JK, coming soon.
                <TwitterTweetEmbed tweetId={'1177051386992713728'} />
            </div>
        )
    }
}