---
title: Venturing into Rust Land 🤺
coverImage: /img/posts/rust.jpeg
topics: ['rust', 'learning', 'programming language']
description: I started learning Rust, much after giving up on learning C++. It has been an interesting experience and this post is the documentation of whatever I've learnt yet. Rust seems promising and exciting to learn as I move gradually into writing practical code in it.
date: 2020-03-10
---

Rust is a compiled, type-strict, performant language that is aimed to build fail-safe applications. After my failed attempt at learning C++, I decided to try Rust this weekend<!-- excerpt -->. Rust is promising as it opens up a lot of interesting domains for me - systems programming, WebAssembly, web servers (also on Raspberry Pi). Hence it is more exciting to learn as compared to C++. One can learn Rust from the official Rust book available online for free. Let's begin.

I have been reading the official book for the past couple of weeks and I'll try to note down the important pointers from chapter 1 through 8 here. These chapters mainly introduce you to the syntax, core concepts and inbuilt data structures like arrays, enums and structs. Chapter 7 explains in detail about code organisation and the modules system. The main purpose of listing down these points is to revise whatever I read in these couple of weeks, and for future reference. You may go through these for quick understanding of Rust's syntax and working.

## 1

Rust uses `rustup` as its toolchain. It makes the process of installing Rust and getting started with it really smooth. It installs all the necessary tools like `rustc` - the Rust compiler, `cargo` - the Rust package manager, and the official Rust docs. It is also useful for future version upgrades. To download, run

```bash
curl https://sh.rustup.rs -sSf | sh
```

## 2

Unlike JavaScript, Rust is a compiled language and hence once something is developed, we create an executable out of our code. Rust is particularly known for its powerful compiler as it wouldn't allow you to make popular mistakes and will simply won't compile your code. I'll speak about this in a point separately.

## 3

Since Rust is compiled, it requires an entry point to your code. Like C and Java, Rust requires a `main` function which it considers by default as the entry point to your code. We define functions as follows:

```rust
fn square(n: i32) -> i32 {
    n * n
}
```

Here `fn` is the keyword used to define a function, followed by the function name `square`. If a function expects arguments, each argument should have a type defined for it. Here the argument `n` is of `i32` type. Inside the curly braces `{}` is the function body. In Rust, we have expressions and statements; expressions return some value and statements don't. E.g.

```rust
let a = 3; // This is a statement
a + 2 // This is an expression, returns 5 (Notice that it does not have a semi-colon)
```

The above `square` function returns the square of `n`, and in Rust, by default, the function returns the last expression. Here the function body has only one line and it is an expression. Hence the function returns `n * n` for whatever value `n` holds.

## 4

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

## 5

There is no garbage collector in Rust and this is the most amazing thing I find about it. I was writing about a similar concept in the article [Knowing what changed, really fast](/posts/2020/knowing-what-changed-fast). It is about knowing what depends on what at compile time itself and following a concept of ownership and borrowing.

Before this, let's talk in brief about how memory is allocated. There are two types of data structures used by Rust to allocate memory - the stack and the heap. Stack essentially stores all the variable information and also the memory content in the case of primitive data-types like integers, boolean, floating point numbers, characters, tuples of these types etc. In case of non-primitive data structures like String or structs, the content is stored somewhere on the heap and a pointer to this memory is stored on the stack.

Each variable has a scope inside which it is valid, and becomes invalid when the scope ends. E.g.

```rust
fn disp(s: String) {
    println!("{}", s);
    // the function ends here, and so does the scope of the local variable s. After this s is invalid.
}
```

Whenever some variable goes out of scope, Rust calls a `drop` method defined for each variable. This method frees the memory associated with the variable.

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

If we do not want the variable to become invalid, we will have to return it at the end of function and assign it to a new variable so that we can use it after we have called the function.

```rust
let s = String::from("Hello");

// Ownership passed to go_to_function, s invalid after this
let s1 = go_to_function(s);

//Now s1 has the value of s and is valid hereafter

fn go_to_function(string: String) -> String {
    println!("{}", string);
    string // returned back, ownership passed to s1
}
```

The second concept is **borrowing**. Whenever we move variables from one place to another, e.g. when we pass them to functions like mentioned above, passing ownership is not always the right option. We might not want the memory to be freed. Instead of passing the values directly to the function, we can pass references to the variables.

```rust
let s = String::from("Hello");

// Reference to s passed to go_to_function
let s1 = go_to_function(&s);
```

