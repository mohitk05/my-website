---
title: Writing a fast B+Tree in TypeScript - Part 1
description: About B+trees and implementing them in TypeScript
date: 2025-04-21
tags:
  - systems
  - databases
  - data-structures
---

B+Trees are central to database systems - they allow creating fast, space-optimised indexes that enable quick access and range queries over data. The core problem they solve is of a _sorted index_ - used to store data such that it can be queried quickly and on-demand which is especially useful when data is stored on disk. An index helps in locating where the data is stored and then only loading that part of the disk (called a _page_) in memory to read.

A database stores data in form of tuples that hold values corresponding to a _row_. These tuples are stored in files, organised into so-called _pages_ which are fixed in size and located on the disk. When querying data, an index helps in quickly locating _where_ to look for the queried data in the pages on the disk rather than having to read the data in all the pages, which would require reading them from disk into memory (a costly operation). B-trees have been used since early 1970s to create indexes in a space-efficient way and over time were improved and variations were developed. B+trees are a special form of B-trees (read as _B trees_ and not _B minus trees_) and I've listed their characteristics below.

## Characteristics of a B+Tree

- **Inner nodes and leaf nodes**: All key-value pairs are located in the leaf nodes. Inner nodes only hold keys and pointers to child nodes. Each leaf node also has a reference to its sibling leaf node to access range values across multiple lead nodes.
- **Self-balancing**: The structure remains balanced on modification, i.e. all leaf nodes are at the same depth from the root always.
- **Sorted**: Keys stored in the tree are sorted to allow range queries.
- **High fan-out**: Each node of a B+Tree has a large number of children, keeping the height of the tree small. This makes finding a node fast.

## Implementing in TypeScript

