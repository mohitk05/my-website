---
title: Merge Sort in Rust
date: 2020-11-02
description: Implementing merge sort in Rust
tags: ['posts', 'algorithms-part-1', 'merge-sort', 'rust', 'algorithm']
---

Merge sort is a popular sorting algorithm which is known for its better time complexity and using 'divide and conquer' to break down the problem into smaller ones and solve them recursively. Implementing some known algorithms lets you understand a programming language better and makes your familiar to usual patterns.

The pseudo-code for the algorithm looks as below:

-   Divide the array into halves
-   Sort both halves recursively
-   Merge sorted halves and return

```bash
merge_sort arr:
    s_left = merge_sort(left half of arr);
    s_right = merge_sort(right half of arr);
    return merge(s_left, s_right);
```

If I had to implement this in JavaScript, it would have been fairly easy as you can do as you wish in JS. You pass around arrays, modify them, make copies - and you'll only know you've gone wrong when you run your code. Rust does the checking at compile time. And since it is a typed language, you cannot assign values to themselves not caring about their types.

The first challenge is while translating a JS array to a Rust data type. JavaScript creates an illusion per say with respect to arrays. When you define an array using the `[]` syntax, or even with the `new Array()` constructor, what is created underneath is just a simple object (or a map) with keys as array indexes. The values aren't stored in contiguous locations.

In Rust, `array` is a primitive type and memory is stored contiguously. Arrays also need to be fixed in length as they take up space on the stack and cannot be updated thereafter. Hence for a function like `merge_sort` which would sort any array, we would need a more flexible data type which allows variable lengths. This is what `Vector` is made for. Vectors allow dynamic contiguous data and hence they are stored on the heap. Using vector, the interface for the function would look like:

```rust
fn merge_sort(vec: &Vec<i32>) -> Vec<i32> {}
```

Merge sort returns a new sorted array as it merges smaller arrays into one. To build this in Rust, we need to pass a reference of our original vector to the `merge_sort` function and then internally construct a sorted vector.

As in any recursive algorithm, let's consider the base case. When the arrays are split down to single elements, we must simply return them and let `merge` handle merging them appropriately. So the base case looks like:

```rust
fn merge_sort(vec: &Vec<i32>) -> Vec<i32> {
    if vec.len() < 2 {
        vec.to_vec()
    } else {
        // TODO
    }
}
```

Moving ahead, next is calling `merge_sort` recursively for the left and right halves.

```rust
fn merge_sort(vec: &Vec<i32>) -> Vec<i32> {
    if vec.len() < 2 {
        vec.to_vec()
    } else {
        let size = vec.len() / 2;
        let left = merge_sort(&vec[0..size].to_vec());
        let right = merge_sort(&vec[size..].to_vec());
    }
}
```

Here, since we need to pass the first half of the vector, we create a slice spread over the indexes (0 to size/2 and size/2 to end). Since `merge_sort` accepts a reference to a vector, we convert the slice to a vector and pass a reference to it to `merge_sort`.

Next would be implementing the `merge` function that merges the two sorted vectors. This looks straightforward and can easily be translated from any other programming language.

```rust
fn merge(left: &Vec<i32>, right: &Vec<i32>) -> Vec<i32> {
    let mut i = 0;
    let mut j = 0;
    let mut merged: Vec<i32> = Vec::new();

    while i < left.len() && j < right.len() {
        if left[i] < right[j] {
            merged.push(left[i]);
            i = i + 1;
        } else {
            merged.push(right[j]);
            j = j + 1;
        }
    }

    if i < left.len() {
        while i < left.len() {
            merged.push(left[i]);
            i = i + 1;
        }
    }

    if j < right.len() {
        while j < right.len() {
            merged.push(right[j]);
            j = j + 1;
        }
    }

    merged
}
```

And finally, we call `merge` with the sorted halves.

```rust
fn merge_sort(vec: &Vec<i32>) -> Vec<i32> {
    if vec.len() < 2 {
        vec.to_vec()
    } else {
        let size = vec.len() / 2;
        let left = merge_sort(&vec[0..size].to_vec());
        let right = merge_sort(&vec[size..].to_vec());
        let merged = merge(&left, &right);

        merged
    }
}
```

I've been taking an Algorithms course on Coursera just to clear some basic concepts and am trying to implement the solutions in Rust. This should be a good revision of some reading I had done about the language a few months back.
