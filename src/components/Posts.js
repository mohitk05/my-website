import React from 'react'
import moment from 'moment';
import { Link } from'react-router-dom'
import {Helmet} from 'react-helmet'
import { FaPencilAlt, FaNode, FaReact, FaJs } from 'react-icons/fa'
const posts = require('./../content/posts.json')

class Posts extends React.Component {
    componentDidMount() {
        console.log('import', posts)
    }

    render() {
        return(
            <div className="myContainer">
                <Helmet>
                    <title>Posts - Mohit Karekar</title>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@MohitKarekar" />
                    <meta property="og:title" content="Posts - Mohit Karekar" />
                    <meta property="og:url" content={`https://mohitkarekar.com/posts`}/>
                    <meta property="og:description" content={`Read my blog posts. Tech or random.`}/>
                    <meta property="og:image" content={`/assets/images/mohit.jpg`}/>
                </Helmet>
                <h1 style={{alignSelf: 'flex-start', fontSize: '4rem'}}>Blog <span style={{display: 'inline-block'}}><span className="workLogo"><FaJs size={30}/></span><span className="workLogo"><FaPencilAlt size={30} /></span><span className="workLogo"><FaNode size={30}/></span><span className="workLogo"><FaReact size={30}/></span></span></h1>
                
                <hr/>
                <footer onClick={() => this.props.history.push('/')} className="workFooter" style={{alignSelf: 'flex-start'}}>← Go home</footer>
                {posts.map((post, i) => (
                    <div className="singlePostPreview">
                        <h4>{i + 1}.</h4><Link to={`/posts/${post.id}`}><span>{post.title}  <span style={{fontSize: '1rem', opacity: 0.7, color: '#333'}}>{moment(post.time).format('DD MMMM YYYY')}</span>{post.time > Date.now() - 7 * 24 * 60 * 60 * 1000 ? '  ⚡️' : null}</span>
                        </Link>
                    </div>
                ))}

                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}><footer onClick={() => this.props.history.push('/')} className="workFooter" style={{alignSelf: 'flex-start'}}>← Go home</footer><footer onClick={() => this.props.history.push('/')} className="workFooter" style={{alignSelf: 'flex-start'}}>karekar.mohit@gmail.com</footer></div>
            </div>
        )
    }
}

export default Posts

