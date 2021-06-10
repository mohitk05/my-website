---
title: Essentials of a Lexer
date: 2021-04-25
eleventyExcludeFromCollections: true
---

In the previous post I had started with implementing an interpreter for the Monkey programming language in Rust. The lexer came out to be pretty good, but I was finding it hard to move ahead while trranslating the textbook's examples in Go to Rust. A lesson learnt while choosing languages, while learning something new, choose a confortablee language if you really want to focus on the main topic, or you'd get stuck in the syntax and rules of the language.

Rust has been known for building language tools, but for me, I think it isn't my first choice yet. This is simply because I'm not that fluent with the language, even when I've been on and off with it for almost a year now. It surely fascinates me, but I'll have to give some more time. For now, I'm sticking to the known alternatives. I started writing the interpreter in TypeScript, but then decided to switch my source of learning to the ebook _Crafting Interpreters_.

This is a really good resource with concise explainations for each concept. More importantly, it uses Java and C for implementing two interpreters for the Lox programming language. I'm finding this much more comfortable and easy to go through the tasks as Java is something I'm fairly comfortable with.

The first two chapters talk in general about the structure of interpreters, or how language code is converted to machine readable code, or executed on the fly according to the logic it represents. As I've read through multiple pieces of text, I now understand that there are following key parts of an interpreter:

-   Lexer/Scanner - Converts source string into a set of language-defined tokens
-   Parser - Converts the set of tokens to an abstract syntax tree (AST) representation that denotes the logical representation of the code
-   Optimizer - Optimizes the AST using some known methods
-
