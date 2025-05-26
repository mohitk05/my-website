---
title: Exploring JavaScript's Explicit Resource Management
description: Exploring the using keyword and a few potential use cases
date: 2025-05-26
tags:
  - javascript
  - web
  - programming-languages
coverImage: /img/covers/using.jpg
---
We might all know that variables in JavaScript (for that matter in most programming languages) are restricted by scope, i.e. they live for the lifetime of a scope. Scopes in JavaScript are defined by `{...}` "braces", anything defined between them lives until the closing brace.

```js
let a = 2;

if(a > 1) {
	let b = 3;
	console.log(b); // 3
} 

console.log(b); // undefined
```

For other higher-level resources you might want to replicate this behaviour to manage resources in your code. E.g. when working with a file handle, you might want to close the handle automatically when the enclosing scope ends. There are such capabilities in other languages:

* `defer` in Go which executes the line of code at the of the enclosing function
* `std::unique_ptr` in C++ provides a similar behaviour for automatic management of memory pointers by tying them to the current scope, as if they were simple variables

The benefit of such management is mainly improved developer experience. You do not have to remember to call a `stream.close()` or `free(ptr)` explicitly at the end of the function body when you are done using the resource.

Additionally, the managed entity need not be a traditional _resource_. When I think of such resources, file handles, streams and pointers are what come to my mind. Essentially these entities could be anything that require some operation at the end of the current scope. One use case that comes to my mind is performance markers and spans.

The [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) proposal has been shipped in Chromium 134 ([Google Chrome v134](https://developer.chrome.com/release-notes/134#explicit_resource_management_async)) and some of the other [implementations](https://github.com/tc39/proposal-explicit-resource-management/issues/242) are in progress. This change adds a way in JavaScript to explicitly manage resources like other programming languages.
## The `using` keyword
When a variable is assigned with `using`, upon the exit of the current scope, the `Symbol.dispose` and the `Symbol.asyncDispose` methods on the variable object are called automatically. These methods can be used to do any cleaning up or closing of acquired resources upon the end of the current scope.

```js
// A global counter - the counter keeps updating until the scope ends
const GLOBAL_COUNTER = {
	value: 0,
	[Symbol.dispose]() {
		console.log("Final count:", this.value);
		this.value = 0;
	}
};

const main = () => {
	using counter = GLOBAL_COUNTER;
    
    const a = Math.random();
    console.log("one", ++counter.value);
    if(a > 0.5) {
        return;
    }

    console.log("two", ++counter.value);
    return;
}
```

The `GLOBAL_COUNTER` object implements the `[Symbol.dispose]()` method which is called by the runtime when the object is initialised with the `using` keyword. The above example shows a common use case where an object is initialised at the start of a function and some operation has to be performed whenever the function returns. In general, the variable can be initialised using `using` at any point in the scope and the runtime will ensure that the dispose method is called when the scope ends.

The dispose function can also be asynchronous, its symbol being `Symbol.asyncDispose` and such an object can be initialised using `await using`.

```js
// A hypothetical async global counter - the dispose method makes a network request
const GLOBAL_COUNTER = {
	value: 0,
	async [Symbol.asyncDispose]() {
		await fetch("/log", {
			method: "POST",
			body: JSON.stringify({
				count
			})
		});
		this.value = 0;
	}
};

const main = async () => {
	await using counter = GLOBAL_COUNTER;
	// ...
}
```

There could be cases where you might want to define multiple variables with `using`. In such cases, it is important to manage dependencies properly and ensure that resources are disposed in a reverse order of dependency. The proposal introduces two data structures for this purpose - `DisposableStack` and `AsyncDisposableStack`. They provide 3 methods:
* `use(disposable)` pushes a disposable value at the top of the stack
* `adopt(nonDisposable, disposableCallback)` pushes a non-disposable value and a disposable callback to the top of the stack. This is similar to pushing a disposable using `use` without creating an object with a `Symbol.dispose` method.
* `defer(disposableCallback)` pushes a disposable callback to the top of the stack. This function will be called when the stack entities are disposed. This is similar to the `defer` keyword in Golang.
## Potential Use Cases
The proposal docs suggest several [use cases](https://github.com/tc39/proposal-explicit-resource-management?tab=readme-ov-file#examples) for this feature. Here are some I believe would be interesting.
### Measuring function execution latency with `using`

Time taken to execute a function could be measured with the `using` keyword by defining a variable that either calls the Performance API methods or uses OpenTelemetry APIs to create and end spans.

```js
class Span {
	private _span;
	constructor(name) {
		this._span = tracer.startSpan(name);
	}

	addAttributes(attrs) {
		this._span.setAttributes(attrs);
	}

	[Symbol.dispose]() {
		this._span.end();
	}
}

const main = () => {
	using span = new Span("main");
	// ...
}

main();
// new span created and ended, latency equals the duration of execution for main
```

---
More interesting use cases will pop up once this gets introduced in Node.js as such a feature on the server side will be very valuable. I will keep updating this post with any other ideas I get or find in the field using explicit resource management.
## References
[JavaScript's New Superpower: Explicit Resource Management](https://v8.dev/features/explicit-resource-management), v8 Blog
[New Disposable APIs in Javascript](https://jonathan-frere.com/posts/disposables-in-javascript/), Jonathan Frere