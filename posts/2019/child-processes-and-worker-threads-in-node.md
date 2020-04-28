---
title: Child processes and worker threads in Node
date: 2019-10-15
---

I am currently in the process of implementing a queueing system for asynchronously running long jobs off the main process. This has led to a lot of reading and random article surfing on the<!-- excerpt --> web. I'll try to enlist important points here.

So essentially, JavaScript IS single threaded. I believe this is a well known fact for any JS developer. But, since Node is a JS runtime environment it can do a lot of extra things with JS as it basically runs JavaScript. It can create another process which may run some other JS program, and effectively handle communication between it and the main process. This is a lot of general talking, for a developer like me, this is a bit confusing and leads to several new questions.

_What is a process?_

_How is it different from a thread?_

_Does a new process run in parallel?_

_What's the relation between number of CPU cores and that of processes?_

Node has a package called 'child_process' which provides functions to create child processes.

TBC.
