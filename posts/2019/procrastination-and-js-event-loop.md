---
title: Procrastination and the Javascript Event Loop
date: 2019-03-09
coverImage: https://i.imgur.com/i7xSN37.jpg
---

Every professional, be it a developer or a designer, has always experienced this humongous pressure of completing pending tasks within a given deadline. A tempting TV series, or the Goddess of sleep have numerous<!-- excerpt --> times pushed tasks to a never appearing time, 'later', or as it is widely known - **_tomorrow_**.

_Oh, my Jira says I need to build this app authentication system which would need a couple of APIs and then finally some testing to check if it integrates correctly with the app, but that could wait - this one button in the UI does not appear to have the right amount of shadow, let me just tweak the CSS a little bit._

And a few hours later you are reading an article on css-tricks.com on how `box-shadow` and `filter: drop-shadow()` differ. (Interesting difference though, [must read](https://css-tricks.com/breaking-css-box-shadow-vs-drop-shadow/).) Your Jira is still TODO, and a few days later you realise that you should have built the damn API and kept your 'Columbus the Explorer' instincts off the table.

I have come across such situations where thinking that something could be done later has led me to do so many things under pressure at the same time. This does not necessarily relate to work. Outside of work too, for example, paying bills, is a huge task for me which gets ignored considering it to be trivial and that it could be done in few seconds any time'. In the age of digital banking where you could automate your payments, the very process of activating these auto-payments keeps being pushed to several 'tomorrows' by me. And later, when deadlines stack up, I have this session where I clear all the pending bills, manually. I don't know about you, but please don't judge me.

One day, during one such hectic time, when I was clearing all such pending tasks, a thought struck me. And this blog is about that thought.

Every artificial thing that exists today is someway of the other inspired from nature. Airplanes were designed taking inspirations from birds, the whole AI and robotics field has been trying to imitate human intelligence and motion. Programming languages too, are designed taking inspiration from human behaviour and our ability to respond to stimuli.

Broadly speaking, humans can be considered to be **_single threaded_**. To explain it simply - we can perform only one particular task (with perfection) at a single moment in time (There are exceptions to this, and by task I mean actual physical work). For example consider that new feature requests arrive for a project you are working on and they belong to varied areas. When you actually start writing code, it is practically impossible for you to write two different programs at a single time. Your best approach would be identifying the dependencies of the tasks on each other and then deciding an order to attempt them.

Javascript, as we all know, is single threaded. If we try to compare humans and Javascript, we see a similar behaviour in the way of carrying out tasks. The JS event loop is the core structure on which the asynchronous behaviour works. Simply put, the event loop works in the following way:

_The loop waits for events, if event is found it processes it. If during processing other events occur, they are queued to be processed later. Once the loop is done working on the first event, it checks if there are any queued events and processes them one by one._

So you can think the JS thread as this one really busy human, who is running around completing tasks. New and returning tasks are piling up on their desk. But the human doesn't ignore them, they come back and finish them one by one. If you procrastinate, you more or less become like a JS thread. You (the thread) can see from the back of your eye that due to your excellent procrastinating abilities (the async behaviour) work has piled up (the event queue) but you can only do one single thing at a time.

This also explains a few other concepts. In JS it is never recommended to perform heavy tasks synchronously. For example an intense crypto hashing running in a for loop is like you typing in complex code repeatedly for hours. The longer the worse. In the end you either give up, or are really tired.

Multi-threaded paradigm can be thought of as dividing your work among several people. Think ten of your duplicates working on the same task you had been assigned and constantly communicating with each other what all is done so that no one repeats the same task. This is what we call as concurrency (Watch this [beautiful Go talk](https://blog.golang.org/concurrency-is-not-parallelism) on concurrency and parallelism).

I love finding analogies in things around me. Hope that next time you procrastinate you remember the JS event loop and imagine yourself later on working hard to finish up all the tasks in the task queue. Javascript is part of your life!
