I remember the first website I built; it was an ugly, dumb webpage which had couple of `<div>`s and a `<marquee>` running across the page, welcoming the visitor. It was almost 10 years ago. Frontend landscape has changed drastically since then, but my desire to create beautiful websites remains the same.

AngularJS was my first ‘frontend web framework’, which I had desperately learnt because it boasted single code base for multiple platforms. Fortunately, I couldn’t hold on to it, the concepts seemed unnatural. Writing javascript in double quotes (`<div ngFor=“let fruit of fruits”></div>` - the famous ngFor) still disturbs me. I do not exactly remember how I got introduced to React, but very soon after I read about it, it was my favourite. In this article, I list down some of the peculiar features of React that fascinate me, and keep me connected to it.

##### **1. Components:** 
While building a website, it’s always easier to break it down into several components, and think of reusing them as much as possible. Components make it super simple to visualise the structure. React provides two ways to write components, using Classes or using functions.

I believe JSX contributes a lot to the easiness. Components can be visualised as Lego blocks which makeup to a larger structure. The `return <Component />` statement signifies that you are returning a React component, which will be rendered wherever used.

A list can simply be thought of as several similar components rendered in a loop, with different data.

```jsx
render(){
    let items = items.map(i => <Item item={i} />)
    return(
        <div>
            {items}
        </div>
    )
}
```

##### **2. State:**
State is the data your application holds. It has the literal meaning of *state*, meaning it controls how your app behaves upon given certain data. In React, there are 2 things which cause a re-render of UI, __state__ and __props__. Whenever there is a change in state or props, UI refreshes.

The state variable should always be changed using the `setState()` method. There's a lot of stuff going in the background when you call `setState()` (read more in Dan Abramov's [blog post](https://overreacted.io)), e.g. React batches several such calls to optimise the rendering, plus the virtual DOM is diffed in order to update only those nodes which are updated. 

##### **3. Props:** 
Components can be thought of as hollow boxes, which when supplied with data (or properties here) change accordingly. Properties aka _props_ can be used inside a component to render content and control visible elements. Props are data carriers from a parent component to children.

Reverse data flow i.e. from child to parent, can be acheived using a pattern where you pass a function defined in the parent component as a prop to the child component. This function can then be called from the child, passing the data as argument, and received in the parent.

State and props are used together to acheive a complete UI. For example, when some data has to be fetched from an API, a request is fired in `componentDidMount()` and when it is resolved, the data is set to state using `this.setState()`. Every component fed with props referring the component state will then re-render. A code sample for this case is added in the end.

##### **4. Unidirectional data flow:** 
React, unlike Angular, allows only one-way data binding by default. To understand this, the best example is `<input/>`. In React, the `value` of `<input/>` tag can be controlled by providing a __value prop__. 
```jsx
<input value={this.state.name} />
```
But when someone types into the input field, the value `name` in `this.state` does not change. HTML cannot change the values of variables, being quite different from Angular's two-way binding.\
React provides a set of events, when such changes to input fields occur; one needs to handle the event and store the updated value.
```js
_onChange = (e) => {
    this.setState({name: e.target.value})
}

<input value={this.state.name} onChange={this._onChange} />
```
This behaviour makes the whole data flow easier to understand, as state is the ultimate source of information for a Component.

##### **5. Lifecycle methods:**
React has easy to understand lifecycle method names. They signify different steps during UI rendering, from mounting, updating to unmounting of components. It is important to know which methods are called when in the process, as this helps us know which logic is to be written in each one of them.

Detailed documentation can be read at https://reactjs.org, but the overall flow is as such:\
`constructor()` ->
`render()` ->
`componentDidMount()` ->
`componentWillUnmount()`

This flow can be understood well if we take a look at common data fetching in React. A fetch request is made in `componentDidMount()`, and when resolved, `data` is set to `this.state`.
```js
constructor(props) {
    super(props)
    this.state = {
        data: []
    }
}


componentDidMount() {
    fetch(`some/api`)
        .then(res => res.json())
        .then(data => {
            this.setState({ data })
        })
}

render() {
    return (
            <div>
                {this.state.data && this.state.data.length ? this.state.data.map(item => <div>{item}</div>) : <div>Loading...</div>}
            </div>
        )
}
```
<br>
<hr>
<br>

I always love to learn new tech, so will be diving into other frameworks soon. One interesting and important framework on top of React is __Next.js__. It supports server side rendering for React and other features. Vue.js is also a potential next framework I could learn. Anyway, for those entering the React ecosystem, the world is pretty nice place right now. So have fun with React!









