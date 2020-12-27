---
title: Concurrency and Parallelism
date: 2020-12-12
eleventyExcludeFromCollections: true
---

Having majorly worked with JavaScript, concurrency to me is an exciting construct. With NodeJS, it has become possible to write highly concurrent applications, and I was initially amazed when I read the way Node handles this. I wanted to learn more about how one can implement parallel programs that leverage the availability of multi-core CPUs to reduce latencies in web applications.

I had previously worked on Java and it has a concept of threads to handle such situations. Again, at that point in time, I wasn't exactly aware of what threads were exactly, or how they allowed programs to run in parallel. Almost a year back I had watched a video which was linked in Golang's documentation - it was about concurrency and parallelism and how these concepts differed. This was a good introduction to what these terms meant, and I could see where these applied to in terms of real-world software.

Currently, I am taking a course on Coursera about parallel programming. This has opened up various topics and I can now connect the dots with the sparse knowledge that I gained in this area previously. Just as a disclaimer, these are my notes about what I understand about this topic and you are welcome to bash at me in the comments if I am incorrect at places.

## Parallelism

To run programs in parallel literaly means to execute them simultaneously. This though is only possible when your system has a multi-core CPU, because to run two things simultaneously we must have separate CPUs. Let's assume a real world example - a cookie eating competition. There are 2 rows of cookies lined up and your job is to finish all of them. Assume that there are no side-effects of eating so many of them 🤐

With parallelism, you get to call your friend into the competition and both of you could try eating all the cookies. When the timer starts you start munching on row 1 and your friend on row 2. You both are eating them simultaneously and this is what parallelism is. You and your friend are the CPU cores and the cookies are programs to be 'run'. Note that you needed an extra person to make this possible. Parallelism is hence more of a system or runtime level concept, if there's an extra contributor, you are good to go.

![Parallel](/img/posts/parallel.jpeg)

Languages usually provide an interface to execute code in parallel via threads. Threads can be of various types depending on the N:M mapping, N being the number of threads that can be created in the program and M being the corresponding OS threads created to handle the N program threads.

Parallelism is an interesting way to double up your performance, but it isn't usually under the control of programmers. Languages provide layers above actual parallel execution so that our code runs efficiently. A more interesting and tweakable construct for programmers is concurrency.

## Concurrency

Concurrency is a way to do more than one tasks 'together'. This is more of a way to write software that allows such a pattern. Concurrent programs can take advantage of parallelism under the hood, but they usually solve a generalised problem of acheiving 'perceived' parallelism using a lesser number of CPU cores than the number of tasks that appear to run _together_. For example, Go's concurrency model allows you to run tasks together using `goroutines`. These are light-weight threads, which do not directly map to OS threads.

In JavaScript, concurrency is acheived by using external data structures. Most of JS runtimes have a queue and event loop implementation which allow the _asynchronous_ nature of JavaScript, which originally is single threaded. Hence Nodejs is so popular - its high concurrency, non-blocking IO is a perfect fit for web servers.

In Java, threads are a way to create concurrent tasks. These have been known to be memory intensive and difficult to manage in regular applications.

![Concurrent](/img/posts/concurrent.jpeg)

Concurrency as a pattern has been present in operating systems almost since their inception. Operating Systems are essentially programs that have to manage and run multiple tasks together and they have to be perfect while doing this. OSs have had a concept of _time sharing_ which, as the name suggests, is a way to share execution time between various tasks. I remember my days at HSBC where I worked with Mainframes, as appalled I was with the arcane technology, it actually made me aware of low level systems. During this time I had read about time sharing, a fantastic approach to acheive concurrency.

Simply put, if there are 10 tasks to be run by the OS simultaneously, instead of running them one by one, or expecting to have 10 cores to execute them parallely, the OS smartly divides its execution time over these 10 tasks. It executes a part of the first task, pauses the execution and then moves to the second task to do the same. This is done for all the tasks until completion.

If noticed carefully, this is very similar to Node's event loop. Concurrency is acheived by dividing sequential tasks into small chunks and executing these chunks one by one to appear as if all of the tasks are being executed _together_.

Generally, programming languages provide a higher level API to obtain concurrency.
