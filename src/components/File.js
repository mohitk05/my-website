import React from 'react'
import { GoFile } from 'react-icons/go'

class File extends React.Component{
    state = {
        
    }

    render() {
        const { data } = this.props
        return(
            <div className="file">
                <GoFile />&nbsp;&nbsp;{data.name}
            </div>
        )
    }
}

export default File