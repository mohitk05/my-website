---
title: The Platform Approach
date: 2021-12-28
tags: ['posts', '100DaysOfWriting']
description: Things that run things
coverImage: https://images.unsplash.com/photo-1611849362103-5c99622adf18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80
coverImageSize: cover
---

**_Day 3 of [#100DaysOfWriting](/tags/100DaysOfWriting/)_**

I recently joined Zalando's web framework team in Berlin that works on the web platform and tools used by fellow frontend engineers. I had long been wanting to move into such a role that involves empowering other developers to deliver and build better.

Platform teams, especially in frontend, have become popular in the past few years with frontend becoming much complex that ever. In general, these teams provide _horizontal_ services that every other technology team might require. Web-focused frontend teams might need a platform team if the organisation decides to build a _micro-frontend_ architecture. Or alternatively, if the organisation's business model demands multiple independent applications, a frontend platform team can focus on reducing time to delivery and help developers choose the right workflows and tools.

The core idea of the **_platform approach_** is to separate the _platform_ from the _application_. This can work upto several levels in depth. All the popular web frameworks that we see today are all platforms. They provide us with some means to run our logic. Their levels of abstractions might differ, but ultimately they form a layer over which our code runs.

Usually, when there is a platform, there is a corresponding _syntax_, or a _specific way to build behaviour on the platform_. For example, React has its way of declaring components, it has a lifecycle that one can _hook_ into. Similarly, in case you build a micro-frontend, you'll have to specify ways to develop for the platform. This can be considered close to an _API of the platform_.

**_Platforms provide ways to build absractions._** One of my first encounters with such setups was a project called [`JSONForms`](https://jsonforms.io/). It is a mini-framework to build elaborate forms that are derived from JSON. It has the concept of _renderers_ that match according to the form schema specified (in JSON). So essentially the creators of the project initially created a generic _parser_ that takes in a schema and builds out a form, with the UI elements being sourced via a schema as well. Once they had this ready, they built custom elements over this layer.

**My mini platforms**

I took inspiration from the `JSONForms` project and implemented a similar strucure in one of my open-source projects, [`react-insta-stories`](https://github.com/mohitk05/react-insta-stories). It is a simple React component that allows you to display Instagram like stories on the web.

Initially, I allowed users to send in image/video URLs as props and would display them using `switch` statements, with all the rendering logic inside the component. Something like,

```jsx
function getRenderContent(story) {
    switch(story.type){
        case 'image':
            return <img src={story.url}/>;
        case 'video':
            return <video src={story.url}>;
    }
}
```

This was great, but it limited the scope to images and videos. What if I wanted to display full blown HTML, or some custom video format inside my story? A complex UI like quizes, polls, etc.? It would result in adding implementation for each such UI in the component code.

**Moving to a platform approach.** Last year, I decided to abstract the rendering logic out of the component and give the users the power to choose how they want to display content. The component code now looked more like,

```jsx
function getRenderContent(story) {
	const Renderer = getMatchingRenderer(story);
	return <Renderer story={story} {...otherProps} />;
}

function getMatchingRenderer(story) {
	const probableRenderers = ALL_RENDERERS.filter((r) =>
		r.tester.condition(story)
	);
	probableRenderers.sort((a, b) => b.tester.priority - a.tester.priority);
	return probableRenderers[0];
}
```

The above code allows users of the component to choose what and how they want to render story content. To replicate the existing behaviour for regular images and videos, I went ahead and created some in-built renderers for image and video. Now all previous things worked as expected, and users could also add custom UI to the stories, which opened up lot of possbilities.

**Was this absolutely necessary?** No. But I wanted to do it, and it was simple because it is a personal project. Though it has paved way for easier future maintenance, and super-easy conversion to React Native as the core logic is separated from the UI. But what I want to mention is, through practice, I've learnt that _platforms come with their own complexities._

**_Platforms are complex._** Platforms try to generalise certain things and in a way introduce constraints. This will work well if these constraints are met, but would create a mess if they cause constant hurdles, with users trying to find hacks.

Quite often there are some cases that cannot be fulfilled by platforms. If these cases are important, it means that a platform might not be a solution. Or it could mean that the scope of the platform should be revised. E.g. React as a framework recommends not touching DOM elements yourself, but let it act as a proxy to all DOM manipulation so that it can optimize this process well. This covers a large number of applications in web development, but misses out on a few that React is happy to put out of its scope. One of then is a WYSIWYG text editor. The complex logic of such an editor cannot be fulfilled by a framework that abstracts certain parts of the process, and building it in React would be a forced effort.

**_A platform should be easy to use and extensible._** E.g. if you build a large frontend application, and decide to move to a micro-frontend architecture, but your UI components are still scattered and are locally styled, this might not be the best time to build a platform. Users of your micro-frontend platform will try replicating UI in their, now segregated components, and will create an update nigtmare if you decide to rebrand your organisation.

Simplicty is key in software engineering, as it is in real world. In the end, we are all building platforms for varied set of users, and that's the fun in engineering.

> This post was intended to be philosophical, but turned out to be quite technical.
