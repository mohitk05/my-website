---
title: Starting points in software tooling
date: 2024-08-15
description: Why starting points in software tooling onboarding are important
tags:
  - tools
  - software-engineering
---
<style>
.content img {
	max-width: 100%;
	width: 100%;
}
</style>

Any software product that tries to ease the life of software engineers should provide good _starting points_ for their users. And I'm not just talking about websites or applications, I also mean code libraries and internal tooling. Recently at work we had to onboard many engineers on a new load testing tool - some of them were coming from an old tool, some completely new to the concept of load testing.

To provide some context, at Zalando we've been building a load testing capability using open source [Grafana k6](https://grafana.com/docs/k6/latest/) (more about that in a separate article later), a modern load testing tool. Previously, we were using a very UI-based tool that many were not fans of, and even when Grafana k6 was a good news, we had to go through the process of _onboarding_. Bringing new users on board is a pressing problem many product owners face regularly and they invest heavily into making the process easy. Software tooling usually does not see such investment often, unless your organisation has realised the importance of platform engineering (treating your platforms as products).

Well, if you haven't thought of it already, you should empathise with your new users while building a software product. A software product can be a CLI tool, a dependency, an internal platform, a custom resource, an API definition or even a project at your organisation. Any entity which will be used/worked on by _new_ people, is a product. Consider a technical design document. It's a product! An internal event-streaming platform. That's a product!

What we built with Grafana k6 is also a software product, our core users being engineers wanting to load test their systems. One has to write test scripts to work with k6. In order to make it as easy as possible, empathising with the engineers writing these scripts was important. Hence we introduced a set of **starting points**. I tend to imagine them as Tetris blocks. The platform is a roughly aligned base, and the engineers (coming in with their own context and idea of how things work) trying to fit into the platform. If you align the platform closely with the context your users already have, it will work out well!

![Tetris](/img/posts/tetris.jpg)
## Examples of starting points
The load testing initiative has one group of engineers who lead the testing (they define the test plan and execute the test) and another group of engineers who contribute to test scenarios. This group is generally comprised of people from various teams in the organisation and hence the contribution is fairly distributed. My team owns the test execution bit and we support with scenario authoring. We did the following things prior to onboarding people on the tooling, mainly focusing on authoring scenarios.

### Boilerplate code
Engineers contributing to the test scripts were supposed to create their own directories to place their scripts in a central repository. We created these directories for them already and assigned proper ownership using GitHub's CODEOWNERS workflow. This seems like a small step, but it's one less for the new users.

### Codegen utilities
We created a few code generation utilities that would automate a good chunk of the process by reading some input and generating part of the test script automatically. This would have made sense any way, but providing this during onboarding helps reduce adoption barriers.

### Small framework layer
We introduced a bunch of utility functions for engineers writing test scenarios. These covered several common use cases like adding default headers, extracting items from a HTML response, authenticating a user, getting a random product (in case of Zalando) and user. These utilities fully support underlying k6 APIs and allow overrides. Reducing the exposure of technical complexities, while allowing customisation is key to a successful product in the long term.

### Good practices as type checks and lint rules
We realised sharing "best practices" does not work well. The main problem is discovery, and once discovered, the implementation. Correct typing and lint checks automatically enforce a certain desired style. For example, we separate k6 execution from the test logic so we expected the test scripts to not have the k6 `options` named export as we add it during the execution phase. This helps keeping the scripts independent of configuration. We added a custom lint rule to detect this and disallow commit and PR merges.
Similarly, we found that k6 has a performance regression if there are several HTTP URLs to which requests are sent (consider a URL with a randomly generated query param). The fix is adding a `name` tag for all such requests. We added this to the list of best practices, but realised it was best solved through strict typing.

### Documentation and tutorials
I talk about this last because they are implicit efforts put into making it easy for new users to use the product. We usually use the product first and then refer to the documentation when something does not work out. The previous points help your user to get started, even if that means being able to run 10% of the features. Tutorials are the most important form of documentation. As a new user, I'd like to see common cases being explained step by step. This is what we did for engineers writing scripts - we provided a guide to writing their first script. Apart from this, we included a glossary to explain commonly used terms in the documentation. 

---
Starting points are like hooks people can attach to and enjoy a smooth onboarding. They have been talked at length in the product and UX community, this was my reflection on the software side of it. Consider whatever you build to be used by other people as a product, empathising with your users will help elevate their experience and the adoption of your tool.