As part of [CS6422](https://omscs.gatech.edu/cs-6422-database-system-implementation), I implemented a B+Tree in C++ with a full buffer manager that manages slotted pages in memory. With TypeScript, I want to implement an in-memory B+Tree to begin with to focus on the core functionality of the data structure. At the end of this, we'll have a working in-memory sorted index ready to be used in browser/Node.js environments.

### Node classes

Let's start first with the two node classes - inner and leaf. To compose code well, we'll introduce a base class called `BaseNode`, and to make things simple only implement the tree for keys and values of type `number`.

```ts
class BaseNode {
  // level in the tree
  level: number;
  // number of children
  count: number;

  constructor(level: number, count: number) {
    this.level = level;
    this.count = count;
  }

  isLeaf() {
    return this.level === 0;
  }
}
```

`InnerNode` and `LeafNode` can then be extended from the base node class.

```ts
export class InnerNode extends BaseNode {
  static capacity = 10;
  keys: number[] = [];
  children: BaseNode[] = [];

  constructor() {
    super(0, 0);
  }
}

export class LeafNode extends BaseNode {
  static capacity = 10;
  keys: number[] = [];
  values: number[] = [];

  constructor() {
    super(0, 0);
  }
}
```

The inner node holds keys and children where size of keys is one less than that of the children. For leaf nodes, the keys and values arrays are of equal size. The `capacity` property determines the number of keys/children a node can hold and ultimately the amount of fan-out in the tree.

Now, let's create a class `BPTree` to hold the tree methods. We'll have 3 crucial methods to implement: `insert`, `lookup`, `erase`.

```ts
export class BPTree {
  root: BaseNode | null = null;

  constructor() {}

  insert(key: number, value: number) {}

  lookup(key: number): number | null {
    return null;
  }

  erase(key: number) {}
}
```

### `insert(key: number, value: number)`

Inserting a key-value pair in the tree involves the following:

- _Searching for the right leaf node to insert the key_. This depends on the key and how nodes are structure in the tree during insertion. While inserting, we want to ensure that the keys in the leaf nodes are in order and the tree is always balanced.
- _If insertion results in an imbalance, restructure the tree_. When a leaf/inner node fills beyond its configured capacity, it must be split up into two nodes, each having one half of the original node's keys.
  - For a leaf node: Splitting a leaf would result in two leaf nodes and the first key of the new node will be sent to the parent node to be inserted to point to the right child. In case the node was the root, a new root node is created.
  - For an inner node: Splitting would result in two inner nodes and the key in the middle would be sent to the parent.

Implementing this logic give us the following:

```ts
class BPTree {
  insert(key: number, value: number) {
    /*
      If root is null, assign a new leaf node as root,
      set key and value
    */
    if (!this.root) {
      const leaf = new LeafNode();
      leaf.keys[0] = key;
      leaf.values[0] = value;
      leaf.count = 1;

      this.root = leaf;
      return;
    }

    /*
      Call _insert() with the root. This internal function
      will take care of inserting the key-value and return
      a new BaseNode and separatorKey in case the insertion
      resulted in a node split.
    */
    const result = this._insert(this.root, key, value);
    if (result) {
      /*
        If result is not null, a node split occured in the tree
        and has bubbled up the root node. Split the root node.
      */
      const newRoot = new InnerNode();
      newRoot.count = 2;
      newRoot.children = [this.root, result.node];
      newRoot.keys[0] = result.separatorKey;
      // Increment level each time the root is split
      newRoot.level = this.root.level + 1;

      this.root = newRoot;
    }
  }

  /*
    TODO: Implement _insert() which actually inserts the pair
  */
  private _insert(
    node: BaseNode,
    key: number,
    value: number
  ): { node: BaseNode; separatorKey: KeyT } | null {}
}
```

Let's look at the `_insert()` method now. We have two cases to handle depending on the type of the node: leaf vs inner.

```ts
class BPTree {
  private _insert(
    node: BaseNode,
    key: number,
    value: number
  ): { node: BaseNode; separatorKey: KeyT } | null {
    if (node.isLeaf()) {
      // TODO
    } else {
      // TODO
    }
  }
}
```

In case of a leaf node, we update a key if it's already present in the tree, else we insert the key and value at the right sorted position. After insertion, we check if the size of the keys array has exceeded the maximum capacity and proceed to do a node split.

Similarly, in case of an inner node, we find the right position for the key to be inserted. It would be right before an existing key which is just greater than the new key to ensure they remain sorted. For children, we want to ensure that they point to the right child for each "key range". E.g. keys `[1, 2, 3]` and children `[a, b, c, d]` (children length is always one more than that of keys) denote the following relationship:

```txt
Keys:		   1     2     3
Children:	a     b     c     d
```

If the new key is < 1, the insertion should continue to node `a`, if it is >= 1 it should go to node `b` and so on for all keys.

<pre class="mermaid">
  graph TD;
      k1((1))-- key lt 1 -->a;
      k1-- key gte 1 -->b;
      k2((2))-- key lt 2 -->b;
      k2-- key gte 2 -->c;
      k3((3))-- key lt 3 -->c;
      k3-- key gte 3 -->d;
</pre>

Implementing this would give us:

```ts
if (node.isLeaf()) {
  const leafNode = node as LeafNode;
  const index = leafNode.keys.indexOf(key);
  if (index !== -1) {
    leafNode.values[index] = value;
  } else {
    leafNode.keys.push(key);
    leafNode.values.push(value);
    leafNode.count++;
  }

  if (leafNode.keys.length <= LeafNode.capacity) {
    return null;
  } else {
    // split leaf node
    const mid = Math.floor(leafNode.keys.length / 2);
    const newNode = new LeafNode();
    newNode.keys = leafNode.keys.slice(mid);
    newNode.values = leafNode.values.slice(mid);
    newNode.count = leafNode.keys.length - mid;
    leafNode.keys = leafNode.keys.slice(0, mid);
    leafNode.values = leafNode.values.slice(0, mid);
    leafNode.count = mid;

    return { node: newNode, separatorKey: newNode.keys[0] };
  }
} else {
  // TODO
}
```

Next, if the node is an inner node, we should recursively call `_insert()` on the correct child to continue finding the right leaf node for the key. In this process if we encounter a node split, we should insert the key in the current node and bubble up the split if required.

```ts
if (node.isLeaf()) {
  // ...
} else {
  const innerNode = node as InnerNode;
  const pos = this.lowerBound(innerNode.keys, key);
  // Find the right child position
  const childNodePosition =
    pos === -1
      ? innerNode.keys.length
      : key === innerNode.keys[pos]
      ? pos + 1
      : pos;
  const childNode = innerNode.children[childNodePosition];
  const result = this._insert(childNode, key, value);

  if (result) {
    // Node split occurred in child, insert new key
    innerNode.keys.splice(childNodePosition, 0, result.separatorKey);
    innerNode.children.splice(childNodePosition + 1, 0, result.node);

    if (innerNode.keys.length <= InnerNode.capacity) {
      innerNode.count = innerNode.children.length;
      return null;
    } else {
      // split current inner node
      const mid = Math.floor(innerNode.keys.length / 2);
      const separatorKey = innerNode.keys[mid];

      const newNode = new InnerNode();
      newNode.count = innerNode.keys.length - mid;
      newNode.level = innerNode.level;
      newNode.keys = innerNode.keys.slice(mid + 1);
      newNode.children = innerNode.children.slice(mid + 1);

      innerNode.count = mid + 1;
      innerNode.keys = innerNode.keys.slice(0, mid);
      innerNode.children = innerNode.children.slice(0, mid + 1);

      return { node: newNode, separatorKey };
    }
  }

  return null;
}
```

### `lookup(key: number): number | null`

During lookup, we want to reach the leaf node of the tree which holds the queried key, i.e. we'll have to make our way through the inner nodes, navigating in the right directions according to the key value until we reach a leaf node.

The logic we used while inserting a key can be reused here. Most important of all is the choice of the child node to go to next - this line from insert will come in handy:

```ts
const childNodePosition =
  pos === -1
    ? innerNode.keys.length
    : key === innerNode.keys[pos]
    ? pos + 1
    : pos;
```

Let's implement the lookup method:

```ts
class BPTree {
  lookup(key: number): number | null {
    // If the tree is empty, return null
    if (!this.root) {
      return null;
    }

    let node = this.root;

    // Traverse down the tree until we reach a leaf node
    while (!node.isLeaf()) {
      const innerNode = node as InnerNode;
      const pos = this.lowerBound(innerNode.keys, key);
      const childNodePosition =
        pos === -1
          ? innerNode.keys.length
          : key === innerNode.keys[pos]
          ? pos + 1
          : pos;

      node = innerNode.children[childNodePosition];
    }

    // At this point, we are at a leaf node
    // If the key is found, return the value
    const leafNode = node as LeafNode;
    if (leafNode.keys.includes(key)) {
      return leafNode.values[leafNode.keys.indexOf(key)];
    }

    return null;
  }
}
```

## Performance
Well, until now, I did not do anything specific to make it a _fast_ B+Tree. I will measure the performance of the existing code and will continue the performance discussion in further posts. Here are some results using [`mitata`](https://github.com/evanwashere/mitata) on my laptop for a test that inserts 1000 values and then looks up 1000.

```txt
clk: ~1.87 GHz
cpu: Apple M1
runtime: node 20.18.3 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
B+Tree Insert                148.45 ms/iter 146.15 ms   █ █                
                    (143.05 ms … 171.33 ms) 157.77 ms   ███                
                    (536.00  b …  26.95 kb)   2.89 kb █▁███▁█▁▁▁▁▁▁▁▁▁▁▁▁▁█

B+Tree Lookup                117.61 ms/iter 121.15 ms      █    █          
                    (106.13 ms … 135.02 ms) 133.42 ms ▅▅▅▅ █    █▅▅       ▅
                    (744.00  b …   1.50 kb) 810.00  b ████▁█▁▁▁▁███▁▁▁▁▁▁▁█
```

I'll share more performance details and try to implement a _generic_ B+Tree in upcoming posts.

> _The entire code can be found here: https://github.com/mohitk05/bptree-ts_