---
title: The Ship of Theseus Effect in Software Engineering
tags:
  - software-engineering
  - systems
date: 2026-01-22
description: When software changes over time, it is important to have formal ways to define its features. This especially becomes important with AI-powered generative coding.
---
The Ship of Theseus is a popular thought experiment where an object remains the same even when its individual components are replaced gradually with other similar ones. I often think how much of this paradox I experience when building and maintaining software. When you own a piece of software over a significant period of time, you make changes to it, evolve it, make it better, add features to it - and in the end it still remains the _same_ software you started with, but inherently is largely or completely different.

Take the example of any software migration. At Zalando, we've been on a year-long journey to move our mobile app experiences to React Native. The end user experience, for most cases unless we are building completely new features, is supposed to remain the same as in the previous implementation (native iOS and Android code). A common challenge that we've seen while doing this is that the target picture for a "screen" being migrated is often defined in a quite open-ended manner.

Usually, we have product definitions for these screens which were developed when the first versions were developed. These are helpful, but several features that were added on top remain in fragmented product definition documents and user stories that stacked over time. On top of these, there is _tribal knowledge_ held only by a handful of engineers and leaders who have been at the company for long enough time to know what happened with the product.

I feel there is a lack of a formal way to define _what a piece of software is_.

You may argue that one way to achieve this is to have good tests. Indeed, having great end-to-end tests either written in code or as Jira tickets describing how to verify certain actions certainly helps. They provide a way to _declare_ and _verify_ that something works and confirm that the system under test does what it is expected to.

The problem with tests is that they seem to be too low-level and implementation specific. BDD-style tests do come close to what might solve this problem. Yet, code-based tests to me seem like an _implementation_ of this unknown design I'm yearning for.

**_How do I represent logic in a declarative and testable way?_**

In the example of migrating customer experience to a new technology, the _screen_ logic _must_ remain the same. A key indicator of a successful migration is that this logic remains unchanged in the new version. How do I write this logic and test it across different implementation? My tests written for Android/iOS no longer work for React Native, at least not directly. I would have to port the tests to something like Appium - which inherently means I'm rewriting the tests and introducing a change factor in the thing that was supposed to check regressions.

Here's another example from work. I have been working on updating the build process for one of our applications. This is a large _distributed monolith_ with a complex build setup and over the last weeks I have been working to change it to a new setup. I'd not share more details, but what remains similar to the previous example is that the output of the build process is supposed to remain the same. The motivation of the migration is the potential performance boost and cost efficiency. The built application _must_ not change.

In this case, the software in question is not the application, but the build pipeline. I could successfully update the build process and verify that the application works by checking if all end-to-end tests pass. The area I lack confidence in is the side effects of this build pipeline. E.g. the pipeline performs some optimisations and stores some state on a different service for each version of the application. This is then used at runtime. It is hard to test if there was any regression in this regard, the only way to check is to verify if anything broke for the user (again with end-to-end tests).

**_How do I confidently migrate such a pipeline without missing out on some steps along the way?_**

I yearn again for this "formal" way to define what this pipeline does. This imaginary solution can also then help me verify if the new implementation works as expected.
## What are my options?
Tests definitely solve a good chunk of the problem. Investing in writing end-to-end tests goes a long way, especially with AI-based generative coding. When writing code becomes extremely cheap and fast, the only way to ensure your product is still working and behaving as expected is tests. Testing infrastructure, along with observability, will become one of the most important pieces of tooling in the future.

A promising solution where testing applies is _autonomous testing_ - tests are written and maintained automatically. This sure takes away the hurdle between the need to have tests and actually implementing and maintaining them at scale. But again, I see this as an _implementation_ of this divine design which dictates what a piece of software is.

Another interesting idea is to flip the way we write tests to avoid making them specific to the implementation but rather specific to the outcomes of the implementation. [Property-based testing](https://antithesis.com/resources/property_based_testing/) helps in doing this. Instead of the traditional approach of testing with examples, you test with properties. Properties are _characteristics_ or _expected behaviours_ of a system. So for example if you have a function that searches for a string in a file, like `grep`, an example-based testing would look like:

```js
test("grep 1", async () => {
	const testFilePath = "/tmp/file";
	fs.writeFileSync(testFilePath, "hello world");
	
	const result = await grep(testFilePath, "hello");
	expect(result).toBe(true);
});

test("grep 2", async () => {
	const testFilePath = "/tmp/file";
	fs.writeFileSync(testFilePath, "hello world, hello again!");
	
	const result = await grep(testFilePath, "again");
	expect(result).toBe(true);
});

test("grep - should report false", async () => {
	const testFilePath = "/tmp/file";
	fs.writeFileSync(testFilePath, "hello world, hello again!");
	
	const result = await grep(testFilePath, "goodbye");
	expect(result).toBe(false);
});
```

Whereas in property-based testing using [`fast-check`](https://github.com/dubzzz/fast-check), this would be:
```js
test('grep - string should be in file content', () => {
	fc.assert(
		fc.property(fc.string({ minLength: 1000 }), fc.string({ maxLength: 999 }) (haystack, needle) => {
			fc.pre(haystack.indexOf(needle) > -1);
		    fs.writeFileSync("/tmp/file", haystack);
		    const result = await grep(testFilePath, needle);
			expect(result).toBe(true);
	    }),
	);
});
```

The test declares what properties the function should exhibit, here it being the `haystack` content should contain the `needle` string. The test framework `fast-check` does the job of generating valid input and test the function with them. The framework generates inputs, the test verify properties.

Tests do not work very well though for more abstract software, or so-called _systems_ that are not a single piece of code but rather a combination of several components working together. The Ship of Theseus paradox comes alive in this case and makes it harder to reason about what's the actual product. Product definition documents are key, but hard to maintain. End-to-end tests running at edge and regularly maintained prove to be the source of truth to capture regressions.

We need to find more ways to write declarative definitions for software that is testable. Do you know of something that can do this? Have you struggled with this at some point?