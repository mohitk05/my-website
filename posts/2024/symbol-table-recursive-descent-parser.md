---
title: Implementing a symbol table in a recursive descent parser
date: 2024-08-17
tags:
  - programming-languages
  - tools
---
A symbol table is an important entity in a recursive descent parser that makes semantic analysis and type checking possible in a compiler. The key responsibilities of this structure is to hold variable values, their type definitions and scopes. In many languages, including Gom, scopes are the lifetimes of variables created in those scopes, i.e. when the scope ends, the variable is no longer defined/accessible.

```js
const square = (a) => {
	return a * a;
}

const main = () => {
	let a = square(5);
	console.log(a);
}

main();
```

In the above JavaScript example, there are three scopes: the global scope where the `square` and `main` functions are defined, and `main` is called. Then there are the individual scopes of each function, both of which have the variable `a` but in each function it has it's own value.
## Responsibilities of a symbol table
1. Store variable, function and type definitions
2. Manage scoping

The symbol table can be implemented in multiple ways. In Gom, the symbol table is implemented using a tree data structure, where the root node is the global scope, and all enclosing scopes are children (and children of children and so on..). Let's take an example:

```text
fn print_to_n(n: i8): i8 {
	let i = 0;
	for(; i<n; i = i + 1) {
		io.log(i);
	}
}

fn main() {
	let a = 10;
	print_to_n(a);
}
```
![Symboltable](/img/posts/symboltable.png)
The `SymbolTableNode` class holds references to its children and its parent, denoting the scope hierarchy. Each symbol table node has a value property which is a `Scope` instance that exposes methods to add new variables and types. Following is the TypeScript implementation.

```ts
class SymbolTableNode<T> {
	private children: SymbolTableNode<T>[] = [];
	
	constructor(private name: string, private value: T, private parent?: SymbolTableNode<T>) {}

	addChild(value: SymbolTableNode<T>) {
		this.children.push(value);
	}

	getValue() {
		return this.value;
	}

	getParent() {
		return this.parent;
	}

	getChildren() {
		return this.children;
	}

	getName() {
		return this.name;
	}
}
```

The `scope` object looks as follows:
```ts
class Scope {
	entries: StackEntries = {
		types: {},
		identifiers: {},
	};

	getIdentifier() {}
	getType() {}
}
```

## Writing variables and types
Gom compiler uses a _symbol table writer_ to manage scopes while writing variables and types. It has two crucial methods that handle scoping and make suitable changes to the symbol table tree: `beginScope` and `endScope`. Here's a rough implementation:

```ts
class SymbolTableWriter {
	private currentSymbolTableNode: SymbolTableNode<Scope>;

	constructor() {
		this.currentSymbolTableNode = new SymbolTableNode("root", new Scope());
	}

	beginScope(name: string) {
	    const newSymbolTable = new SymbolTableNode(
	      name,
	      new Scope(),
	      this.currentSymbolTableNode
	    );
	    this.currentSymbolTableNode.addChild(newSymbolTable);
	    this.currentSymbolTableNode = newSymbolTable;
	}

	endScope() {
		const parent = this.currentSymbolTableNode.getParent();
		if (parent) {
			this.currentSymbolTableNode = parent;
		} else {
			throw new Error("SemanticError: Cannot end root scope");
		}
	}

	putType() {}
	putIdentifier() {}
}
```

The `beginScope` method starts a new scope by create a new instance of `SymbolTableNode` and attaching it as a child of the current node. Then it updates the current node to be the new node. This way, any new variables when written using `putIdentifier()`, will be correctly set in the right scope. Similarly, `endScope` only sets the current node to the parent of the previously current node. When semantic analysis ends, the entire symbol table should be ready.
## Reading from the symbol table
For this purpose, a `SymbolTableReader` is used to iterate over the nodes of the symbol table tree. It has similar methods like the writer, but put operations are replaces by recursive get operations.

```ts
class SymbolTableReader {
	private currentSymbolTableNode: SymbolTableNode<Scope>;

	constructor(rootSymbolTableNode: SymbolTableNode<Scope>) {
		this.currentSymbolTableNode = rootSymbolTableNode;
	}

	getIdentifier(name: string) {
	    let currentSymbolTable = this.currentSymbolTableNode;
	    while (currentSymbolTable) {
			const entry = currentSymbolTable.getValue().getIdentifier(name);
		    if (entry) {
				return entry;
		    }
		    const parent = currentSymbolTable.getParent();
		    if (parent) {
			    currentSymbolTable = parent;
		    } else {
			    break;
		    }
	    }
	    return null;
	}

	enterScope(name: string) {
	    const child = this.currentSymbolTable
		  .getChildren()
		  .find((child) => child.getName() === name);
	
	    if (child) {
		    this.currentSymbolTableNode = child;
	    } else {
		    throw new Error(`CodeGen: Scope "${name}" not found`);
	    }
	}

	exitScope() {
		const parent = this.currentSymbolTableNode.getParent();
	    if (parent) {
			this.currentSymbolTableNode = parent;
	    } else {
		    throw new Error("CodeGen: Cannot exit root scope");
	    }
	}
}
```

The `getIdentifer` method iteratively walks up the tree looking for the identifier definition. This takes care of variable shadowing and global variables. The `enterScope` method now takes a name argument and the callee has to specify which scope to enter.

---

The symbol table is constructed during the semantic analysis and then used by type checking and code generation units. You can find the complete implementation of the Gom compiler here:
https://github.com/gom-lang/gom