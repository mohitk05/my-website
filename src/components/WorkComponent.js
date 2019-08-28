import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Loading from './Loading';
import { Helmet } from 'react-helmet';

class WorkComponent extends React.Component {
    constructor(props){
        super()
        this.state = {
            work_arr: [],
            loading: true
        }
    }

    componentDidMount() {
        // fetch('https://api.github.com/users/mohitk05/repos').then(res => res.json()).then(res => {
        //     if(res){
        //         this.setState({work_arr: res.map((w, i) => {w.customImage = images[i] || 'default_work.jpeg'; return w;}), loading: false})
        //     }
        // })
    }

    render(){
        console.log(this.props)
        return(
            <div className="WorkComponent">
                <Helmet>
                    <title>Work - Mohit Karekar</title>
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:creator" content="@MohitKarekar" />
                    <meta property="og:title" content="Work - Mohit Karekar" />
                    <meta property="og:url" content={`https://mohitkarekar.com/work`}/>
                    <meta property="og:description" content={`My work. View GitHub repositories of independent projects by me.`}/>
                    <meta property="og:image" content={`/assets/images/mohit.jpg`}/>
                </Helmet>
                {/* {this.state.loading ? <Loading loading={this.state.loading} /> : this.state.work_arr.map(work => (
                    <div key={work.id}>
                        <h3 className="work-title">{work.name} • {moment(work.updated_at).format('DD MMMM YYYY')}</h3>
                        <Link to={`/work/${work.name}`}>
                            <div className="myCard recent" style={{backgroundImage: `url('/assets/images/${work.customImage}')`}}>
                                
                            </div>
                        </Link>
                    </div>
                ))} */}
                
            </div>
        )
    }
}

const images = ['go-chat.jpeg', 'portfolio.jpeg']

export default WorkComponent