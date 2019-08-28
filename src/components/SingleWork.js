import React from 'react'
import File from './File'
import Folder from './Folder'
import Readme from './Readme'
import Loading from './Loading';
import {Helmet} from 'react-helmet'

class SingleWork extends React.Component{
    state = {
        repo: [],
        loadingStructure: true,
        loadingReadme: true,
        html_url: ''
    }

    componentDidMount() {
        console.log('single work mounted')
        fetch(`https://api.github.com/repos/mohitk05/${this.props.match.params.name}/contents`).then(res => res.json()).then(res => {
            this.setState({repo: res.sort((a, b) => {
                if(a.type === 'file') {
                    return 1
                }
                return -1
            }), loadingStructure: false})
        })
        fetch(`https://api.github.com/repos/mohitk05/${this.props.match.params.name}`)
            .then(res => res.json())
            .then(data => {
                this.setState({html_url: data.html_url})
            })
        fetch(`https://api.github.com/repos/mohitk05/${this.props.match.params.name}/contents/README.md?ref=master`)
            .then(res => {
                if (res.status >= 200 && res.status < 300) {
                    return res.json()
                } else Promise.reject('404')
            })
            .then(res => {
                this.setState({readme: res, loadingReadme: false})
        }).catch(e => console.log(e))

    }

    render() {
        return(
            <div>
                <Helmet>
                    <title>{this.props.match.params.name} - Work by Mohit Karekar</title>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@MohitKarekar" />
                    <meta property="og:title" content={this.props.match.params.name} />
                    <meta property="og:url" content={`https://mohitkarekar.com${this.props.location.pathname}`}/>
                    <meta property="og:description" content={`${this.props.match.params.name} - Project by Mohit Karekar`}/>
                    <meta property="og:image" content={`%PUBLIC_URL%/assets/images/${images(this.props.match.params.name)}`}/>
                </Helmet>
                {this.state.loadingStructure ? <Loading loading={this.state.loadingStructure} /> : this.state.repo.map(el => {
                    return el.type === 'file' ? <File key={el.sha} data={el} /> : <Folder key={el.sha} data={el} />
                })}
                <br/>
                <p>GitHub url: <a style={{color: 'salmon'}} href={this.state.html_url}>{this.state.html_url}</a></p>
                {this.state.loadingReadme ? <Loading loading={this.state.loadingReadme} /> :this.state.readme && <Readme readme={this.state.readme}/>}
            </div>
        )
    }
}

const images = name => {
    switch(name){
        case 'go-chat':
            return 'go-chat.jpeg'
        case 'my-portfolio':
            return 'portfolio.jpeg'
        default:
            return 'default_work.jpeg'
    }
}
export default SingleWork