---
title: participle - A Parser Generator for Go
date: 2024-01-30
---

[participle](https://github.com/alecthomas/participle) is a parser generator for Go. Go is a great language for writing compilers/interpreters. Things to consider while choosing a language for writing compilers:

- A garbage-collected language makes everything much easier. You don't have to care about managing memory and can focus on parsing, higher-level data structures.
- The language should have a good type system. Pattern matching helps a lot while parsing.
