---
title: Concurrency and Parallelism
date: 2023-08-27
description: Notes about these programming constructs that let you use resources to the maximum
tags:
  - posts
  - concurrency
  - programming-languages
eleventyExcludeFromCollections: true
---

I remember watching a [popular talk](https://go.dev/blog/waza-talk) on the Golang website by Rob Pike titled _Concurrency is not Parallelism_ when I knew nothing about both these terms. I had then recently started working with servers, though in Node.js, writing concurrent programs that served several clients. Today, as I take a graduate level intro to operating systems course, I'm being re-introduced to these concepts and I'm grabbing the opportunity to write about them.

Computer programs let you perform a certain piece of logic using the underlying hardware and they abstract a lot that goes on in the background. Simple programs have simple logical flows, they advance sequentially - one line at a time. E.g. this program in C declares a variable and adds 5 to it.

```C
int main() {
	int num = 0;
	num = num + 5;
	return 0;
}
```

To understand what happens when you run the program, I'll introduce the underlying components briefly. Any program has these assigned for its execution:

1. Memory for the program itself: The code instructions are saved in this space.
2. A program counter: Stores the location of the instruction to be executed next.
3. A stack: Stores the order of function calls.
4. A heap: Memory space to store declared and temporary variables and their values.

When a program is executed sequentially, the program counter increments at each execution step. E.g. in the above example, it goes from the memory address for the first line `int num = 0` to the last `return 0` one by one.

Now comes the interesting bit - programs aren't this simple in reality. They involve a lot of other operations that may take variable time to complete. Most common is input/output, popularly known as I/O. I/O involves interacting with hardware devices which may not be prompt to reply immediately. The operating system (which handles program execution and interaction with hardware) often has to wait for responses from the hardware. Let's add this to our example.

```C
int main() {
	int num = 0;
	num = num + 5;
	printf("Number: %d", num);
	return 0;
}
```

The added line prints the value of `num` to the standard output, which is the terminal window that runs this program if executed in a shell. The function writes the bytes to be printed to so-called `stdout` stream, which is then read by the output device. This operation _blocks_ the execution of the program until all the bytes written by the program are read by the output through the `stdout` stream. The program counter will be updated post this and the execution would continue.

Well, `printf` is a very simple example here but you can imagine what other operations may introduce this _blocking_ behaviour. Accepting connections over a socket, sending or receiving data, writing to/reading from a file, etc. are some common ones. A quick example would be a server that reads from a file and responds with the contents of the file. With our sequential model, this server will wait each time it has to read from the file and then move to serving the next request. Practically, this is very limiting.

Along with degraded performance, this model also leads to sub-par use of available resources. While the program waits for something, it is essentially as good as an idle computer. Can we make better use of this wait-time?

## Concurrency (and parallelism?)

Rob Pike defined concurrency as _dealing with a lot of things at the same time_. He differentiates it from parallelism, which is _doing a lot of things at the same time_. Concurrency comes in as a great solution for the problems mentioned in the previous section. Let's take a simple example.

```C
int main() {
	int a = 0, c;
	char *mode = "r";
	FILE *file;
	file = fopen("file.txt", mode);
	while(feof(file)) {
		c = fgetc(file);
		printf("%c", c);
	}
	fclose(file);
}
```

The program opens a file, reads one character at a time and prints it out. The functions `fopen` and `fgetc` are synchronously blocking, meaning they halt the program execution while they execute themselves.

> The basic idea of concurrency is being able to overlap more than one sequential executions by switching among them when possible/necessary.

Concurrency is introduced usually at the programming language or the environment level which makes it possible to write concurrent programs. The basic idea of concurrency is being able to overlap more than one sequential executions by switching among them when possible/necessary. The time during which a program waits for a certain operation to complete is used to execute other sequential operations that can be executed.

Various languages use different ideas to achieve this. I'll talk about the two most popular ones.

### Concurrency using Threads

A thread is
