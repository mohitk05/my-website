import React from 'react'
import {FaExternalLinkAlt} from 'react-icons/fa'
import Tags from './Tags'
import { FaGithub } from 'react-icons/fa'

export default class NewSingleWork extends React.Component {

    render() {
        const { work, stars } = this.props
        return(
            <div className="newSingleWork">
                <div className="newSingleWorkBio">
                    <p style={{fontSize: '2rem'}}>{work.title}</p>
                    {getBadges(work.title)}                    
                    <a target="_blank" className="linkOnWhite" href={work.url}>{work.url} <FaExternalLinkAlt/></a>
                    <p style={{whiteSpace: 'pre-line'}}>{work.bio}</p>
                    <Tags tags={work.tags}/>
                    {stars && <div className="stars"><a target="_blank" href={`https://github.com/mohitk05/${work.title}`}><FaGithub size={30} color={'#333'}/> Stars: {stars}</a></div>}
                </div>
                <div className="newSingleWorkImage">
                    <img style={{width: '100%'}} src={work.image}/>
                </div>
            </div>
        )
    }

}

const getBadges = (title) => {
    switch(title) {
        case 'react-insta-stories':
            return <a style={{marginBottom: '1rem'}} href="https://www.producthunt.com/posts/react-insta-stories?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-react-insta-stories" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=144066&theme=dark&period=daily" alt="React Insta Stories - Create Instagram/Snapchat like stories using React on web | Product Hunt Embed" style={{width: 250, height: 54}} width="250px" height="54px" /></a>
        case 'Play This':
            return <a style={{marginBottom: '1rem'}}  href="https://www.producthunt.com/posts/play-this?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-play-this" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=141825&theme=dark&period=daily" alt="Play This - Create a club and let people control your playlist | Product Hunt Embed" style={{width: 250, height: 54}} width="250px" height="54px" /></a>
        case 'Sync':
            return <a style={{marginBottom: '1rem'}} href="https://www.producthunt.com/posts/sync-3?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-sync-3" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=139400&theme=dark&period=daily" alt="Sync - Broadcast your content with zero data footprint 🔗 | Product Hunt Embed" style={{width: 250, height: 54}} width="250px" height="54px" /></a>
        default:
            return null
    }
}