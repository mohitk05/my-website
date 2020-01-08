---
title: Learning C++
date: 2019-09-06
---

For a long time, I wanted to learn a strictly typed, high performance language which runs close to machine code. During my school days, **C** was one of the first languages I was introduced to, and it was unusual to have it during my 7th grade. I had absolutely loved writing short programs that would let you interact with the terminal and process some numbers. **C** was there again during my first year of college, with somewhat advanced concepts like pointers and data structures. I had always been familiar and comfortable with C type syntax and hence learning other languages like Java and JavaScript wasn't a big deal.

Learning JS was like eating candy, though.

JavaScript makes everything so easy that you get hooked to it. During recent times, each time I have tried implementing something in a different language, I have resorted back to JavaScript as it was much more easier to build the same stuff there! NodeJS APIs are so simple, they are kind of a disadvantage, personally. I wanted to get out of my comfort zone and try out something for real, after failed attempts at Go. Since I love computer graphics, and each time I read anything about it there's a link to a C++ code, it became my first choice. So here I am, a voyager away from home, entering unknown waters, documenting whatever I come across. I'll be following the tutorials on [learncpp.com](https://learncpp.com) and writing down whatever I learn here.

**Day 1**

Tried out the command line compilation process for a few programs and then moved to an IDE. Xcode itself is a good environment for C++ in Mac. The initial tutorials explain about how C++ code is compiled to machine code and what all steps are there in the process. Like other compiled languages, an object file is created after compiling. Compiler also checks for compile time errors and later on a linker links all the dependencies.

The core C++ library is very light and contains only basic functions, but there is a more rich C++ standard library which is used in almost every program in some way or other. The basic hello world program in C++ looks like this

```cpp
#include <iostream>
int main() {
    std::cout << "Hello, World!\n";
    return 0;
}
```

iostream is one of the parts of the standard library which lets you write to the screen and read from the keyboard, the basic IO. There is a main function which is picked up whenever the program is executed.
