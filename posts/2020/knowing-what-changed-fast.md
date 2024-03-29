---
title: Knowing what changed, really fast
coverImage: /img/posts/knowing-change-1.jpg
coverImageSize: contain
coverImageHeight: 300px
coverImagePosition: center
date: 2020-03-15
eleventyExcludeFromCollections: true
tags:
    [
        'posts',
        'algorithms',
        'theory',
        'difference',
        'git',
        'react',
        'vue',
        'javascript',
    ]
---

Frontend development landscape has evolved a lot in the past decade, from simple JavaScript, HTML and CSS to complex frameworks and libraries. These have<!-- excerpt --> helped maintaining a solid code structure and visibility in our frontend applications, and in a way have enabled writing logic heavy apps on the frontend. Other than developer friendliness and code organisation, every framework or library presents its own form of optimisation - a way to do stuff faster than it actually is.

The most common area that needs optimisation on the frontend is re-rendering the UI. Re-rendering is a tricky term, do you paint the whole page again? Do you do it in parts? On a higher level, a HTML document is a tree structure which represents the current layout of the page being rendered in the browser window. The most naive approach towards re-rendering is flushing out all the old nodes of the HTML tree and recreating the new ones. This is already very wasteful. A simple text change will lead to a huge tree being rebuilt, along with all the connections being made again, e.g. the event listeners etc. This is a costly affair.

<!-- Hence, many of the frameworks have minimised direct usage of DOM APIs, as they are relatively slower than those on regular objects. Vue and React, and many others, follow the concept of a Virtual DOM. This means that these frameworks main a copy of the actual DOM tree and whenever some change happens, the virtual DOM is affected first. Then a reconciliation runs which brings all the changes from Virtual DOM to the actual DOM. Now since the heavy lifting is delegated to plain old JS objects, one can apply various diffing algorithms and optimisations to speed up the entire process. -->

This has been a classic problem for a long time and I have come across it quite a few times in my tech career. The problem boils down to identifying change between two different states of a single entity. These states could be different in time domain, or space domain or any other domain for that matter. The main question here is **how do we efficiently, quickly and most importantly, correctly calculate what exactly changed when an entity went from one state to another**.

