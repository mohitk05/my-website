---
title: Update only if Necessary, treat ~equal things as one
date: 2019-10-08
---

The concept of 'update only if required' has applications in several areas of computing and I find it really interesting. It can be considered the simplest form of optimisation for any task, i.e. instead of naively updating the complete state of something, we selectively update the parts which changed. The success of this optimisation also largely depends on how efficient the calculation of finding what needs to updated is and if it is faster that a complete refresh.

One such famous application is the React's virtual DOM. It is a skeleton copy of the actual DOM and is used for the purpose of fast diffing between two states. Instead of repainting the whole DOM, we selectively update the nodes which have changed, hence saving us unecessary heavy rendering. Since DOM APIs are relatively slower than operations on JS objects, the Virtual DOM is a win win.

Another example is a screen renderer. I am not well versed with this concept, but as much as I have read, GPU optimises the process of rendering by following a similar technique. Pixels on the screen are repainted only if there's a difference in the value they hold. One can simply add a cutoff to allow levels upto certain value to be considered as not changed.

Several image compression algorithms use this too. Images, basically, are a 2D array of pixels, which contain color values of individual points. Compressions like MPEG, for video compression, do this to store only the data which tells the changes happening between two frames, and not two whole individual frames. If it does that, the video size would be huge! In videos, which are usually shot at 30fps, there are 30 frames in a second, and if seen by a human eye there is not much changing in that 1 second usually. Hence such technique is very crucial to reduce size considerably.

I got this thought initially when I read about image sprites used in web, where you place all the required images on a horizontal canvas and note the specific coordinates of each item. I imagined, what if instead of placing them horizontally, we could stack them up vertically. This would then allow us to remove those repeated pixels common in all of them, somewhat like when you pack something in a plastic bag and then use vacuum to suck out the air and everything wraps around the object tightly. The air is that collection of repeated pixels.

I wrote a simple Python function to this and it worked well! Two images which added up to 24kB were compressed down to 6kB. Amazing! You can find the code here: [https://github.com/mohitk05/fuse-compression](https://github.com/mohitk05/fuse-compression).

~ 8th October, 2019
