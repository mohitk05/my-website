---
title: Learning Rust - Part 1
date: 2020-03-10
eleventyExcludeFromCollections: true
---

Rust is a compiled, type-strict, performant language that is aimed to build fail-safe applications. After my failed attempt at learning C++, I decided to try it this weekend<!-- excerpt -->. Rust is promising as it opens up a lot of interesting domains for me - system apps, WebAssembly, web servers (also on Raspberry Pi). Hence it is more exciting to learn it over C++. One can learn Rust from the official Rust book available online for free. Let's begin.

## Chapter 1

This chapter describes how to install and get Rust running on your computer. Rust uses `rustup` to install and update the language, hence that is the first thing you download.

To install

```bash
$ curl https://sh.rustup.rs -sSf | sh
```

Check the version by running

```bash
$ rustc --version
```
