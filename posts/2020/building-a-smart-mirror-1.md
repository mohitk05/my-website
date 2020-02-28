---
title: Building a Smart Mirror - 1
coverImage: /img/posts/mirror1.jpeg
coverImagePosition: 50% 36%
coverImageHeight: 450px
---

Almost a month back we started the work for renovating our house in Panvel, a decision my parents had taken long back, but was finally brought into action<!-- excerpt --> the previous month. This included a lot of breaking, building, cutting and painting. The house was going to be a mess for sure. This was a trigger for me and my brother, Nitish, because this was the right time to experiment with building some stuff. Nitish wanted to build a smart mirror from quite some time, so without any delay I ordered a Raspberry Pi 3B and got to work.

Building a smart mirror as an actual product requires quite an effort. More than actually building the thing, acquiring materials is a tougher job. Before the Pi had arrived, Nitish was out searching for a monitor screen! He got one at a local electronics repair shop, for a very low price of Rs. 1500. He got it home and diassembled it, ready to be installed in the mirror. The Pi was still on the way, meanwhile I researched for the software stuff that would be required for the mirror.

<img src="/img/posts/mirror1-1.jpeg" style="height: 400px;width: auto; margin: auto;display: block" >

<p style="text-align: center; opacity: 0.6;font-size: 0.8em"><em>The monitor screen</em></p>

So basically, Raspberry Pi is a mini computer. It can do anything that your laptop/mobile/server can. You can develop stuff, run local servers, serve webpages, run scripts, connect to Wi-Fi and much more! So my initial idea of running a smart mirror was to boot up the Pi in kiosk mode, which means that it would always display a specified UI when booted up. This UI can be a simple HTML page opened in Chromium, the default browser in Pi. The HTML page would be connected to a remote server, which would serve data required to render things on the mirror. Plus it would be sockets enabled. If I had to refresh my screen on the mirror, I'd click a button on my phone, and the screen would refresh.

// image

## Gathering the materials

A basic smart mirror requires the following items to become alive:

1. Raspberry Pi
2. Mirror screen/glass
3. A monitor
4. Wooden frame
5. Black cardboard
6. USB Mic
7. Power adapter

Getting all of these is bit of an effort because you won't necessarily find them in one go. Since I had carpentry work going on at my home, I asked the carpenter to build a frame. Initially he did not get the idea of what we were building. So we explained it to him patiently, showing him YouTube videos of people who had already built the mirror. Finally he got the crux and built the beautiful frame which you see in the cover image of this post.

The frame was in two pieces, the actual frame which was going to hold all the parts, and the cover, which was going to cover up the open back of the frame, and hang up on the wall. Simultaneously we were looking out for the mirror screen. We were trying to find the acrylic sheet which behaved like a mirror. We found it nowhere. Visiting various glass shops and roaming around hopelessly in scorch heat, we could not get what we were looking for. Amazon has this sheet, also the glass, but the price was way too much. Buying it from there would ruin the purpose of this being a side project.

Throughout the glass search, we had a backup - a two way reflective glass as the one on sliding windows. I wasn't quite sure how it would perform though. The reflective properties were really good, but all of them had a tint which made the light coming in a bit dull. I doubted if the UI on the monitor screen would look good through this glass. Eventually, after failed attempts at finding the acrylic sheet, we resorted to the two way glass. My mom and dad brought it when they were out for some shopping.

## Setting up Raspberry Pi

-   raspbian
-   google assistant
-   magicmirror

## Bringing everything together

-   Monitor broke, new
-   Height mismatch
-   Everything in place
-   Mic, speaker, usb out
-   Padding, cover fixed
-   Doubtful of the weight, but finally up