Recently at upGrad, I was working on a feature that would allow moving certain data changes existing on one environment (essentially database) to another environment. Our [marketing website](https://upgrad.com) is built in a data driven way and on top of that we have an inbuilt content management system to enable CRUD operations on the data.

Whenever we have certain data changes that require QA on a larger level, we do them on non-production environment first so that we could replicate every flow. With larger number of such changes happening, each time, post QA, moving this data to production was becoming a hectic task as we had to do it manually. Hence the feature I was building was crucial and would relieve us from several manual data updations. Since this was something new, I went into a full-on research mode and dug up a lot of related material on the internet.

This problem statement wasn't exactly a new one for me. Sometime back, I had come across a similar usecase related to our content management system. As I had mentioned, on our inhouse CMS - we call it Apollo - one could edit page data, create new pages and delete them. But, along with providing these options, we had to limit them on a role basis. Not everyone can create new pages, and obviously not everyone can delete any. So at a higher level, we have people who can edit the data, and people who can review these edits and publish them - a usual CMS flow.

When someone edited some data, the person responsible to publish it had to review the changes and approve only if all of them were valid. Initially we had no way to **review** these changes, most of the changes were made by developers and hence we _trusted_ that these were right. But as non-tech users started making changes on the platform, and the number rose, we needed a more visual way to display these changes so that the reviewer could easily see _what exactly changed_. Our main question had risen again - how do I know the difference between two states of the data related to a single entity?

During the period of my 'research and reading', I recalled this previous instance when I had faced this exact question. After I had considerably read about this topic, I could see myself arriving to a similar conclusion. Through this post I'll try to summarise my learnings:

> Question: **How do you tell the difference between two states of the same entity, and replicate them over to a different entity with same initial state?**

There are two ways to approach this depending on how much prerequisites you have.

## 1. Incremental

This method has its roots in the very implementation of the process that brings about the change in state. As the name suggests, in this method, we keep note of every step that causes a change in the state of an entity. Take an example of a bank account. Our entity here is the account balance and it has a simple, one dimensional state - the value.

| Timeline | Action  | Action Value | Balance | Change                         |
| -------- | ------- | ------------ | ------- | ------------------------------ |
| 1        | Debit   | 500          | 10000   | `type: 'debit', value: 500`    |
| 2        | Credit  | 1000         | 11000   | `type: 'credit', value: 1000`  |
| 3        | Credit  | 800          | 10200   | `type: 'credit', value: 500`   |
| 4        | Enquire | -            | 10200   | `type: 'enquire', value: null` |
| 5        | Debit   | 1000         | 9200    | `type: 'debit', value: 1000`   |
| 6        | Debit   | 500          | 8700    | `type: 'debit', value: 500`    |
| 7        | Credit  | 200          | 8900    | `type: 'credit', value: 200`   |

This example comes to mind firstly because it is very simple to visualise and secondly because I had been part of a team who was responsible to explore microservices architecture at HSBC Technology India. During that time I had come accross various ways to design your system and one of them was an **event-driven** approach.

Since now you have a log of each event that affected the entity in question, the account balance, you can easily get the difference between any two states. E.g. the difference between state 4 and 7 can be calculated as

```bash
Step 4: 10200
Step 5: - 1000  event 1
Step 6: - 500   event 2
Step 7: + 200   event 3
        = 8900

Net change = -1000 + (-500) + 200 = -1300
```

Not always is logging each step necessary, the unit range can be defined as per the use-case. Here, we considered each transaction as one state change, but consider a case of an API that internally carries out some transactions (just an example).

```bash
API: DebitWithCashback
Debit 200 with 10% cashback

API Blackbox
1. Debit 200
2. Credit 20

Net API change:
Debit (Value - 0.1 * Value)
```

Here, you might want to ignore the steps going inside the API blackbox and consider just the net change.

Essentially, this method is benefitial when you do not know of the exact operations that can happen on the entity, and storing each operation so that they can later be replicated is a good option. You can easily slice a portion of the timeline and apply it to the target entity to replicate the changes.

## 2. Direct

This method operates with only the final states and has no knowledge of what happened in the between. Taking our example of account balance, this method swiftly calculates the difference as it directly works with the initial and final value.

```bash
Step 4: 10200
Step 7: 8900
Change = 8900 - 10200 = -1300
```

This isn't straightforward in the case of a complex state, e.g. JSON data. You will have to go to each root level and check if anything changed. There are libraries available that do this and return list of changes between the initial and final state. We can see that the first method would have worked like a charm here. If we knew every change that happened on the JSON data, we could sequentially operate the same on the target JSON.

This method is better when you know the exact operations that can occur on the entity, and you can exactly apply them on the target entity. Or in other case where you have no idea of what has happened to the data, and are directly supplied with the two states.

## The Frontend Scenario

We deviated from our initial topic of discussion - _frontend frameworks_. Various frameworks follow their own way of optimisation. Going through the popular ones out there, I can list down the approaches followed by each one of them.

### React

One of the most popular frameworks out there is React. As most of us would know that it operates on the principle of a virtual DOM - meaning that instead of operating directly on the DOM tree, it operates on a stripped down JavaScript-object like version of the tree first and then moves the changes to the actual DOM. Working with JS objects is no doubt faster than operating on DOM nodes, and React leverages this rightly and provides that necessary performance gain.

One place where React succumbs to repetitive computation is reconciliation. Reconciliation is the process by which React takes the changes from the virtual DOM to the actual DOM, leading to the final UI update. I'll try to explain the way it works:

Whenever a component calls setState from inside itself, the component returns its complete sub-tree according to the new state. This derives its origin from functional programming where the component is seen as a black box, and every state change leads to the new state being fed to the black box, and in return we get the new sub-tree of the component.

```bash
                     +------------------------+
---- x (state) ----> |  f(x) (the component)  | ---- y (sub-tree) ---->
                     +------------------------+
```

The issue here is that when React tries to apply the new sub-tree to the actual DOM, it diffs the complete sub-tree with the DOM and selectively updates the things that changed. We usually see the efficiency of this feature of virtual DOM where only the part that changed gets updated but ignore the fact that it had to compare each and every level of the sub-tree to identify the changed parts when it could have evaluated this from the `setState` statement. `setState` knows what part of the state updated but on re-render, the whole component is re-evaluated irrespective of what part of the state changed.

### Vue

Vue is a very popular framework and gives a tough competition to React in terms of developer adoption and ease of writing code. Vue provides a much easier interface for reactivity. Here, setting a value to a variable triggers re-render, and there is no `setState` like method that has the sole purpose of updating the state. Vue does this by maintaining `getter` and `setter` for each property. Vue's reactivity model can be understood well in the [official docs](https://vuejs.org/v2/guide/reactivity.html), but can be simply put as:

```js
data() {
	return {
		name: 'Mohit'
	}
}

// This internally creates a getter and setter for name
name.getter = () => {
	addAsDependent(callee) // Called only once during init
	return name.value
}
name.setter = (newValue) => {
	name.value = newValue
	notifyWatcher()
}
```

When some property uses `name` in itself, Vue maps that that property depends on `name` and hence must be updated whenever `name` updates.

```js
computed() {
	fullName() {
		return this.name + ' Karekar'
	}
}
```

Here the property `fullName` is added to the list of dependents/subscribers for `name`. Whenever name changes [WIP]
