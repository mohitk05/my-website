---
title: Venturing into Rust Land 🤺
coverImage: /img/posts/rust.jpeg
topics: ['rust', 'learning', 'programming language']
date: 2020-03-10
---

Rust is a compiled, type-strict, performant language that is aimed to build fail-safe applications. After my failed attempt at learning C++, I decided to try Rust this weekend<!-- excerpt -->. Rust is promising as it opens up a lot of interesting domains for me - systems programming, WebAssembly, web servers (also on Raspberry Pi). Hence it is more exciting to learn as compared to C++. One can learn Rust from the official Rust book available online for free. Let's begin.

I have been reading the official book for the past couple of weeks and I'll try to note down the important pointers from chapter 1 through 8 here. These chapters mainly introduce you to the syntax, core concepts and inbuilt data structures like arrays, enums and structs. Chapter 7 explains in detail about code organisation and the modules system. The main purpose of listing down these points is to revise whatever I read in these couple of weeks, and for future reference. You may go through these for quick understanding of Rust's syntax and working.

#### #1

Rust uses `rustup` as its toolchain. It makes the process of installing Rust and getting started with it really smooth. It installs all the necessary tools like `rustc` - the Rust compiler, `cargo` - the Rust package manager, and the official Rust docs. It is also useful for future version upgrades.

#### #2

Unlike JavaScript, Rust is a compiled language and hence once something is developed, we create an executable out of our code. Rust is particularly known for its powerful compiler as it wouldn't allow you to make popular mistakes and will simply won't compile your code. I'll speak about this in a point separately.

#### #3

Since Rust is compiled, it requires an entry point to your code. Like C and Java, Rust requires a `main` function which it considers by default as the entry point to your code. We define functions as follows:

```rust
fn square(n: i32) {
    n * n
}
```

Here `fn` is the keyword used to define a function, followed by the function name `square`. If a function expects arguments, each argument should have a type defined for it. Here the argument `n` is of `i32` type. Inside the curly braces `{}` is the function body. In Rust, we have expressions and statements; expressions return some value and statements don't. E.g.

```rust
let a = 3; // This is a statement
a + 2 // This is an expression, returns 5 (Notice that it does not have a semi-colon)
```

The above `square` function returns the square of `n`, and in Rust, by default, the function returns the last expression. Here the function body has only one line and it is an expression. Hence the function returns `n * n` for whatever value `n` holds.

#### #4

Rust is statically typed and has a strong type system. At places, the Rust compiler can infer the type of a variable according to the value stored in it.

```rust
let a: i32 = 3; // a has type i32
let b = 4; // b has inferred type: i32
```

Basic rules of types apply here, like you can add only similar types etc, and if some function expects some type, you cannot pass other typed variable to it.

Immutability is an important feature in Rust. By default, variables are immutable, i.e. you cannot set the value of a variable after it is set once. This is an important factor in memory-safe patterns. To make a variable mutable, you need to explicitly state this.

```rust
let mut b = 1;
let b = 2;
```

Note above that while resetting the value of `b`, we used the `let` keyword again.

#### #5

There is no garbage collector in Rust and this is the most amazing thing I find about it. I was writing about a similar concept in the article [Knowing what changed, really fast](/posts/2020/knowing-what-changed-fast). It is about knowing what depends on what at compile time itself and following a concept of ownership and borrowing.

Before this, let's talk in brief about how memory is allocated. There are two types of data structures used by Rust to allocate memory - the stack and the heap. Stack essentially stores all the variable information and also the memory content in the case of primitive data-types like integers, boolean, floating point numbers, characters, tuples of these types etc. In case of non-primitive data structures like String or structs, the content is stored somewhere on the heap and a pointer to this memory is stored on the stack.

In Rust, it is important that a memory is **owned** by a single owner at any point of time. For example, in case of a String variable, when we assign it some value

```rust
let mut name = String::from("Mohit");
```

Memory is allocated on the heap to store `Mohit`. An entry is pushed on the stack with the pointer to the String `Mohit` on the heap. Variable `name` owns this memory now. When we try to copy this variable into some other variable

```rust
let mut name = String::from("Mohit");
let name_2 = name;
```

One would expect, like it happens in other languages like Java and C, that Rust would create a reference to the same memory and `name_2` will hold this reference. This is partially true for what Rust does in this case. It does create a new entry with a pointer to the same memory on the heap and pushes it to stack, but with this, **it also removes the first reference to the memory which was held by `name`**. Hence if we try to use name after making a copy, the compiler will throw an error.

```rust
let mut name = String::from("Mohit");
let name_2 = name;

println!("{} {}", name, name_2);

// Error: name_2 - value used here after move
```

This prevents `use after free` errors, where two items try to access the same memory and one of them clears the memory since it goes out of scope first, and then the second one tries to use it. These are the common `NullPointerExceptions` in Java.

When passing values to a function, the ownership is passed to the function.

```rust
let s = String::from("Hello");

// Ownership passed to go_to_function, s invalid after this
go_to_function(s);

fn go_to_function(string: String) {
    println!("{}", string);
    // scope of string ends and memory is freed
}
```

This can be pictured as

```bash
ptr     -----> stack ptr -----> heap value
string         s                Hello
```

The second concept is **borrowing**. Whenever we move variables from one place to another, e.g. when we pass them to functions like mentioned above, passing ownership is not always the right option. We might not want the memory to be freed. Instead of passing the values directly to the function, we can pass references to the variables.
