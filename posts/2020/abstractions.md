---
title: The Beauty of Abstraction
tags: ['posts', 'abstraction', 'rambling', 'code', 'abstract']
coverImage: /img/posts/abstraction.jpeg
description: Our world is modular, made up of complex things working independently yet together - all perfect examples of abstractions. It is hence important to appreciate its beauty.
date: 2020-04-23
---

Abstraction is the _art_ of building things in such a way that the people using them should never need to care about how they work, but instead should only care about<!-- excerpt --> the outcomes they offer and certain inputs they require.

Abstractions are everywhere. A simple light switch is an easy example. It requires minimum effort to learn what a wall mounted button does - if you switch it on, which is achieved by positioning the button in a certain way - the light goes on. If positioned the other way, it goes off. If one never studies basic electric cirtcuits, they might never know what goes inside the switch. But the most important thing is that it does not matter - knowing or not knowing how a switch works does not affect its output and that is the absolute beauty of abstraction.

![ab](/img/posts/abstraction1.png)

To abstract something is to put some logic/procedure into a black box and provide countable ways to supply input and get the output. More easy to remember the `interface` of the abstraction, more beautiful it is. Interface, as you might guess, is the way the abstraction exposes its inputs and outputs. Another nice example is of a vending machine. Someone using a vending machine knows that they need to enter the number printed under the object they wish to pull out. Once the number is known, the machine works its way to the item and drops it in the tray below.

![vending machine](/img/posts/abs2.jpg)
<capt>Photo by Fabrizio Chiagano on Unsplash</capt>

Most vending machines use a grid to map the objects and each object has coordinates on the grid. According to the input provided, the machine goes to that point and drops the item. This is an amazing example because it can have multiple levels of abstraction in itself. The way the machine locates the item on the stack can be very different - one may go horizontally first and then vertically, and some other may go the opposite. Since the machine uses it internally, it doesn't care about how this is implemented as long as it correctly reaches the selected item.

I have been reading a lot about abstractions lately (and hence this post) because I am taking two online courses - one on computer architecture and the other on operating systems. Whenever you are building something, be it a physical structure like a building or a house, or any software system, you come across multiple levels of abstraction. The course on computer architecture named Nand2Tetris perfectly approaches towards building a modern computer beginning from simple NAND gates. It gradually progresses by building layers of abstrations where each layer is presented with certain readymade chips whose implementation was done in the previous lecture. For example, a 2:1 Mux is made using 3 Nand gates and once the implementation is done, it could be used, without caring about how it was built in the first place, say to build a RAM interface.

Operating systems are another good example where you see multiple uses of abstractions. Underlying complex procedures are hidden by simple system APIs exposed by the OS. The process is the CPU abstracted, the file system is the disk abstracted, etc.

Moving away from software, there's one instance where I think the essence of abstraction is adulterated. This is when the choice of an abstraction is influenced by its implementation. One day, when offices were open and I was on my way back from office, I saw an ad put up for a milk delivery service. Was it a banner ad or something I heard on the radio, I'm not quite sure. But the content of the ad seemed a bit unnatural to me. It talked about the milk delivery service and in the end mentioned that it was an initiative by two IIM alumni. This made me think - _would it matter to people, or their potential customers, that the milk they received every morning was delivered to them by a company run by two IIM alumni?_

Maybe our society is infatuated with popular-institute tags. But would it affect its choice of choosing a basic service which literally only delivers milk? I, as a consumer, would honestly only care about the milk reaching me everyday, irrespective of what supply-chain management approach you use in the background. Another example - Ola vs Uber. I'm not sure if anyone would choose Uber over Ola because they have an amazing tech team and do some cutting-edge work in AI. You would choose Uber over Ola if it's either cheap or is atleast available.

**So, does the implementation of an abstraction affect its choice?**

Well, it depends. Implementation matters in the longer run. It also matters when the implementation affects the interface of the abstraction in a positive way. Consider the example of file system in OS. FS interacts internally with some kind of a disk, and if we successfully build a faster disk, our overall abstraction of FS will inturn be faster. So if we replace a HDD (magnetic) with a SSD (solid state), our FS will run much faster. So if some product offers FS as an independent service, one would choose a SSD file system over a HDD one.

Implementation matters in the longer run also because it decides how the abstraction would survive over time. In tech and particularly in the JavaScript ecosystem, there are some biases towards using tools built in TypeScript over plain JavaScript. I find it strange; once again the same reason - I would care about the outcome of the tool rather than the implementation. But maybe, the ones who think this way would base the argument on the fact that TypeScript has its own benefits of maintaining robust code over time and it is less probable that it would turn into spaghetti after a couple of years. Once again this might be biased, but seems more believable than just going with the hype.

In the case of electronics, you would care about the implementation of a logic gate. You would choose one which consumes less power and costs less to build. So in the end we can say that implementation does matter when we need to have a wholesome view of the abstraction. This also means one thing - if we are required to examine the implementation of an abstraction, either the implementation isn't good enough, or there are competent options available. Abstractions mature over time and evolve into default choices - one would blindly install Linux on a server to host a web app.

I do not wish to convey a statement or an opinion through this writeup, I simply find abstractions amusing. It feels like magic to see something behave so perfectly each time you ask it to. It feels equally satisfying to build such a perfect abstraction and present it to the world as if saying "This piece of black box would work as expected each time and you wouldn't have to ever care what goes on inside - it'll just work!" The cover image for this post contains the Greek letter lambda, the operator for lambda calculus. This has heightened my interest in functional programming, as it somehow conveys a notion of purity.

Purity is rare though, and one way it is usually tampered is when the interface of an abstraction includes something which does not directly imply the abstraction's main function. This might happen due to a poor or inefficient implementation that requires users to provide some input in order to fulfil an internal condition. You can think of it as a plug that needs to be turned on to make an internal part of the abstraction work. One can easily identify such an implementation, but the thing is since it is inefficient, such designs/code/products never make it to the real world. If you are lucky enough, you might encounter one - e.g. this code

```js
function factorial(n, fact) {
	if (n === 1) return fact;
	return factorial(n - 1, fact * n);
}

factorial(4, 1); // 24
```

This is a simple, tail-recursive factorial function.

> **Sidenote**: Tail recursive functions are better than non-tail recursive ones because the compiler can optimise a tail recursive function since recursion is the last call. The compiler then does not have to keep a reference to return back to and hence can reduce the total steps.

The problem with the above code, which might be clearly visible, is the second argument `1` which needs to be passed for getting a successful output each time. This `1` is something which spoils the interface of the function `factorial` as it is unclear to the user calling it as to why exactly that `1` has to be fed in order to get the factorial of any number `n`. A way to improve this abstraction would be to create a wrapper function, that calls `factorial` internally and supplies the necessary second argument each time.

```js
function factorial_internal(n, fact) {
	if (n === 1) return fact;
	return factorial(n - 1, fact * n);
}

function factorial(n) {
	return factorial_internal(n, 1);
}

factorial(4); // 24
```

Abstractions in every aspect of life have made it possible to create a modular world. Our very body is made up of them - cells -> tissues -> organs -> systems. They allow us to visualise things independently and will always remain a topic of interest for me. Read this beautiful article [[Conversations with a six-year-old on functional programming](https://byorgey.wordpress.com/2018/05/06/conversations-with-a-six-year-old-on-functional-programming/)] and this one about [[Lambda Calculus](https://plato.stanford.edu/entries/lambda-calculus/)], until next time.
