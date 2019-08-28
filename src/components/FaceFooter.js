import React from 'react'

export default props => {
    return <div className="facefooter">
        <div className="facefooter-hori">
            <img className="facefooterImg" src="/assets/images/mohit.jpg" />
            <div style={{marginLeft: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', }}>
                <span style={{color: 'tomato', fontSize: '1.2rem', fontFamily: 'Source Code Pro'}}>Mohit Karekar</span>
                <span>I create things I wish existed. I also write sometimes.</span>
            </div>
        </div>
        
    </div>
}