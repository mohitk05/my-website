import { createBrowserHistory } from 'history'
let instance
export default (function() {
    if(instance) return instance
    let history = createBrowserHistory()

    instance = history
    return instance
})()