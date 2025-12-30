---
title: Sum types in Rust and TypeScript - a.k.a. enums/tagged unions
description: How both languages enable algebraic types
date: 2025-12-30
tags:
  - programming-languages
  - compilers
  - rust
  - types
  - typescript
---
Sum data types are a way to denote values that can be of one of many fixed types. They are also called tagged unions and languages implement them in various ways.
## TypeScript
In TypeScript, if you want to type a variable that can be a string or a number, you would use the `|` operator (a.k.a. the union):

```ts
// Strumber can be one of string or number
type Strumber = string | number;
```

The term _sum type_ comes from the world of type theory as the type is a sum `+` of two types, essentially a union. In TypeScript the way to handle such a type is to narrow down the type of the variable using type guards (`if` checks).

```ts
const prettyPrint = (value: Strumber) => {
	if (typeof value === "number") {
		// type narrowed down to number
		console.log("Number:", value);
	} else {
		// type is definitely string
		console.log(value);
	}
}
```

We do this quite often but in large codebases this becomes a pain very quickly. You might have seen this especially in case of errors in `catch` blocks:

```ts
try {
	
} catch(e: unknown) {
	if (e instanceof Error) {
		///
	} else {
		///
	}
}
```

This is because in JavaScript you can throw values of any type and they don't necessarily have to be errors (funny I know). So you end up narrowing the type using multiple checks.

## Rust
I have recently been writing a bit of Rust and they way it handles sum types is slightly different. In Rust, you would define a sum type using an `enum`.

It took some time for me to move from the model of thinking in TypeScript where you build the unitary types first (string, number, other custom types) and then compose them into a sum type using the `|` operator. Rust enums are a bit different as they can simply be multiple variants of a value or they can also hold type information for each of these variants.

```rust
enum Strumber {
    String(String),
    Number(i32),
}
```

Here, we have simply defined an enum which can have two variants and each variant has a `tuple` type with one value. The magic of enums in Rust shines with powerful _pattern matching_. This is what I love about Rust:

```rust
fn pretty_print(value: &Strumber) {
    match &value {
        Strumber::String(s) => {
            println!("String: {:?}", s);
        }
        Strumber::Number(n) => {
            println!("Number: {:?}", n);
        }
    }
}
```

The `match` keyword matches the provided value with the specified branches. This is very similar to the `switch` statement in TypeScript, but it goes beyond and adds the following properties:
* Type narrowing using enum variants: When `Strumber::String(s)` is matched, `s` is for sure a `String`.
* The compiler requires you to match for all variants of the enum. The `_` symbol can be used to match _rest_ of the variants if you do not care about them.
* No `break` statements required, only one branch is matched at a time.
* Matching happens on both shape and value. The [Rust book](https://doc.rust-lang.org/book/ch19-00-patterns.html) lists what _patterns_ can be: Literals, Destructured arrays, enums, structs, or tuples, Variables, Wildcards, Placeholders.
## Can we do the same in TypeScript?
Given TS has a beautiful, extensible type system, can we have a similar syntax? One option is simply to use a `switch` statement. The problem is that TypeScript unions are "types" and not "values" so you cannot use them in `switch` cases.

```ts
type Strumber = string | number;

function prettyPrint(val: Strumber) {
    switch(val) {
        case // cannot access Strumber as a value here
    }
}
```

A common solution is to use a property to store a value that denotes the type of the overall value. For primitives this does not make sense, it's almost as if doing:

```ts
function prettyPrint(val: Strumber) {
    switch(typeof val) {
        case "string":
            console.log("String", val);
            break;
        case "number":
            console.log("Number", val);
            break;
        // The compiler does not complain this
        // even if it is impossible as per types.
        // It correctly assigns the type of `val` as `never`.
        case "object":
            console.log("Object", val);
            break;
    }
}
```

But for complex structures, this does make sense. E.g. when working with an abstract syntax tree, you want to match the kind of the node when implementing a visitor for the tree.

```ts
type BaseNode = Record<string, unknown>; // for simplicity
enum AstNodeKind {
    ImportStatement,
    ForStatement
}
type ImportStatement = {
    kind: AstNodeKind.ImportStatement,
    value: BaseNode
}
type ForStatement = {
    kind: AstNodeKind.ForStatement,
    value: BaseNode
}
type AstNode = ImportStatement | ForStatement;
```

The `kind` property is an enum here and in TS, enums are objects at runtime and hence can be used in a `switch` statement.

```ts
function visit(node: AstNode) {
    switch(node.kind) {
        case AstNodeKind.ImportStatement:
	        // type of node is narrowed to ImportStatement
            console.log(node);
            break;
        case AstNodeKind.ForStatement:
	        // type of node is narrowed to ForStatement
            console.log(node);
            break;
    }
}
```

This is close to the Rust example, not perfect though because of the underlying constraint that TypeScript types are not values at runtime.

Alternatively there is the classic `instanceof` check if you are using OOP. Your values can inherit a base class and then the switch case would match the `instanceof value` to the various classes.

There are several OSS libraries that provide this functionality in a nice syntax (via a function named `match` and extensive pattern matching): [ts-pattern](https://github.com/gvergnaud/ts-pattern) and more recently [Effect](https://effect.website/docs/code-style/pattern-matching/).
## Beauty of sum types
Sum types are very powerful because they enable implementing powerful concepts as primitives. A nice example is for error handling. Rust has a type called `Option` which denotes a value that maybe a valid value or nothing, similar to a nullable in other languages. With enums, Option is simply:

```rust
enum Option<T> {
    Some(T),
    None,
}
```

This is perfect because the value of type Option can either be a `Some()` of type `T` or `None`. Then you can use all the pattern matching here similar to other enums:

```rust
fn print(val: Option<u32>) {
	match(val) {
		Some(num) => {
			println!("Number: {:?}", num);
		}
		None => {
			println!("No value");
		}
	}
}
```

In TypeScript, there is a similar concept - optional values. We can simulate an `Option` type in TypeScript too:

```ts
type None = null;
type Some<T> = T;
type Option<T> = Some<T> | None;

function getValue(key: string): Option<string> {
	return globalMap[key] || null;
}

// similar to simply doing
function getValue(key: string) {
	return globalMap[key] || null;
} // ==> returns string | null
```

