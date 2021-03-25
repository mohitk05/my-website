---
title: Starting with a Lexer - in Rust
tags: ['posts', 'pl', 'rust', 'monkey-rust']
description: Building a lexer in Rust, following the book 'Writing an Interpreter'
date: 2021-03-21
coverImage: /img/posts/2021/lexer.jpg
coverImageSize: contain
---

I've picked up the book 'Writing an Interpreter' which is originally written using Go, but I'm attempting to build the language described in the book, _Monkey_, in Rust. In terms of the approach, I believe that getting my hands dirty is the best way ahead. I have been planning about how to start and what to read to get into building programming languages, but actually writing code is the best way to _begin_. And I'm enjoying it!

For a compiler, or an interpreter, the first step is breaking the down the text input containin the source code into meaningful tokens that the parser can understand in the next steps. It is similar to how you or me would understand natural language but generously slowed down. We would break a sentence into words, words into letters and then try to make sense of them. Lexing is the process of meaningfully breaking down the input string into language-understandable tokens.

```
1. Source Code --- Lexer ---> 2. Tokens --- Parser ---> 3. Abstract Syntax Tree
```

These tokens include identifiers, numbers, characters like `+`, `,`, `;` etc. Lexer's job is to identify these tokens and their correct type. This would later help the compiler/interpreter to behave accordingly. Depending on the language you are writing the interpreter for, the list of token types would differ. The book starts with implementing basic tokens and then exteending the lexer to non-trivial ones.

Rust's enum prove to be very powerful while defining the token types. You can define a _variant_ in an enum and also denote the type of value it will hold. E.g. for more generic tokens like identifiers, it is helpful to store the type as well as the value of the token. In other languages, you would be required to save this as a `struct`, like in Go:

```go
// Taken from Writing an Interpreter book
type TokenType string
type Token struct {
    Type TokenType
    Literal string
}
```

In Rust, an enum can be defined as follows:

```rust
enum Token {
    Plus(char),
    Identifier(Vec<char>)
}
```

A variable can be of type `Token::Identifier` and hold a value of type `Vec<char>`. This makes it super userful for defining token types like Identifier itself, as it would include several values, e.g. keywords like `let`, `return`, etc. and variable names, all of which can be represented as a vector of `char`s. Moreover, Rust's `String` type is a bit strict in terms of what all operations you can do on it and how easily you can jump back and forth from String to chars. Hence `Vec<char>` seems to be a better choice here.

Once we have defined our basic token types, the next thing to do would be to write a function that goes over the input source code and identifies the token and its corresponding type. For single character types it is an easy process but for multiple character tokens we would have to do some form of lookahead.

Rust's pattern matching helps us write a `match` block for identifying token types. First, we'd define a `Lexer` struct.

```rust
pub struct Lexer {
    input: Vec<char>,           // Source code
    pub position: usize,        // Reading position
    pub read_position: usize,   // Current moving reading position
    pub ch: char                // Current read character
}
```

Lexer would have a few methods implemented,

```rust
impl Lexer {
    fn new() {}             // Create a new Lexer instance
    pub fn read_char() {}   // Read next char, update positions
    pub fn next_token() {}  // Match the read character and assign appropriate type
}
```

The function `next_token()` is where the real work happens.

```rust
pub fn next_token(&self) {
    match self.ch {
        '=' => {
            tok = token::Token::ASSIGN(self.ch);
        },
        '+' => {
            tok = token::Token::PLUS(self.ch);
        },
        '-' => {
            tok = token::Token::MINUS(self.ch);
        },
        '!' => {
            tok = token::Token::BANG(self.ch);
        },
        ...
        ...
        // Other patterns
    }
    self.read_char();
    tok
}
```

For multi-character tokens, we implement a lookahead loop. We continuously read next characters until and unless we reach a non-identifier token. I've implemented a closure inside the `next_token` function which does this work.

```rust
let read_identifier = |l: &mut Lexer| -> Vec<char> {
    let position = l.position;
    while l.position < l.input.len() && is_letter(l.ch) {
        l.read_char();
    }
    l.input[position..l.position].to_vec()
};
```

There are a few nitty-gritties that need to be handled to make the lexer work and there are a lot of assumptions made here to make the implementation simple. E.g. we only check for integer number values, floating points are ignored as of now, variable names can only have letters and `_`, etc. These are fair assumptions for your first lexer implementation.

As a test, we'll provide a sample Monkey code as input and check what our lexer outputs. The `main` function looks like this:

```rust
fn main() {
    let input = String::from("let a = 5;");
    let mut l = lexer::Lexer::new(input.chars().collect());
    l.read_char();
    loop {
        let token = l.next_token();
        if token == lexer::token::Token::EOF {
            break;
        } else {
            println!("{:?}", token);
        }
    }
}
```

The lexer prints:

```bash
➜  monkey-rust git:(master) ✗ cargo run
   Compiling monkey-rust v0.1.0 (/Users/mohitkarekar/Documents/projects/monkey-rust)
    Finished dev [unoptimized + debuginfo] target(s) in 1.95s
     Running `target/debug/monkey-rust`
LET
IDENT(['a'])
ASSIGN('=')
INT(['5'])
SEMICOLON(';')
```

It works! Lexer prints out the tokens correctly. This is the first step towards parsing, where these tokens will be used to construct an abstract syntax tree (AST). More in the next part.

Link to the GitHub repository: https://github.com/mohitk05/monkey-rust
