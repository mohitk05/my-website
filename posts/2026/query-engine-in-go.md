---
title: "E-book: How Query Engines Work"
description: Building a query engine in Go following the book "How Query Engines Work"
date: 2026-05-14
tags:
  - compilers
  - sql
  - systems
eleventyExcludeFromCollections: true
---

Query engines are like interpreters - they interpret SQL commands and execute them on a dataset. In a way, they are specialised interpreters.

Pipeline:
Parsing → Planning → Optimization → Execution
https://howqueryengineswork.com/01-what-is-a-query-engine.html#a-concrete-example

![qengine-example.png](/img/posts/qengine-example.png)
