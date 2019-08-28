import React from 'react'
import { GoFileDirectory } from 'react-icons/go'

class Folder extends React.Component{
    state = {
        
    }

    render() {
        const { data } = this.props
        return(
            <div className="folder">
                <GoFileDirectory />&nbsp;&nbsp;{data.name}
            </div>
        )
    }
}

export default Folder