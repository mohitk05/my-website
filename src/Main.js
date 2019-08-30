import React, { Suspense } from 'react'
import './App.css'
import { Switch, Route } from 'react-router-dom'
import Header from './components/Header'

const Home = React.lazy(() => import('./components/Home'));
const Blog = React.lazy(() => import('./components/Blog'));
const Life = React.lazy(() => import('./components/Life'));

class Main extends React.Component {

    render(){
        return(
            <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><span className="spinLoader" role="img" aria-label="loader">👀</span> &nbsp;Loading..</div>}>
                <Route path="/" component={Header} />
                <Switch>
                    <Route exact path="/" component={Home}/>
                    {/* <Route exact path="/work" component={Home} /> */}
                    <Route exact path="/blog" component={Blog}/>
                    <Route path="/life" component={Life}/>
                </Switch>
            </Suspense>
        )
    }
}

export default Main