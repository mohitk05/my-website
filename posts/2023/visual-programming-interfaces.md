---
date: 2023-12-08
title: Visual Programming Interfaces
description: A written version of my presentation at MeshCon Berlin 2023
coverImage: /img/posts/vpl-0.png
gardenTag: Evergreen
tags:
  - posts
---

<style>
.content img{
max-width: 100%;
filter: drop-shadow(1px 2px 4px #ddd);
}
@media (prefers-color-scheme: dark) {
	filter: drop-shadow(1px 1px 2px #000);
}
</style>

I recently gave a short talk at MeshCon 2023 in Berlin on _Visual Programming Interfaces_. The event was organised by OpnTec and Fossasia and included several talks on a variety of topics, the idea being “meshing of ideas”. My topic was inspired from a mixture of motivations as well - an old project, recent studies in human-computer interaction and my increasing interest in tools for thought for the future of programming.

![vpl-1](/img/posts/vpl-1.png)

One of my first introductions to writing “programs” on a computer was PowerPoint. It might sound strange but I had received an assignment to create a presentation about a social science topic when in school. There was ample time given so I completely nerded out on the software. I added sounds to each slide, created a theme, added animations and automatic slide transitions.

Things changed drastically when I discovered a feature in PowerPoint - hyperlinking slides. I started with linking slides to create “sections” in the presentation so that people could directly skip to a particular one. Then it struck me that I could use this powerful feature to create a quiz-like interaction at the end of the presentation. Anyone who is watching it, or as a group, could use it to test their knowledge. I created a bunch of slides with questions and four answer choices. Then I created two slides - a “yay you are correct” slide and a “oops that was wrong”. Then it was only linking the right answer to the “yay” slide and all the wrong answers to the “oops” one. It was my first experience with “conditional logic” which had a real application!

PowerPoint, with its hyper linking feature, is a visual programming environment. What is visual programming though?

![vpl-2](/img/posts/vpl-2.png)

Well, any tool that lets you _build logic visually_ can be put under the umbrella of "visual programming". In visual programming languages (VPLs), you thing in visuals - you manipulate them to change the resultant behaviour, unlike text-based programming where you modify lines of text to do the same.

Different people find different mediums comfortable for expressing their thought - Dali might be more visually inclined to express logic than Shakespeare, for example. One of the strongest features that a VPL provides (theoretically and practically) is **direct manipulation**.

> Direct manipulation in human computer interaction (HCI) is the characteristic of an user interface that allows a user to manipulate the entity in question directly. Consider an example of a digital UI that controls a thermostat. A bad UX would be if the UI uses a + and a - buttons to control the temperature, it can be frustrating to change the temperature that way. A better design would show a knob-like UI that a user can rotate (as if rotating a real thermostat control) - a great example of direct manipulation.

![vpl-3](/img/posts/vpl-3.png)

Ivan Daniluk gave an [interesting talk](https://www.youtube.com/watch?v=Ps3mBPcjySE) where he stated how text-based programming forms a two-level map of the problem we are intending to solve with software. The problem is mapped to a mental model you form when you try to make sense of it, which is then mapped to a text-based representation in the form of code. Visual programs try to merge the last two stages - the representation of your mental model is similar to the program you build visually.

The image on the right shows another great example of direct manipulation - the pinch and zoom feature which was demonstrated by Steve Jobs during the launch of the first iPhone.

Visual programming has had a rich history - some of the first VPLs were created in the 1960s. People have tried out various ideas in the domain with several languages trying different models of representing logic visually for a variety of use cases.

![vpl-5](/img/posts/vpl-5.png)

One of the earliest tools for visually drawing on a screen was [Sketchpad](https://en.wikipedia.org/wiki/Sketchpad) developed by Ivan Sutherland. He demonstrated drawing geometrical shapes on a screen with a stylus which was unprecedented for 1963. Yet another interesting environment was [HyperCard](https://en.wikipedia.org/wiki/HyperCard) released by Apple in Macintosh which wasn't exactly a _programming_ tool, but rather an environment to organise information. It let you create stacks of cards with text and media and then you could link the cards to one another, creating a graph of connected cards. This idea of hyperlinking later evolved into hypertext which is one of the foundations of the world wide web.

[LabVIEW](https://en.wikipedia.org/wiki/LabVIEW) is one of the oldest VPLs that is still heavily is use. It is used to build electronic circuits visually and simulate their behaviour. Scratch is a popular VPL for beginner programmers - it provides a block-based environment to build logical programs to make characters on the screen behave as instructed. It is very popular among young programmers and is extensively used to teach fundamental programming to kids. "Visual" Basic is a misnomer - it is not a VPL but only an extensive visual code editor. It is often grouped under visual languages but it isn't one honestly.

![vpl-6](/img/posts/vpl-6.png)

Today, there are several VPLs in the domain of creative programming and simulations. Blender uses a node-based interface to construct materials (_A material defines the artistic qualities of the substance that an object is made of. In its simplest form, you can use materials to show the substance an object is made of, or to “paint” the object with different colors_. [Source](https://docs.blender.org/manual/en/2.79/render/blender_render/materials/introduction.html).) of complex natures. Starting from a base material you can apply various transformations to it by passing it through a set of nodes and this logic can be constructed visually.

[VVVV](https://visualprogramming.net/) is a language to build complex visualizations that can be projected on large surfaces and screens. Simulink is a popular VPL to construct engineering simulations for prototyping.

Well, if there's so much history to visual programming, why isn't it mainstream?

![vpl-7](/img/posts/vpl-7.png)

The reason is that visual programming languages are not a silver bullet - they are bad at solving generic problems. A paper from 1997 suggests that there hasn't been enough research about VPLs and if they really work. They are great at solving some specific problems though.

1. Digital signal processing and simulations are a great use case for building visual logic. The direct manipulation provided by VPLs makes them feel similar to using physical instruments.
2. Teaching programming is a lot better experience when visual. Languages like Scratch and Snap! have been great at onboarding new folks to programming.
3. Creative programming and multimedia manipulation has been another popular field with use cases for VPLs. Tools like Blender and VVVV work great visually, providing immediate feedback at each step.

One thing common in the above domains when they implement visual programming is that they build a flow-based programming model. Flow-based programming is a paradigm where a program is written as a combination of independent _blocks_ (nodes/functions) and state (i.e. data) flows through them. It follows a lot of concepts from functional programming which states that state is immutable and operations are black boxes without side effects. More on flow-based programming later.

![vpl-8](/img/posts/vpl-8.png)

A question pops up though - does it always have to be practical? A rather philosophical question - does visual programming have to make sense? A significant use case of visual programming is to be an outlet for creativity and it has been a playground for wild experiments. The screenshot on the top right in the slide above is an application built in HyperCard which lets you take a tour on a lake with each view having a video shot in a POV style on a boat. You also see a few cards which are supposed to be hyperlinks to other views that change your direction. When you click on one, you see a new video that points in a different direction that before; as if you turned.

Another example on the bottom left is from Reddit where a user created an operating system in Scratch! (!!) Was there a use case for this? No. But they built it because they could and it was fun. Visual programming allows non-programmers (and even programmers) to go beyond the traditional, restricted perspective and try out creative ideas.

Coming back to the practicality of visual programming, let's talk a bit about flow-based programming.

![vpl-9](/img/posts/vpl-9.png)

> FBP is a programming paradigm that defines applications as networks of black box processes, which exchange data across predefined connections by [message passing](https://en.wikipedia.org/wiki/Message_passing "Message passing"), where the connections are specified *externally* to the processes.
>
> _Source: [Wikipedia](https://en.wikipedia.org/wiki/Flow-based_programming)_

![vpl-10](/img/posts/vpl-10.png)

Many visual programming languages follow the flow-based paradigm to execute logic. One interesting outcome is that they become a great way to represent parallel programs! When represented in a visual form, programs often form a directed graph which can be topologically sorted to be executed. Every node waits for all its dependencies to execute, which execute in parallel, and then takes the results and executes itself. There has been some research to build environments to build parallel programs visually because of this characteristic.

My interest in visual programming stems from an old project `unipipe` that I had tried out a few years back. It is a visual environment to build "flows" and has a node-based interface. The 
