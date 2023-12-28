---
title: Building a Compiler Frontend
date: 2023-12-26
tags:
  - posts
  - programming-languages
  - systems
description: Construction of a compiler frontend for a small arithmetic expressions language
gardenTag: Seedling
---
A compiler is usually consists of a frontend and a backend that work with each other through intermediate representation (IR). The frontend is responsible for converting the program text in language A (e.g. C, Go, Rust) and convert it into an IR that is understood by the compiler backend. A very popular compiler infrastructure is LLVM and it provides a rich IR language. This is a great tool to build toy compilers (and large-scale as well).

Once the IR is generated, the backend reads the IR and produces machine code for a particular platform (hardware). This separation of frontend and backend allows independent development of both. In this post, I'll focus on the frontend part of the compiler, and later use LLVM tools to use the generated IR to generate executables.

![](/img/posts/compiler-frontend.png)
A compiler frontend majorly consists of three parts:
1. **Lexical Analysis (a.k.a. scanning)**: This part reads the input program text character by character and produces a list of "tokens" that are recognised by the compiler. E.g. a program text `1 + 1;` in an arithmetic expression is converted to `LITERAL(1), OPERATOR(+), LITERAL(1), SEMICOLON`.
2. **Semantic Analysis**: This part receives the tokens from the first part and builds a syntax tree as per the language semantics. E.g. `LITERAL(1), OPERATOR(+), LITERAL(1), SEMICOLON` gets converted into a tree structure as such:
   
   <img src="/img/posts/ast.png" height="300" style="display:block;margin:auto;" >
   
   
3. Making Sense of the Syntax Tree
	1. **_(Option 1)_ Intermediate Code Generation**: This option takes in the syntax tree from part 2 and generates the IR code, similar to how compiled languages are translated to IR.
	2. **_(Option 2)_ Interpreting and executing code**: In this option, the code is executed from the syntax tree. This is similar to how interpreted languages like JavaScript and Python work.

For this session, we'll take the example of a simple language `ccc-lang` and build an interpreter for it. Generation of IR will be discussed in later parts. The language allows writing expressions, assigning variables and declaring and using functions. Since it is _simple_, there are several restrictions as compared to full-fledged languages. Some include:
* Functions are single-lined - the value returned by the line is immediately returned.
* Arithmetic - only addition and subtraction is allowed to limit the complexity of priority. Arithmetic expressions have only two operands. (bigger expressions can be composed though)
* Literals are only integers.

Full implementation: https://github.com/mohitk05/ccc-lang/

Following are some example programs in `ccc-lang`:

```
let a = 1;
print(a);
```

```
let a = 1;
let b = a + 2;
print(b);
```

```
function add(a, b) {
  a + b
}
let a = 1;
let c = 2
let sum = add(a, c);
print(sum);
```

```
function add(a, b) { a + b };

let a = 1;
let c = 3;
let b = add(a, c);
print(b);

function sub(a, b) { a - b };
let d = sub(c, a);
print(d);
```

Structure of the session:

1. We'll first try to build a simple interpreter for addition expressions
2. Then we'll add subtraction
3. We go one step further and introduce variables
4. Let's look at functions? Simple library functions like print
5. User-defined functions (if time permits)

**But you may choose a language of your own to implement!** Here are some for starters:
* A boolean expressions language (e.g. evaluating expressions like `true && false || false || true`)
* An emoji-based language, no more ASCII characters! (e.g. `💃(⚡️)`)
* LISP-like languages (e.g. `(+ 1 2 3)`)
* A pipe-system (e.g. `1 | echo`, `"hey" | reverse | double // prints "yehyeh"`)
## Parser Expression Grammar
We'll be using `pest` - a parser-generator for Rust. It uses PEG to generate parsers automatically. All we have to do later is to then handle the generated parse tree.

Head over to https://pest.rs, we'll try writing some grammar for our first iteration of the language.

## Simple Addition
Addition expressions look like

```
1 + 2 + 3 + ...
```

Let's try statements - "lines in a program".

```
1 + 2;
3 + 2;
4 + 3 + 4;
```