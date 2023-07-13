---
title: Related posts in Eleventy
date: 2023-07-13
description: Suggesting related posts for a blog post
tags: ['posts', 'eleventy', '11ty', 'web', 'meta']
---

My website (including my blog) is built using Eleventy (or 11ty), a static site generator similar to Jekyll. It has been over 3 years since I moved to this setup, and it has worked well. It is super simple, fast and built for longevity. While websites built in modern frontend frameworks might not work ten years down the lane, and your favourite social and blogging platforms may shut down abruptly, the only thing that will stay alive is pure text accompanied by HTML.

I am fascinated by the idea of [digital gardens](https://maggieappleton.com/garden-history) and it fits well in my perspective of how personal web should ideally be. My website is an online space I own and tend to occasionally. It is open to all and a collection of my thoughts and ideas.

While I don’t write very frequently here, I like to tweak things to make things slightly better. The blog now has a good collection of write-ups and forms a long list under the “all posts” page. But there was very limited discoverability within the blog, I felt. On the single blog post view, you could read the blog and then either navigate back to the previous page or go to the home page. This restricted the reader to a single blog post per session.

As a solution to this, I recently tried implementing “related posts” in my blog. Any minimal blogging platform would have this feature by default where it suggests posts that are similar to the one you are reading currently. And it does not require complex machine learning models - the simplest way to achieve it is by using content tagging.

Any writing platform allows you to tag your content with labels such that posts about similar topics can be grouped together. Tags are a way to build connections between topics and posts and eventually posts themselves. The relation between tags and posts is N-to-N, i.e. each post can have multiple tags attached and each tag can have multiple posts under it.

The immediate use case of tags is finding similar content in a single place. Eleventy holds all the tags across the website in an object called `collections`. Each key in this object is a tag and the corresponding value is an array of posts that are tagged using the key.

```js
{
	collections: {
		web: [
			{
				url: "/about-http",
				...
			}
		],
		cooking: [
			{
				url: "/recipes/pink-smoothie",
				...
			}
		]
	}
}
```

Using this object, you can create pages for each tag and display a list of tagged posts.

Now, each blog post is tagged with a set of tags, e.g. this one is tagged with `11ty`, `web`, and some more that you can see at the top of this page under the title. How do we find posts that are related to the current one? The simplest way is to use tags! We know that tags are meant to group posts that talk about a similar thing together. We can reverse this argument and say that posts that are tagged with the same tag contain similar topics. This is the basis of related posts.

To implement related posts, I combined the set of posts for each tag of the current blog post and then located the adjacent posts to the current one in the resulting set. This is implemented as a custom Nunjucks filter (since I use njk templates) and returns a set of two related posts.

```js
eleventyConfig.addFilter('nearestTwoPosts', (arr, url) => {
	if (!arr) return [];
	const index = arr.findIndex((post) => post.url === url);
	if (index === 0) return arr.slice(1, 3);
	if (index === arr.length - 1) return arr.slice(index - 2, index);
	return [arr[index - 1], arr[index + 1]];
});
```

The logic is simple and it works well! Now if you scroll down to any post on my blog, you will be suggested two related posts which are actually very related. E.g. go to the bottom of the post [here](/about-computing-systems/posts/paper-pursuit-3-isolating-web-programs/). This has introduced new paths to reach various parts of the content on my blog which was otherwise only accessible through the main “all blogs” page. 🎉
