import React from 'react'
import { Base64 } from 'js-base64'
import marked from 'marked'
import renderHtml from 'react-render-html'

const Readme = props => {
    const html = marked(Base64.decode(props.readme.content))
    return(
        <div className="readme">
            {renderHtml(html)}
        </div>
    )
}

export default Readme