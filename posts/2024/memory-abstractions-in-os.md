---
title: Paging - How operating systems abstract memory
date: 2024-08-25
tags:
  - systems
---
An operating system creates an _illusion_ of almost infinite memory to any program that runs on it. While writing a program in any modern programming language, you never care about running out of memory when your program is to be run on modern operating systems. In garbage-collected languages this is handled by the language runtime itself, but even in ones that do not have GC, you could allocate as much memory as possible.

```c
// malloc in C allows you to allocate memory dynamically
char *str = malloc(200);
```

How does the OS do this when ultimately there is a top-limit for how much you can store in the RAM? This is where abstractions come in.

The OS _abstracts_ real memory from the program and provides a way to write programs that can assume the available memory to be much larger than the actual memory in RAM. For some context, whatever memory your program needs during execution, e.g. the objects you create, variables holding values, arrays, maps etc. all are either allocated on the stack or the heap assigned for the process of your program. Both of these components are places on the physical memory (RAM) so that the program can have fast access to data.

The way the OS makes the process believe that there is much more memory available than the real limit, is by using _paging_. The OS creates a _virtual address space_ for each process that's running, meaning each process can access e.g. 0 to 2000 addresses (just for example). These addresses are virtual because they do not directly denote any physical addresses in RAM. Saving a value to address 400 may not actually affect the real 400th address, and this is good because multiple processes can set a value at this address and the OS has to ensure process isolation. Let's see how paging helps.

![paging](/img/posts/paging.jpg)

The OS uses a _page table_ to create a mapping of virtual addresses to the physical ones. Virtual page numbers all exist for any ongoing process, but not all of them necessarily have a memory mapped in the RAM. This is where the illusion of memory comes into picture. The OS manages the physical addresses in the form of _pages_, which are equal-sized sections of memory. Both the virtual and physical memory is divided into pages.

At any point in time, the RAM holds only a subset of all pages and they are swapped in or out of the RAM into the disk as and when a process requests for a particular memory location. The OS uses the disk as an extension of the RAM, using RAM as a "cache" for the disk.

Usually, a virtual address is made up of two parts (higher order and lower order bits): the virtual page frame number + page offset. The page frame number is kind of an index for the list of all pages. The offset is the offset into that particular page. While resolving the actual address for the memory in RAM, the page number has to be translated (using the page table) and the offset is directly applied, i.e. the offset is the same for virtual and physical addresses.

```txt
Virtual address:
   010100 10100
   ______|_____
v. pg no.|offset

Physical address:
     0010 10100
     ____|_____
p. pg no.|offset
```

When a process requests a memory location and there is no corresponding one in the RAM, a _page fault_ occurs which is captured by the OS. It then starts the process of retrieving the page from the disk and loads it into the RAM. If there is not enough space in the RAM, an existing page is evicted (depending on various conditions, e.g. least recently used) and stored on the disk to make space on the RAM.

Paging is the most widely used technique to abstract physical memory details from the applications running on the system.