---
title: Programming Languages - the first encounter
tags:
  - posts
  - programming-languages
date: 2021-02-23
description: The beauty of languages
---

My fascination for languages roots from my passion and curiosity for building generalised tools. Over the three and a half years of my software engineering career, I've grown interested in building and designing tools that allow fellow developers/people to build. Fortunately, I have got a chance to work on such tools. Some of them are:

-   _a social network_: At TTT, I worked on a social networking platform for writers. A social network, if meticulously built, allows people to build communities and experiment online. By giving a set of features, it is fun to see how different people use them in combinations.
-   _react-insta-stories_: Building component libraries in React places you, the developer of the library, in an interesting position. Intially the library is used for its basic feature, but as users grow, you see it being used in ways that you had never thought of. E.g. one person built a tool to create stories slideshow using `react-insta-stories` by feeding in a Google Slides presentation. I fail to regularly update and respond to issues, but I love it whenever I work on this project.
-   _shaai_: A forgotten side-project that I worked on with Kunal. This allowed people to attach personal blogs to their websites in a simple way. The approach was that you give us the data, you also give us the way you want to show the data and we will display the final thing. The _pluggable_ nature is what I am fascinated to the most. Software abstraction is my favourite topic and this is evident from my choice of side-projects.
-   _apollo at upgrad_: Templating has been the oldest way to make things generic. While building a CMS editor at upGrad, I was amazed by how UI can be derived from data. _Templates_ were essentially black-box abstractions of the rendered page. Data is the state of the page; change the black-box, you have an entirely different outcome.
-   _unipipe_: This has been a project that is close to my heart. While building this, I surfed close to functional programming and how procedures can be 'applied' to get outcomes, and how multiple black-boxes can be connected in various ways to create new black-boxes. This eventually brought me back to SICP, and here I am on a journey.

Languages, in general, are a medium to express thought. The most elegant form of a language is when it can encompass maximum number of possible expressions with minimum albhabet size. Succintness and clarity are also important. Most importantly, languages provide a set of tokens for us to build words, that together build sentences that convey some meaning. This directly translates to the world of programming - languages provide syntax that is used by programmers to build complex software that does powerful things. For quite some time now, I have been fascinated by the part where the language is _designed_.

![Languages](/img/posts/2021/lang1.jpg)

Being [one of my themes for the year 2021](/posts/2021/goals-for-2021), I am beginning to read about language construction and design. My source of inspiration was reading about Lisp in the book Structure and Interpretation of Computer Programs, and then taking the course [Programming Languages]() on Coursera. These introduced me to how good computer programs are written and the thought that goes behind them. So as a continued effort, I am going to read about Lisp as the starting point in my journey in languages. In short, _I'll be building a Lisp_.

Lisp is known for its minimal syntax and functional nature. SICP uses a variant of Lisp known as Scheme. The syntax is really simple to learn and I believe equally simple to implement an interpreter for.

```text
(+ (* 4 5) 10)

// This should output 30. -> (4 * 5) + 10
```

I have decided to pick up SICP as my starting point and read it through. I'll be solving exercises and writing my notes in the [sicp](/posts/pl/sicp) section. Coincidentally, I had started reading SICP almost exactly a year back, and the last commit date is 23rd February 2020! This year, I'll complete it in time, and at a slow yet steady pace. See you on the other side!

References:

-   SICP: https://web.mit.edu/alexmv/6.037/sicp.pdf
-   Videos: https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-001-structure-and-interpretation-of-computer-programs-spring-2005/video-lectures/1a-overview-and-introduction-to-lisp/
-   My solutions: https://github.com/mohitk05/sicp-exercises
