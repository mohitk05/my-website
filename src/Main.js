import React, { Suspense } from 'react'
import withFuzzy from 'react-router-fuzzy'
import './App.css'
import { Switch, Route } from 'react-router-dom'
import Loading from './components/Loading';

const HomeComponent = React.lazy(() => import('./components/HomeComponent'));
const Posts = React.lazy(() => import('./components/Posts'));
const SinglePost = React.lazy(() => import('./components/SinglePost'));
const NewWork = React.lazy(() => import('./components/NewWork'));
const NotFound = React.lazy(() => import('./components/NotFound'));

const FSwitch = withFuzzy(Switch, Route)

class Main extends React.Component {

    render(){
        return(
            <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><span className="spinLoader">👀</span> &nbsp;Loading..</div>}>
                <FSwitch notFoundComponent={(props) => <NotFound nearest={props.nearest}/>}>
                    <Route exact path="/" component={HomeComponent}/>
                    <Route exact path="/work" component={NewWork} />
                    <Route exact path="/posts" component={Posts}/>
                    <Route path="/posts/:id" component={SinglePost}/>
                    {/* <Route component={NotFound} /> */}
                </FSwitch>
            </Suspense>
        )
    }
}

export default Main