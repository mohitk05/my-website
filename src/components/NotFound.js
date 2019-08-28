import React from 'react'
import { Link } from 'react-router-dom'

export default props => {
    console.log(props)
    return <div className="myContainer" style={{display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: '8%'}}>
        <img src="/assets/images/404.png" style={{width: window.innerWidth >= 600 ? '40%' : '100%'}} />
        <h2>Nothing here.</h2>
        {props.nearest && <div style={{justifyContent: 'center'}}>Did you mean: {props.nearest.map(n => {
            return <span style={{marginRight: 10, background: '#f1f1f1', borderRadius: 5, padding: 2, paddingLeft: 5, paddingRight: 5}}><Link to={n[1]}>{n[1]}</Link></span>
        })}</div>}
        <br/>
        <Link to="/"><a><p style={{marginTop: 5, borderBottom: '1.7px solid tomato', paddingBottom: 3}}>🏠 Go Home</p></a></Link>
        <br/>
        {window.innerWidth >= 600 && <hr/>}
        <footer style={{position: 'absolute', bottom: 30, textAlign: 'center', margin: 10}}><a href="https://mohitkarekar.com">mohitkarekar.com</a> | This site uses <a target="_blank" href="https://github.com/mohitk05/react-router-fuzzy">react-router-fuzzy</a></footer>
    </div>
}