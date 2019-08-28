import React from 'react'

export default props => {
    return(
        <div className="tagGroup">
            {props.tags && props.tags.map(t => <div className="tag">{t}</div>)}
        </div>
    )
}