import React from 'react'

class COTD extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    async componentDidMount() {
        const w = localStorage.getItem('weather')
        const invalidateW = localStorage.getItem('invalidateW')
        if(w && Number(JSON.parse(invalidateW)) >= Date.now()){
            this.setState({weatherData: JSON.parse(w)})
        } else {
            let query = ``
            await new Promise(res => {
                navigator.geolocation.getCurrentPosition(position => {
                const { coords: {latitude, longitude} } = position
                query = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=fb4b857ce06fab3d3a9be12d84c0b589`
                res()
            }, error => {
                query = `https://api.openweathermap.org/data/2.5/weather?q=mumbai&APPID=fb4b857ce06fab3d3a9be12d84c0b589`
                res()
            })})
            console.log(query)
            fetch(query)
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('weather', JSON.stringify(data))
                    localStorage.setItem('invalidateW', JSON.stringify(Number(Date.now()) + 10*60*1000))
                    this.setState({weatherData: data})
                })
        }
    }

    render(){
        console.log('cotd', this.props.backColor)
        return(
            <div className="cotd" style={{filter: this.props.backColor ? 'drop-shadow(0 0px 0px #333)' : 'drop-shadow(0 8px 15px #0f0f0f)', backgroundBlendMode: this.props.backColor ? 'normal' : 'normal'}}>
            <div style={{zIndex: -1,position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: '#000', opacity: this.props.backColor ? 0.8 : 0.3, borderRadius: '0.5rem', transition: 'opacity 200ms ease-in-out 00ms'}}></div>
            <div style={{zIndex: 100, paddingTop: '3rem', paddingBottom: '3rem', opacity: this.props.backColor ? 0 : 1,transition: 'opacity 300ms ease-in-out 500ms'}}>
                <h2 className="weatherTemp">{this.state.weatherData ? parseInt(this.state.weatherData.main.temp - 270, 10) : '25'}</h2>
                <p style={{...smallText, fontSize: '0.6rem', marginTop: '0.5rem'}}>°Celsius</p>
                <h3 style={weather_main}>{(this.state.weatherData && this.state.weatherData.weather[0].main) || `Wait..`}</h3>
                <p style={{...smallText, color: this.props.backColor ? '#ccc' : '#ccc'}}>{(this.state.weatherData && this.state.weatherData.name) || `Location`}</p>
            </div>
            <div style={{zIndex: 10, color: '#ccc',position: 'absolute', top: 0, left: 0, padding: '2rem', fontFamily: 'Playfair Display', letterSpacing: '0.1rem', fontWeight: 400, fontStyle: 'italic', fontSize: '1rem', textAlign: 'center', opacity: this.props.backColor ? 1 : 0,transition: 'opacity 300ms ease-in-out 500ms'}}>
                This picture was clicked at the Charminar, in Hyderabad. It was a cool January morning and the pigeons occassionally did a group lift-off, creating a spectacular scene.
            </div>
            </div>
        )
    }
}

const smallText = {
    margin: 'auto',
    textAlign: 'center',
    fontSize: '1rem',
    color: '#ccc',
    textTransform: 'uppercase',
    letterSpacing: '0.2rem'
}

const weather_main = {
    margin: 'auto',
    textAlign: 'center',
    fontSize: '4rem',
    fontFamily: 'Playfair Display',
    fontStyle: 'italic',
    color: '#ccc',
    filter: 'drop-shadow(0 5px 10px #333)'
}

export default COTD