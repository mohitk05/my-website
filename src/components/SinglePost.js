import React from 'react'
import moment from 'moment'
import hljs from 'highlight.js/lib';
import 'highlight.js/styles/monokai.css'
import renderHTML from 'react-render-html'
import marked from 'marked'
import {Helmet} from 'react-helmet'
import FaceFooter from './FaceFooter';
const posts = require('./../content/posts')
const post = require('./../content/i_have_a_website.md')


class SinglePost extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            post: {
                title: '',
                content: '',
                text: ''
            },
            loading: false
        }
    }

    componentDidMount() {
        const postId = this.props.match.params.id
        let post = posts.find(post => post.id === parseInt(postId, 10))
        this.setState({loading: true})
        fetch(require(`./../content/${post.content}`))
            .then(res => res.text())
            .then(text => {
                post.text = text
                this.setState({
                    post,
                    loading: false
                }, () => {
                    let preTags = Array.from(this.article.getElementsByTagName('pre'))
                    console.log(preTags)
                    preTags.forEach(pre => {
                        let codeTags = Array.from(pre.getElementsByTagName('code'))                        
                        codeTags.forEach(c => {
                            hljs.highlightBlock(c);
                        })
                    })
                })
            })
            .catch(e => {
                this.setState({
                    post: {
                        ...this.state.post,
                        text: <p>Not found.</p>
                    }
                })
            })
    }

    render(){
        const { post } = this.state
        //const content = convertToHtmlString(post.content)
        return(
            <div className="myContainer singlePost">
                <Helmet>
                    <title>{post.title} - Post by Mohit Karekar</title>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@MohitKarekar" />
                    <meta property="og:title" content={post.title} />
                    <meta property="og:url" content={`https://mohitkarekar.com/posts/${post.id}`}/>
                    <meta property="og:description" content={`${post.title} - Blog post by Mohit Karekar`}/>
                    <meta property="og:image" content={post.image}/>
                </Helmet>
                <header className="title">{post.title}</header>
                <p>{moment(post.time).format('D MMMM YYYY')}</p>
                <div className="myCard" style={{backgroundColor: '#eee', backgroundImage: `url('${post.image}')`}}></div>
                {!this.state.loading ? <span ref={r => this.article = r}>
                    {post.text && renderHTML(marked(post.text, {langPrefix: ''}))}
                </span> : <p>Loading...</p>}
                <FaceFooter />
                <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}><footer onClick={() => this.props.history.push('/posts')} className="workFooter" style={{alignSelf: 'flex-start'}}>← Go back</footer><footer onClick={() => this.props.history.push('/')} className="workFooter" style={{alignSelf: 'flex-start'}}>karekar.mohit@gmail.com</footer></div>
            </div>
        )
    }
}

export default SinglePost