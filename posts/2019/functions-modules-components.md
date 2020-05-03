---
title: Functions, modules and components
date: 2019-02-12
coverImage: https://i.imgur.com/hbZoLzO.jpg
coverImageHeight: 480px
---

From the evolution of computer programming, the main aim of the whole concept has been to behave autonomously to a certain set of varied input. In Mathematics<!-- excerpt -->, we define a function as something which accepts a set of input and produces a range of results.

```
y = x²Input: x belongs to Real Numbers.Range: [0, +∞)
```

I was taught to think functions as black boxes, which upon given a certain input, produce some output. The black box performs some defined operation over the input provided. This operation is something which is constant for the input set; as the expression is `y = f(x)`, which looks like **_f_** consumes **_x_** to produce a **_y_**.

This idea of generalising operations has been around since the beginning of mathematics, programming is just a subset. This really helps us in thinking of a pattern in our world around. Mathematical formulae, are nothing but generalisations of naturally occurring phenomenon. It is easier for us then to predict or study these phenomena even better.

We, humans, have developed our technologies one over the other in past few decades. The idea of abstraction, as we see today in the JavaScript world in the form of package managers like npm/yarn, where people publish their modules, isn't something unique. Sources of inspiration can be found in the much mature (and maybe saturated) ecosystem of manufacturing. Let us consider two examples: an iPhone, and a average car. Both of these are one of the most widly used consumer products. But, they aren't one single product as such. An iPhone derives its parts from around the world, its processor comes from Intel, the rear camera from Sony (Japan), the battery from Samsung (South Korea) etc, and then these are finally assembled in China.

Similar happens with a car, if it's not a high-end luxury car where everything is made at a single place.

The crucial idea behind this is, it is easier to divide a certain job into small modular pieces, which can be built independently. JS ecosystem today is built on this modular concept, and thanks to Open Source, it's all free and open to improvements. If we compare this to the iPhone example, adding a processor from samsung is like running the command `npm install processor` in the terminal. And maybe the assembly in China is like `webpack build`. Just that Apple pays for all of this.

The modular idea has been applied at several places and has gathered much appreciation. On the backend, we today prefer to break our application into independent microservices rather than having a large monolith. It becomes much easier to develop and maintain such a system. Similarly, on the frontend, we break our UI into components, which is the core idea of frameworks like React and Vue. While learning React, I always thought of components as empty boxes which accept an input in form of props, and produce an output accordingly. Remember the scene from famous animated series _Tom and Jerry_ where anytime Jerry eats something unusual and his body takes the shape of that particular thing?

![Jerry eats the cheese](https://media.giphy.com/media/l1L2UkgpuiE4U/giphy.gif)

It's a quite naive comparison, but helps in visualising. I consider it quite important to break our target into smaller pieces, which can be built in parallel and designed such that they are more or less independent of one another. This helps us to reuse such pieces, later in time.

Most of React ecosystem thrives on the existence of such rich variety of packages available out there. The library in itself provides minimal features, and essentially encourages a way of thought. Quite recently I deep-dived into how React works under the hood, which led me to exploring the GitHub repo. To my surprise and equal awe, React's package distribution is itself quite abstract. The main module, `react`, only consists of the component structure and essential APIs and methods. The actual renderers are different packages. This means the same **_react logic_** can be used on the web (`react-dom`) and native mobile devices (`react-native`). One can even write their own renderer.

This inspires me a lot to think on similar lines, while developing UI, or writing code. Writing reusable pieces of code helps you maintain a good overall quality and makes one's work efficient. As per my (short) experience, one should try writing independent pieces of code for reusability, instead of directly importing modules. Later on, as you develop your skill, these parts become quite obvious and can be easily **_npm installed_**.

I believe this modular thinking can be useful in a lot of fields. Connect with me on [Twitter](https://twitter.com/mohitkarekar), and we can discuss this further. This was a thought I had one fine morning. Writing blogs really helps!
