import React from 'react'
import {Helmet} from 'react-helmet'

export default props => {
    return(
        <div>
            <Helmet>
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:creator" content="@MohitKarekar" />
                <title>About - Mohit Karekar</title>
                <meta property="og:title" content="About - Mohit Karekar" />
                <meta property="og:url" content={`https://mohitkarekar.com/about`}/>
                <meta property="og:description" content={`About me.`}/>
                <meta property="og:image" content={`%PUBLIC_URL%/assets/images/mohit.jpg`}/>
            </Helmet>
            <div className="myCard" style={{backgroundImage: `url('/assets/images/about.jpeg')`}}>

            </div>
            <div>
                Some information about me. Coming soon.
            </div>
        </div>
    )
}