---
title: Building a Smart Mirror - 1
coverImage: /img/posts/mirror1-3.jpeg
coverImagePosition: 50% 36%
coverImageHeight: 450px
topics: ['raspberry pi', 'alexa', 'smart mirror', 'smart home']
description: This post is about we building a smart mirror from scratch using Raspberry Pi.
date: 2020-02-21
---

Almost a month back we started the work for renovating our house in Panvel, a decision my parents had taken long back, but was finally brought into action<!-- excerpt --> the previous month. This included a lot of breaking, building, cutting and painting. The house was going to be a mess for sure. This was a trigger for me and my brother, Nitish, because this was the right time to experiment with building some stuff. Nitish wanted to build a smart mirror for quite some time, so without any delay, I ordered a Raspberry Pi 3B and got to work.

Building a smart mirror as an actual product requires quite an effort. More than actually building the thing, acquiring materials is a tougher job. Before the Pi had arrived, Nitish was out searching for a monitor screen! He got one at a local electronics repair shop, for a very low price of Rs. 1500. He got it home and disassembled it, ready to be installed in the mirror. The Pi was still on the way, meanwhile, I researched for the software stuff that would be required for the mirror.

<img src="/img/posts/mirror1-1.jpeg" style="height: 400px;width: auto; margin: auto;display: block" >

<p style="text-align: center; opacity: 0.6;font-size: 0.8em"><em>The monitor screen</em></p>

So basically, Raspberry Pi is a mini-computer. It can do anything that your laptop/mobile/server can. You can develop stuff, run local servers, serve webpages, run scripts, connect to Wi-Fi and much more! So my initial idea of running a smart mirror was to boot up the Pi in kiosk mode, which means that it would always display a specified UI when booted up. This UI can be a simple HTML page opened in Chromium, the default browser in Pi. The HTML page would be connected to a remote server, which would serve data required to render things on the mirror. Plus it would be sockets enabled. If I had to refresh my screen on the mirror, I'd click a button on my phone, and the screen would refresh.

## How does a Magic Mirror work?

A magic mirror is called so because text and images magically appear on the mirror glass, somewhere you wouldn't expect at all. This is achieved by using a two-way glass surface. This surface behaves according to the amount of light on each side of the surface - reflective where the light is more, and transparent where it is dark.

Leveraging this property, we can black out the monitor screen behind the glass and display white text which would appear as if floating on the mirror. Once this is done, we can add numerous other features because now our mirror is nothing but a computer!

## Gathering Materials

A basic smart mirror requires the following items to become alive:

1. Raspberry Pi
2. Mirror screen/glass
3. A monitor
4. Wooden frame
5. Black cardboard
6. 32 GB SSD card
7. USB Mic
8. Power adapter (5V 2.5-3A)

Getting all of these is a bit of an effort because you won't necessarily find them in one go. Since I had carpentry work going on at my home, I asked the carpenter to build a frame. Initially, he did not get the idea of what we were building. So we explained it to him patiently, showing him YouTube videos of people who had already built the mirror. Finally, he got the crux and built the beautiful frame which you see in the cover image of this post.

The frame was in two pieces, the actual frame which was going to hold all the parts, and the cover, which was going to cover up the open back of the frame and hang up on the wall. Simultaneously we were looking out for the mirror screen. We were trying to find the acrylic sheet which behaved like a mirror. We found it nowhere. Visiting various glass shops and roaming around hopelessly in scorch heat, we could not get what we were looking for. Amazon has this sheet, also the glass, but the price was way too much. Buying it from there would ruin the purpose of this being a side project.

Throughout the glass search, we had a backup - **a two-way reflective glass** as the one on sliding windows. I wasn't quite sure how it would perform though; the reflective properties were really good, but all of them had a tint which made the light coming in a bit dull. I doubted if the UI on the monitor screen would look good through this glass. Eventually, after failed attempts at finding the acrylic sheet, we resorted to the two-way glass.