This can be pictured as

```bash
ptr     -----> stack ptr -----> heap value
string         s                Hello
```

When inside the function, after the function ends, the local function variable goes out of scope. But this time, it does not free the memory as it does not have ownership of the memory.

```rust
fn go_to_function(string: &String) -> String {
    println!("{}", string);
    // string goes out of scope but it does not free memory as it did not own the memory
    // Also, we did not have to return anything as we never had the ownership
}

```

## 6

Rust has some compositional data structures built-in, like structs and enums. A `struct` is similar to that in C - a data structure that can hold a set of properties of different data types with each property being named. This makes it flexible enough such that the property can be accessed with the name and order isn't important, unlike tuples.

```rust
struct Person {
    name: String,
    age: i8,
    address: String,
}

// We can create instances of struct by providing right values

let p1 = Person {
    name: String::from("Mohit"),
    age: 25,
    address: String::from("Mumbai, India"),
}
```

For mutability, the entire struct instance has to be mutable.

```rust
let mut p2 = Person {
    name: String::from("Nitish"),
    ..p1 // This adds rest of the values from p1
}

// Possible, because p2 is mutable
p2.name = String::from("Nitu");
```

We can also define methods associated with a struct. For this, we will have to use the `impl` keyword. Each method receives a `&self` reference to the struct instance on which the method is being called. Other function parameters can be added after `&self`.

```rust
struct Person {
    name: String,
    age: i8,
    address: String,
}

impl Person {
    fn display_age(&self) {
        println!("{}", self.age);
    }
}
```

`enum` is used to store a list of items that are possible values of some entity, such that the entity will hold only of those values at a particular time. This is particularly useful at places where there are multiple results/inputs possible and we need a way to group them and operate all of the variations as one. For example, consider we have a multi-user chat room, and we have implemented a function that displays a new message on the terminal. The message to be displayed can be a result of a variety of situations - a new user joined the room, a user left the room, a new room was created, a new message, a message for all users etc.

We want that one single function should display all these types of messages, but each of the message has some different property like `new user joined` has the name of the user to be displayed. `new room created` has name of the room attached to it etc. In short, each message needs to be printed/handled in a different way. Here, creating an enum called `Message` would be very useful.

```rust
enum Message {
    NewUser,
    NewRoom,
    UserLeft
    Broadcast
}

fn display_message(message: &Message) {
    // handle different messages
}
```

Usually, the best way to handle enum types is using the `match` block. It is similar to switch block in other languages.

```rust
fn display_message(message: &Message) {
    match message {
        Message::NewUser => {
            println!("New user: {}", message.name);
        },
        Message::NewRoom => {
            // Specific code
        },
        Message::UserLeft => {
            // Specific code
        },
        Message::Broadcast => {
            // Specific code
        }
    }
}
```

Enums can also hold data, and each item can be of different type.

```rust
enum Message {
    NewUser { id: i32, name: String },
    NewRoom(String),
    UserLeft(String)
    Broadcast(String)
}
```

## 7

There is no `null` data type in Rust. It does not allow the concept of a variable not having any memory as it leads to a lot of problems later. Instead, there is a `Option<T>` enum. This enum can have two values, one if the variable has some value and second if it doesn't have any value.

```rust
enum Option<T> {
    Some(T),
    None
}
```

```rust
fn square(n: Option<i32>) -> Option<i32> {
    match n {
        None => None,
        Some(i) => Some(i * i)
    }
}

let sq = square(Some(2));

// sq will have Some(4)
```

Here, the function square isn't sure if the value sent to it will surely be an `i32`, so it covers the case for `None` by accepting a `Option<i32>`. Inside the body, we match if the value of the argument is `None` or `Some(i32)` and accordingly return.

I personally found this very similar to `Promise` in JavaScript. Whenever we are unsure of the output of some asynchronous function, we return a Promise, which can either resolve or reject according to the output of the async operation.

---

I have been writing this article since a few days and have run through the documentation several times. I may have missed some topics and might even be wrong at some points but I believe this will get better with more Rust. Currently I'm looking into **[Neon](https://neon-bindings.com/docs/intro)**, which provides ways to embed Rust inside Nodejs. It allows you to write native modules in Rust and expose them as JavaScript functions. This can be pretty interesting to speed up parts of your Node app which face performance bottlenecks. I'll document this once I have substantial work done. Till then, keep learning and stay safe!
