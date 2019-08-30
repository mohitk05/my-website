import React from 'react'
import styles from './home.module.css'
import data from './../data/projects.json'

const projects = data.projects

export default class Home extends React.Component {

    render() {
        return (
            <div className={styles.Home}>
                {
                    projects.map((p, i) => <Project key={i} project={p} />)
                }
            </div>
        )
    }
}

const Project = ({ project }) => {
    const { title, description, link } = project
    return <div className={styles.project}>
        <a href={link} target="_blank" rel="noopener noreferrer"><h3 className={styles.title}>{title}</h3></a>
        <p className={styles.description}>{description}</p>
    </div>
}