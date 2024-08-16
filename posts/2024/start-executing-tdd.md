---
title: Start executing before you complete that TDD
date: 2024-08-16
tags:
  - software-engineering
---
A widely-popular approach to building software at large companies is to create technical design documents (TDDs) that describe the technical design of the solution, the risks, the assumptions and the timeline. While I've seen this work most of the time, recently I have realised that the idea of a TDD varies a lot and it is important to focus on the final goal of the entire effort - building a product/feature/tool/capability.

A typical software design cycle includes a TDD writing phase, which comes after defining the problem statement, i.e. _we have a problem and a target state, now it's time to figure out how to get there._ I'm not sure how very large organisations work, but a popular approach is to take the problem statement, write a TDD, get it peer reviewed and then move to the implementation.

Well, my practical experience has differed from this ideal flow, and it has been either me or the organisation around me that can be blamed. What I've seen at times is that the process of writing a TDD goes on for so long that many are stuck in the _middle_ state of thinking about the solution and then thinking about the solutions to the problems the solution would create. I, now-a-days, call it _engineers turning into philosophers_ (like the term _khayali pulav_ in Hindi which literally means _thought rice_), and I have been a culprit of this doing as well.

I remember an early project at my current organisation when I was supposed to write a TDD (my first one), I prophesied about the solution so much that it went beyond the problem definition and straight into being a moonshot. In the end, the TDD was very big and complex and when I presented this at a review meeting, many were confused about what I wanted to achieve and I received a lot of questions as many concepts that I was suggesting were intangible.

I have seen many engineers define the technical solution so well in the TDD but only move to implementation when they have all the reviews. And I have seen a similar number of TDD reviews not work process-wise because the reviewers could not get the idea or were overwhelmed by the content or just were not the right audience for the review.

Recently, I have realised that writing a high-level technical design document and then moving to a prototype implementation works well for me. I cannot simply _think_ of a solution and then _prophesize_ about it in the form of text and diagrams. I need something tangible to see how the system behaves to input and what it needs to perform the desired behaviour. My cognitive science class last semester taught me that humans make mental models about concepts and one way to understand the concept is to manipulate the model mentally. The more complex the model, the harder is the manipulation. The process can be made easy by _distributing_ the cognition across mediums - paper, documents, graphics, prototypes.

Having a closed loop between the TDD writing phase and implementation has worked well for me. The early implementation provides important feedback that helps to write the TDD in order to add sufficient context for reviewers/readers. Short iteration loops, immediate feedback and applying the learnings back to the TDD make the entire process similar to building a product from scratch, and this works very well.
### How does a team fit into this approach?
The team supposed to implement the feature becomes an early contributor to the TDD. Some senior engineers from the team outline the vision first and present it to the team who then work together to build the first prototype. Ideas are added to the design document, sections are scratched off if they do not make sense practically. The TDD evolves with the prototype and finally takes a somewhat-solid form when everything in scope is considered.

The design is then presented to senior engineers for them to review and since many practical cases have been considered in the prototyping phase, the review is not consumed in base-level things, but rather looks at any genuinely missing pieces. The review turns out to be fruitful and the implementation process can then continue in full-swing.

A key point here is the involvement of the team implementing the solution in the process of writing the design document. If it is only "principals" writing it and pushing it down to engineers to implement, it just does not work well.

How do you you do TDDs? What has worked for you? Let me know in the comments!