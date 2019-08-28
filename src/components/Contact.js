import React from 'react'
import {Helmet} from 'react-helmet'

export default props => {
    return(
        <div>
            <Helmet>
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:creator" content="@MohitKarekar" />
                <title>Contact - Mohit Karekar</title>
                <meta property="og:title" content="Contact - Mohit Karekar" />
                <meta property="og:url" content={`https://mohitkarekar.com/contact`}/>
                <meta property="og:description" content={`Write to me about anything, or work!`}/>
                <meta property="og:image" content={`%PUBLIC_URL%/assets/images/mohit.jpg`}/>
            </Helmet>
            karekar.mohit@gmail.com<br/>
            Coming soon.
        </div>
    )
}