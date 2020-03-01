---
title: Tearing Down the useEffect hook
coverImage: /img/posts/useeffect.png
eleventyExcludeFromCollections: true
---

I recently took up the task of clearing up the reported issues for `react-insta-stories`, an open source React component I had made last year and quite a few people use it. I was visiting the codebase after a couple of months<!-- excerpt --> and I had written one useEffect hook for maintaining `requestAnimationFrame` calls. You must know how an Instagram story behaves, it has a smooth moving top progress bar which goes on switching stories. I had implemented this animation using `requestAnimationFrame`.

The useEffect code looked like this

```js
useEffect(() => {
	if (!pause) {
		animationFrameId.current = requestAnimationFrame(incrementCount);
	}
	console.log('useeffect', pause, animationFrameId.current);
	return () => {
		console.log('cancelAnimationFrame', animationFrameId.current);
		cancelAnimationFrame(animationFrameId.current);
	};
}, [currentId, pause]);
```

The consoles were added because I was not exactly getting why the issue was occuring. So the problem here was, for some reason cancelling the animation wasn't actually stopping the animation, i.e. the variable being updated on the call of the function was still getting updated. You must be aware of the `Swipe up to see more` feature in stories. The component has this feature and the regular flow would require the background stories to pause until the see more overlay is visible. But because of this bug the stories went ahead in the background.

So like a professional JavaScript developer I added a few (a lot) console log statements throughout the flow of functions. This useEffect was the terminal point for the whole flow, and finally would pause the animation. Everything worked, but this. I was naively expecting the flow of consoles would be as such

```
useeffect true 31
cancelAnimationFrame 31
```

But the actual consoles were printed as follows:

```
cancelAnimationFrame 31
useeffect true 31
```

Now if you would have noticed, this useEffect returns a cleanup function. Still, I wasn't expecting this output. As per the docs, the cleanup is run after every effect, or render.
