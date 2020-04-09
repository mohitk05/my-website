---
title: The Beauty of Abstraction
eleventyExcludeFromCollections: true
---

<!-- Beauty of abstraction
In daily life, providing services. Milk delivery app. Ultimate service is of utmost important. People tend to expose implementation and influence choice.
Have been learning Nand2Tetris -> abstraction of Gates.
In tech too. Choosing a plugin built in TS over one built in JS. Should implementation matter?
Not exactly for one single instance, but it matters over time which would sruvive better.
Good implementation guarantees quality. When should users care about implementation? Typeform example. API examples. npm examples. -->

Abstraction is the _art_ of building things in such a way that the people using them should never need to care about how they work, but instead should only care about the outcomes they offer and certain inputs they require.

Abstractions are everywhere. A simple light switch is an easy example. It requires minimum effort to learn what a wall mounted button does - if you switch it on, which is identified by the button positioning in a certain way - the light goes on. If positioned the other way, it goes off. If one never studies basic electric cirtcuits, they might never know what goes inside the switch. But the most important thing is that it does not matter - knowing or not knowing how a switch works does not affect its output and that is the absolute beauty of abstraction.

![ab](/img/posts/abstraction1.png)

To abstract something is to put some logic/procedure into a black box and provide countable ways to supply input and get the output. More easy to remember the `interface` of the abstraction, more beautiful it is. Interface, as you might guess, is the way the abstraction exposes its inputs and outputs. Another nice example is of a vending machine. Someone using a vending machine knows that they need to enter the number printed under the object they wish to pull out. Once the number is known, the machine works its way to the item and drops it in the tray below.

Now, the ways in which various vending machines achieve this are many. Majorly, they use a grid to map the objects and each object has a cartessian coordinate on the grid. According to the input provided, the machine goes to that point and drops the item. This is an amazing example because it can have multiple levels of abstraction in itself. The way the machine locates the item on the stack can be very different - one may go horizontally first and then vertically, and some other may go the opposite. Since the machine uses it internally, it doesn't care about how this is implemented as long as it correctly reaches the right item.

One way in which the beauty of an abstraction is tampered is when the interface includes something which does not directly imply the abstraction's main function. This might happen due to a poor or inefficient implementation that requires users to provide some input in order to fulfil and internal condition.
