import React from 'react'
import NewSingleWork from './NewSingleWork'
import Helmet from 'react-helmet'
import { FaReact, FaNode, FaJs, FaPython } from 'react-icons/fa'

export default class NewWork extends React.Component {

    state = {
        work: [
            {
                title: 'TTT Tribe',
                url: 'https://terriblytinytales.com',
                bio: 'Tribe is a platform to collect writer submissions for TTT and curate and review them. It consists of a cross-platform app written in React Native, a Nodejs backend with a SQL DB and an admin dashboard built with React + Redux.',
                tags: ['react native', 'react', 'redux', 'sql', 'nodejs'],
                image: '/assets/images/ttt_work3.jpeg'
            },
            {
                title: 'react-insta-stories',
                url: 'https://www.npmjs.com/package/react-insta-stories',
                bio: 'A React component to create Instagram/Snapchat like stories on the web. It can be installed with npm, and takes in array of image URLs. It provides control over the story duration and loading indicator.',
                tags: ['react', 'stories', 'open source'],
                image: '/assets/images/ris.jpeg'
            },
            {
                title: 'react-router-fuzzy',
                url: 'https://www.npmjs.com/package/react-router-fuzzy',
                bio: `This provides a wrapper for Switch component of react-router-dom, which handles incorrect routes and lists nearest matching ones. It uses fuzzyset.js for matching.\n\nThis website uses this module. You can try by entering a wrong route (e.g. '/workk')!`,
                tags: ['react', 'react-router', 'fuzzyset.js'],
                image: '/assets/images/rrf.jpeg'
            },
            {
                title: 'Play This',
                url: 'https://playthis.netlify.com',
                bio: `Play This is a website where you can create a club and save a playlist of songs, add members to your club who can control the currently playing song and also suggest new additions to the playlist. Everything is realtime.\n\nIt was ranked as #3 Product of the day on Product Hunt for 25th of December 2018.`,
                tags: ['reactjs', 'nodejs', 'socket.io'],
                image: 'https://i.imgur.com/YMxMaaL.jpg?1'
            },
            {
                title: 'Sync',
                url: 'https://syncapp.xyz',
                bio: 'Sync lets you broadcast your content to multiple devices instantly. This was a project I took up following a daily problem I faced regarding data sharing.\n\nSync focuses on zero data footprint while sharing content. It supports text and images sharing, speech to text conversion and private connections. Sync was #3 on Product Hunt for 17th of November 2018, and gathers quite a few daily users.',
                tags: ['reactjs', 'socket.io', 'nodejs'],
                image: 'https://i.imgur.com/RGsIv8J.jpg'
            },
            {
                title: 'Hawkeye',
                url: 'https://hsbc.com',
                bio: 'Hawkeye is an internal dashboard developed for Core Banking at HSBC Technologies, India.\n\nIt provides an elegant UI to access crucial data, and perform CRUD operations on it. It also provides a testing module which includes Excel data parsing, predictive search, tabular view and auth.',
                tags: ['reactjs', 'java'],
                image: 'https://i.imgur.com/Q32mt9q.jpg'
            },
            {
                title: 'TTT - Videomaker',
                url: 'https://terriblytinytales.com',
                bio: 'This project was built to automate the process of generating conversation-type videos for Terribly Tiny Tales. It uses Canvas to render and record the video.',
                tags: ['html5', 'canvas', 'ffmpeg', 'nodejs'],
                image: '/assets/images/ttt_work3.jpeg'
            }
        ],
        stars: {

        }
    }

    componentDidMount(){
        document.title = 'Work - Mohit Karekar'
        fetch('https://api.github.com/users/mohitk05/repos')
            .then(res => res.json())
            .then(res => {
                res.forEach(repo => {
                    this.setState({ stars: {
                        ...this.state.stars,
                        [repo.name]: repo.watchers_count
                    } })
                })
                console.log(this.state)
            })
    }

    render() {
        return(
            <div className="newWork">
                <Helmet>
                    <title>Work - Mohit Karekar</title>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@MohitKarekar" />
                    <meta property="og:title" content="Work - Mohit Karekar" />
                    <meta property="og:url" content={`https://mohitkarekar.com/work`}/>
                    <meta property="og:description" content={`My work. View GitHub repositories of independent projects by me.`}/>
                    <meta property="og:image" content={`/assets/images/mohit.jpg`}/>
                </Helmet>
                <h1 style={{alignSelf: 'flex-start', fontSize: '4rem'}}>Work <span style={{display: 'inline-block'}}><span className="workLogo"><FaJs size={30}/></span><span className="workLogo"><FaReact size={30} /></span><span className="workLogo"><FaNode size={30}/></span><span className="workLogo"><FaPython size={30}/></span></span></h1>
                
                <hr/>
                <footer onClick={() => this.props.history.push('/')} className="workFooter" style={{alignSelf: 'flex-start'}}>← Go home</footer>
        {this.state.work.map((w, i) => <div><NewSingleWork work={w} stars={this.state.stars[w.title]} />{i !== this.state.work.length - 1 ? <hr/> : null}</div>)}
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}><footer onClick={() => this.props.history.push('/')} className="workFooter" style={{alignSelf: 'flex-start'}}>← Go home</footer><footer onClick={() => this.props.history.push('/')} className="workFooter" style={{alignSelf: 'flex-start'}}>karekar.mohit@gmail.com</footer></div>
            </div>
        )
    }

}