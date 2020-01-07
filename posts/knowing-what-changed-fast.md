---
title: Knowing what changed, really fast
coverImage: https://images.unsplash.com/photo-1513171920216-2640b288471b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80
date: 2019-12-12
tags: ['posts', 'theory', 'incomplete']
---

Frontend development landscape has evolved a lot in the past decade, from simple JavaScript, HTML and CSS to complex frameworks and libraries. These have helped maintaining a solid code structure and visibility in our frontend applications, and in a way have enabled writing logic heavy apps on the frontend. Other than developer friendlyness and code organisation, every framework or library presents its own form of optimisation - a way to do stuff faster than it actually is.

The most common area that needs optimisation on the frontend is re-rendering the UI. Re-rendering is a tricky term, do you paint the whole page again? Do you do it in parts? On a higher level, a HTML document is a tree structure which represents the current layout of the page being rendered in the browser window. The most naive approach towards re-rendering is flushing out all the old nodes of the HTML tree and recreating the new ones. This is already very wasteful. A simple text change will lead to a huge tree being rebuilt, along with all the connections being made again, e.g. the event listeners etc. This is a costly affair.

Hence, many of the frameworks have minimised direct usage of DOM APIs, as they are relatively slower than those on regular objects. Vue and React, and many others, follow the concept of a Virtual DOM. This means that these frameworks main a copy of the actual DOM tree and whenever some change happens, the virtual DOM is affected first. Then a reconciliation runs which brings all the changes from Virtual DOM to the actual DOM. Now since the heavy lifting is delegated to plain old JS objects, one can apply various diffing algorithms and optimisations to speed up the entire process.
