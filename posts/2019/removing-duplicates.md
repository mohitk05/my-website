---
title: Removing duplicates
date: 2019-02-21
coverImage: https://i.imgur.com/XvpoVsx.png
coverImageHeight: 480px
---

A year ago, at my previous organisation, I had once received a very redundant task to be carried out. I was a fresher then and it was quite normal to get such work in an<!-- excerpt --> Indian MNC (one of the reasons I quit and joined a startup).

The task was to combine contents of several Excel files into one, given that the content might have been repeated multiple times, across files, and finally have one clean file. Now the _'challenge'_ was that I had no idea of automating stuff in Excel. I was aware of VB Scripts, I also tried a few, but the syntax and concepts felt foreign to me. Soon I was trying out other solutions, something which I could carry out faster and would be easier to write.

Sometime before this period, I was attempting [Advent Of Code](https://adventofcode.com/) 2017, which is a month-long coding challenge. In one of the questions I had faced the problem of removing duplicates and generating a clean output. Some searching and reading led me to this amazing solution, which I wasn't surprisingly aware of. It is very simple and I believe many of you developers must be using it quite often. But the concept struck me and I have found its application in several other cases.

The solution simply uses a **_hash table_** to note the number of occurrences of a certain element. If the hash already contains the element, the value of the hash would not be null. Hence we would skip the element, as it is already present in our dataset. Otherwise, we add the element to a clean set, and mark its hash with some non null value (easiest being 1).

```js
let data = ['foo', 'bar', 'baz', 'foo'],
    clean = removeDuplicates(data)

function removeDuplicates(data) {
    let o = {}, c = []
    data.forEach(i => {
        if (!o[i]) {
            c.push(i) o[i] = 1
        }
    })
    return c
}
```

In our main problem, the Excel sheet was a collection of program IDs, program names and their description. The ID was the unique key here, and I had to just run the above algorithm for the file contents. I was using Python then, for writing short scripts. So it was my natural choice. Python's equivalent of a hash table is `dictionary` and similarly for JavaScript it is the JS object. This drastically reduced the time of completion of the task.

I have used this approach of hash table at a few other places. One of them being restructuring `node-mysql` results. I had previously used Sequelize as an ORM at my current organisation, but we recently moved to `mysql` since it uses raw SQL and provides better customisation. The result which this module provides is an array of rows matching the provided condition. This looks simple when you have a simple where clause, but grows complex when table joins are involved. `mysql` returns an array which has repeated object from the left table with varying results from the right (in case of LEFT JOIN).

```json
{
	"data": [
		{
			"post": {
				"id": 1
			},
			"media": {
				"id": 1
			}
		},
		{
			"post": {
				"id": 1
			},
			"media": {
				"id": 2
			}
		},
		{
			"post": {
				"id": 2
			},
			"media": {
				"id": 3
			}
		}
	]
}
```

This is not what a frontend would expect as a result from an API. For example, here there is a Posts table and a Media table. Media contains media items to be included into the blog, and are mapped to a blog id. While left-joining Posts on Media, a single blog can have multiple media, and would then result in above output. A cleaner, and more easier-to-handle data would preferably have an array of post objects, which have a property `media` which is yet again an array of all the related media objects.

Our earlier approach of removing duplicates can be used here. Since post is the unique element here, and post id the key, we can use the post object's property `media` as a hash. If `media` property is not present then it is the first media, and we instantiate it with an array and push the current media object. For next occurrence, the condition that media property exists holds true and hence we push the object into already existing media array.

```json
{
	"data": [
		{
			"id": 1,
			"media": [
				{
					"id": 1
				},
				{
					"id": 2
				}
			]
		},
		{
			"id": 2,
			"media": [
				{
					"id": 3
				}
			]
		}
	]
}
```

I was quite fascinated with this approach and found myself using it quite a lot of times. The core concept that hash table must have all keys unique is put to use here. How do you find this method? Do you already use it to carry out other operations? Do let me know on [Twitter](https://twitter.com/mohitkarekar). Once again, this was a small thought that I wrote down.