The rest of the components - black cardboard, USB mic, power adapter were easily available at a local stationery and electronics shop.

## Setting up Raspberry Pi

#### Raspbian

There are a lot of good tutorials to get started with Raspberry Pi. The first step to begin development is to flash an OS on the memory card. I installed the official OS Raspbian as I did not require any customization there. The process is well documented on the [official website](https://www.raspberrypi.org/documentation/installation/installing-images/).

#### MagicMirror

Once I had the OS installed, it was all the same! It was a computer. So the basic idea was clear, I had to run a web-page in full-screen mode with a sufficiently black background for it to look _magical_. I knew this was an easy task, so I left that for the end. Moreover, there's this amazing open-source library to set up the interface called [MagicMirror](https://github.com/MichMich/MagicMirror). I moved to the next task of setting up Google Assistant, the mic was added for this particular purpose.

#### Google Assistant

Adding Google Assistant to Raspberry Pi is somewhat tedious, Google recently deprecated a widely used Python library and instead promotes using its Assistant Service. But still, several tutorials and blogs mention the old library and hence leads to a bit of confusion. I followed the [latest official documentation](https://developers.google.com/assistant/sdk/guides/service/python) after wandering a bit. But before moving ahead, if you are referring this article to set up a magic mirror, I finally decided to not go with Google Assistant for reasons I've [mentioned below]().

Once all the basic stuff was ready, we decided to compile everything and put the mirror on the wall, the software part could be worked on later.

## Bringing Everything Together

All of this boiled down to the day when all of us took the task of putting up the mirror seriously. Before this, we were randomly trying things out and there were no solid improvements. Honestly, I've always been bad at carpentry or civil work. My dad is amazing at it - I remember the time when I was around 15 years old, we had a wooden TV cabinet that had stood the test of time and showed signs of old age. So my dad took up the task of cutting the almost 8 feet tall cabinet into two halves and use one as a tabletop for the TV and the other one as a computer table. I and my brother used to help in the occasional cutting of wood and painting.

We started with me finishing off the final software installs on the Pi and getting the board ready to be put behind the mirror. _Then we hit a roadblock_. The monitor screen we were using for the project died a natural death. When connected to the Pi for final checks, it started flickering and finally blacked out. This was a major hit given we had planned to get this project done. So we decided to wait for the next day and get all the paraphernalia ready so that the project reaches completion the next day.

First thing next morning, Nitish and I got outside in search of second-hand monitor screens. We were looking for cheap yet good ones and ones that would fit in the wooden frame as it was built to the exact size of the previous screen. We did find a good one, a second hand 19'' Dell monitor. This was also perfect because it had a metal casing for all the circuitry. The monitor was back!

Next, it was time to place the monitor inside the frame and put all the electronics in place.

![Layout](/img/posts/mirror1-2.jpg)

It is always better to pull out the USB ports for future debugging. We also extended the analog audio (aux) port so that we could connect a speaker outside. The mic was brought just out of one of the ventilation holes we had drilled in the wooden frame.

![Mirror](/img/posts/mirror1-4.jpeg)

We then put on the back cover and the mirror was ready to be hung! It looked stunning and we honestly did not think it would look that way. I set up a basic MagicMirror UI and it really looked magical!

![Magic](/img/posts/mirror1-5.jpeg)

While building the mirror, I was reminded of an app that I and Kunal had built some time back. It was called [Play This](https://playthis.netlify.com/) and it allowed playing music on one device and controlling it from others. Several devices could join the 'room' and add their favourite music to a single playlist. We used to play a lot of music while at TTT. What struck me was that this was perfect for the mirror! I could play music on the mirror using my phone! And after a few CSS changes, it worked perfectly.

<img src="/img/posts/mirror1-6.jpg" style="height: 500px;width: auto; margin: auto;display: block" >

This was a long post, but there's more to this. I'll write one more piece to document how I failed to get Google Assistant running and to my rescue was none other than Amazon Alexa.
