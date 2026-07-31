---
title: It's an exciting time to be part of a platform team
date: 2026-06-22
tags:
  - platform-engineering
  - software-engineering
  - artificial-intelligence
  - llms
  - systems
description: "Opinion: Why I think good platforms are more important now than ever before and how it connects to what we do in Client Foundations at Zalando"
---
>_I published this post internally at Zalando, this is a public-facing version of the same. I am part of the Client Foundations (CF) organisation which owns platforms, infrastructure and tooling for everything around web and mobile clients. We enable engineers at Zalando to ship customer-facing features fast and reliably._ 

I recently came across a book recommendation in a video interview by The Pragmatic Engineer - [CI/CD with Robert Erez](https://www.youtube.com/watch?v=2x0eq5oDOJY) - where Erez talks about [The Phoenix Project](https://www.amazon.de/-/en/Phoenix-Project-DevOps-Helping-Business/dp/0988262592), a book about improving IT/devops processes written in a novel-like style. I haven’t read the book yet but I managed to read up on some summaries and one of the key ideas it shares is the concept of the [Three Ways](https://itrevolution.com/articles/the-three-ways-principles-underpinning-devops/).

_**The First Way**: Flow/Systems Thinking  
**The Second Way**: Amplify Feedback Loops  
**The Third Way**: Culture of Continual Experimentation and Learning_

If you’ve read the book, you might know better, but the widely available summaries also do a good enough job of explaining what the book is talking about. I was deeply fascinated by the Second Way - amplify feedback loops - because I see it as a common theme across what we have been doing as a department focused on client platforms, and also because it has become even more important with all the news in agentic development.

![feedback-loop.png](/img/posts/feedback-loop.png)

The Second Way talks about amplifying and shortening feedback loops, i.e. moving learnings closer to the point of change. In a builder’s development lifecycle, this may mean feedback from a change they just deployed - did my change break an experience for the users? How fast is the app now that I merged my change? How does it look for a user on iPhone 15? How are the performance metrics looking?

Or it may mean feedback from a change they are actively working on - how can I quickly preview my changes? How do I verify before merging to main? Does my change affect other features? A feedback loop - the time between making a change and being able to reason about it - when short, makes the development/deployment process smooth and productive for a builder.

Now if you think about it - as client platform teams we’ve been building products to shorten feedback loops since the very beginning! Take the cookie-based pull request deployment previews in Fashion Store web[^1]. Adding an extra cookie to a [www.zalando.de](http://www.zalando.de/) webpage instantly loads a PR build for anyone to review and test. Another example is the debug menu in mobile apps - a quick toggle switch and you are part of a flow behind a feature toggle. We consider these features as obvious, but they add immense value to the feedback loop by bringing learnings closer to the builder.

Larger initiatives like Dynamic Page System[^2] and Project Hermes[^3] have also targeted the same problem - how can we make it easier for feature teams to iterate faster. The idea of Testing in Production stems from not having to maintain a staging environment and safely iterate quickly in production - something tech giants have mastered for very long.

If you look outside CF, the Zalando cloud platform is an exceptional example of how a good platform shortens feedback loops. The data platform is another such example - Nakadi event streaming and Databricks are seamlessly integrated to make data engineering and analytics easier.

With agentic engineering and development, feedback loops become even more important. We have solved (with an asterisk) the problem of writing code, but if we don’t solve the problem of verifying/benchmarking it, we will soon end up in either of the two states:

- development continues at fast speed, verification/feedback becomes a bottleneck leading to slower iterations
- development continues at fast speed, verification/feedback is ignored as it is too slow leading to defects and a drop in reliability of the product

Both of these are not a great state to be in. What the industry has realised is that teams and platforms that already had good operations set up for faster feedback now excel in the agentic era, while those who did not are slowed-down significantly due to the overwhelming throughput.

There is good news here though: this is a fun problem to solve and produces incredible impact! I feel now is a great time to be working on a platform, either client, cloud, data - because that is where the bottleneck is. I believe we, in Client Foundations, should take all the learnings from established platforms and actively identify and mitigate things that lengthen the feedback loop for engineers building client-facing experiences. 

Some of these areas are already being worked upon and could look like:

- The mobile _developer app_ provides a quick way to build new experiences and preview them
- Over-the-air updates provide a way to quickly ship changes to paying customers and gather feedback. A capability to preview a new OTA release on your device also lets you verify your changes before shipping to production.
- Test results and coverage are highlighted on each step run and uploaded to CI/CD’s test results to show coverage per team
- (future?) Mobile performance metrics are available for experimentation
- (future?) Automated release process for mobile apps

This brings me to my second point - how do we provide feedback to ourselves and our users (builders)? Feedback loops can be of two types when you talk about them in CF’s context:

1. You are a builder and want to quickly understand how your feature is doing
2. You are part of Client Foundations and want to understand what to build for your users or how the platform is doing

In 1, CF should provide a feature-rich client platform that integrates with existing Zalando platforms (e.g. experimentation, deployments, observability) and collates data from various sources to provide a holistic view of “how a feature is doing”. In 2, CF should hook into various data sources to track metrics around developer productivity (DORA) and implement mechanisms to gather feedback autonomously (in addition to actually talking to users). A common theme is CF should work with data to shorten the feedback loop for builders and itself.

Data is crucial for providing feedback and so is data collection and plumbing. To build a better client platform, we in CF should know where the right data exists and provide ways to show/use it in the best way possible. Take an example of DORA metrics - they are centrally provided by the platform infra team. What if you need a metric that is not directly available? Where do you find the existing data? How do you connect new data sources? Knowing how this works at Zalando would make a significant difference while solving such problems.

I believe knowing your way around and working with data is becoming a significant part of software engineering. It was already in a way with operational data with OpenTelemetry and service observability - you used operational health data to learn about your services/products and decide what to change to make them better. Similarly, it is becoming more important to understand how your product/platform is doing in general and incorporate those results into your planning.

These are interesting times to be working on a platform!

---

Some related reads/videos:

[Software engineering at the tipping point](https://www.youtube.com/watch?v=2n41YjR5QfU)
[David Cramer (co-founder of Sentry) talks about Designing for agents](https://x.com/zeeg/status/2067386142375514354)
[Improving deployment safety net: CloudFormation Dry Runs in CDP](https://zlife.zalando.net/pages/fbb9cb98-b775-4063-9255-f12a347f750d/apps/blog/1a485c89-d8ab-4b65-9dc5-c5b094b86a68/view/7c571091-431e-4eb1-8506-2d25353ee079)  
[The Platform and Program Split at Uber](https://newsletter.pragmaticengineer.com/p/program-platform-split-uber)  
[Mobile Platform Teams](https://blog.pragmaticengineer.com/mobile-platform-teams/)

[^1]: We do not have test or staging environment for web at Zalando, instead each pull request gets its own deployment preview, similar to how Vercel and many other platforms do it.

[^2]: Internal name for server-driven UI capability

[^3]: Internal name for the initiative to move to React Native on mobile


