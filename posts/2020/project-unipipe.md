---
title: A Side Project - unipipe
date: 2020-08-30
description: A side-project I started to create a tool to build workflows. Did not quite get through to the end of it, am trying to generalize it to solve a simple problem.
---

As I write this piece, I have already mentally decided to redo the current version of `unipipe` which works really well but fails to do one single thing that would be crucial for it to succeed. I am creating this post so that the ideas that went behind creating the first version don't just disappear but stay written somewhere. That's the essence of creating and logging, the end product might be very different than what you thought initially.

## Foundations

I started working on unipipe almost a couple of months back but mostly did not work for a large gap of time in between. So mostly around a month's time (all of what I could squeeze out of my schedule) has gone into building this till date.

The idea came to me while there was a lot of migration work going on at work. We were making changes to our APIs to support a new mobile client and a lot of data had to be migrated for supporting this. Usually, the data to be migrated had to be run through a transformer function in order to make certain changes. Most of the time the data source changed, and a few times I had to add a few functions after the transformer function. I felt that it would be great to have a workflow builder that could allow me to define a particular flow and then easily add or remove parts from it. This became the starting point for unipipe.

I wanted to build a tool that would allow you to create and save flows so that you can easily and quickly get things done. The most important part of it was that the elements constituting the flow would be similar to black boxes - they will have an interface defined and could be implemented in any way possible.

The idea was also inspired by Lambda Calculus, something I had been frequently reading about and found very interesting. It is a simple yet powerful idea to define functions in computer science. Let's take a quick detour to know a little bit more.

## Lambda Calculus and it's Magic ✨

Lambda Calculus sees functions in a computer science perspective. There are two peculiar things about functions here:

-   Functions are black boxes that take certain inputs and give out certain outputs. What goes on inside them is unknown to the external world.
-   Functions are stateless or pure, they have no context between any two executions.

---

Update December 2020
I had pitched this idea at upGrad's hackathon and it got selected for the final round! Me and my team built this product to completion.

Topological Sort - use case in deciding order of execution.
