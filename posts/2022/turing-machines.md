---
title: The Universal Turing Machine
date: 2022-11-20
description: Notes from the Alan Turing chapter in the book 'Tools for Thought'
tags: ['posts', 'programming-languages']
gardenTag: Seedling
---

I am currently reading [Tools for Thought: The History and Future of Mind-expanding Technology](https://www.rheingold.com/texts/tft/01.html#Chap01) by Howard Rheingold. It is a beautiful collection of events and people in history who contributed to the evolution of computer science and our quest to formulate human thought and reasoning.

In the latest chapter, Rheingold talks about Alan Turing - one of the brightest minds of the 20th century whose ideas and research led to the creation of entire fields of study - computer science and artificial intelligence. Turing was a young genius who proposed a theoretical machine that could construct “games” according to the instructions provided to it. The constructs of this machine were quite basic, with an arm moving over a tape made up of several boxes containing one of the two values - X and O. The instructions told the machine to either move the arm left or right, or change the value inside the current box on the tape. According to the instructions, the machine may ultimately reach a state where it has no more next steps and hence would enter a terminating state - the end of the game.

With these design elements in place, one could write a set of instructions to make the machine “behave” in a certain way before reaching the end. One example instruction set could be doubling every X in the input tape. E.g. Let's say we start with a tape with XOOXO, we want XXOOXXO in the end. This would not be as easy as writing a C or JavaScript program considering the constraints, but after about 26 lines of “instructions”, [you can write an instruction set](https://cs.stackexchange.com/questions/106098/turing-machine-which-will-double-every-b-in-all-inputted-string) that does this.

When Turing proved this, the idea was revolutionary. He articulated what Charles Babbage was trying to achieve with his “Analytical Engine”. The idea of a Turing machine is pretty amazing. You can extend it to write other programs. But there will be some programs that the machine will not be able to solve - in its case the moving arm will never reach an end state. Turing proposed another form of a machine - a Universal Turing Machine. It was a machine that could behave in any way as per the instructions that were fed to it. All Universal Turing Machines were physically the same but could perform a variety of operations depending on the instructions that were provided to them.

This idea of a “generalised machine” was ingenious. Even when it was theoretical, it inspired several similar ideas. Initially, a lot of code in computers was written in machine language. Turing machines proved that a new Turing machine could be built to abstract the behaviour of the machine language, giving way to programming that was close to human understandable language. The assembly language was thus born, and then came the first compilers and interpreters. There were Turing machines that operated on different levels of abstraction.

Today’s programming languages are much high-level representations of these machines. Usually, they compile or are interpreted by high-level languages that eventually compile to machine-level language. The interfaces of such languages can vary - some requiring you to write loops while others forcing recursion on you. Today, there’s a rise of tools that have enabled visual programming and that is what interests me a lot. Languages are Turing machines (given they complete the requirements), and there is no limitation on how they should look for the ones who use them. Visual tools are interesting interfaces to convert the concept of languages to a visual representation. One of my previous projects called unipipe tried to do this - provide a visual interface to build logic using basic elements. And now, when I tried building ‘[arepa](https://github.com/mohitk05/arepa)’, a LISP-like language, it felt the same.

[Interface of a machine] makes possible a Turing machine => Transpiles to a lower level Turing machine => Transpiles to a lower level Turing machine => ….. => Machine code

There is a large number of possible abstractions we could have in between until the code is finally translated to machine code. Today, making programming systems have become more accessible, and the easier we can make the interface to these machines, the easier would be the adoption.
