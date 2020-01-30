---
title: React India Conf - Day 1
date: 2019-09-27
---

![](https://i.imgur.com/ua395dD.jpg)

Today was the first day of the first ever React India conference and it was my first experience at a tech conference ever. Too many of firsts, but it was really an amazing experience altogether. The day left me all insipired and pumped up to give my first talk, whenever that's going to be. I am writing this blog late in the night, after a few beers and my notes on the side. I had forgotten my laptop at the place where I'm staying so it was all old-school handwritten notemaking, which I absolutely love.

There was a lot to learn from this one day, one of the things being about documenting the stuff you learn; hence I'm going to keep this blog super simple and crisp, noting just the important takeways.

Everyone at the conference would agree with me when I say that there was a lot of GraphQL in the talks today, and I particularly don't want to complain about this but rather appreciate the fact that so many talks on GraphQL introduced me to several ways in which people are using it. I had little knowledge of GraphQL until today, and I doubt one day of talks does any good, but I surely do know a lot now about what are the use cases where it would fit really well.

Me and [Kunal](https://twitter.com/kay_2695px) were working on [Shaai](https://shaaijs.tech/) for the past couple of months and, infact, this blog is written with Shaai; and I found an interesting use case of GraphQL here. Basically, GraphQL is awesome when you want to design how your frontend receives data from the APIs/backend. And this finds an interesting application ([as in Shaai](https://github.com/shaaijs/admin#host-shaai-admin-on-heroku)) for cases where you allow hosting your open source softwares as DIYs. For example in Shaai, we let you host your own CMS, and it would be really amazing if you could design your own data! GraphQL finds a sweet spot here.

Talks by Nader, Shruti, Eesh, Shahid and Tanay talked about various ways in which they were using GraphQL. Shahid's was an interesting one where he talked about using the Redux event flow architecture being implemented in the backend and creating amazing applications that were failsafe. Eesh's piece on reducing load time is one of the tasks that we, at upGrad, constantly work on; caching static parts and fetching dynamic ones are perfect examples of memoising data and fetching only when required. The results that he got with ClearTrip were pretty amazing, going from ~3sec down to ~440ms 💫

The talks I specifically liked and enjoyed listening to included Ive's story about CodeSandbox. I also caught up with him post the event - it is always amazing to know people creating amazing things and not giving up on them. CodeSandbox is a side-project turned startup. Carolyn's talk on making technologies easier to learn and remove the assumptions around 'easy' things was pretty amazing. She highlighted a quote from Jim Fischer, which deserves to be mentioned everywhere: `We mistake familiarity with easiness.` This struck so many chords and kind of broke this virtual barrier between things that I might have considered unreachable before. She also stressed on how we must not assume things to be easy, and accept that everone learns at a different pace, and add a pinch of humility at our workplace or surroundings.

The talk that I found the most interesting was about raaga.io, built by Ritesh Kumar, which is a MIDI file visualiser built into the web browser. It was amazing how he stressed on performance at each level and using worker threads to process heavy tasks parallely. This inspires me to try out worker threads as I have done canvas a lot, and want to try out it's performance that people boast about.

This talk included two important terms that I found interesting, one being **event lookahead**. This is a concept of waiting for some buffer time in addition to the actual wait time for an event to fire. Since the website was about music, syncing differenct pieces was really important. The second thing was about performant canvas. He wanted to acheive zero-laggy experince with the music visualisation, and hence to prevent blocking the main thread, he moved the canvas painting logic to a worker thread. This is pretty amazing and tempts me to try it out.

The talk I was looking forward to, was by the Netflix engineer, Rajat Kumar. It was on conditional bundling of a web app. For any frontend heavy app, A/B test are the best way to try out new features and UI/UX flows, to conclude best performing pieces. Rajat talked about the conditonal bundling process they built to dynamically bundle a combination at request time and serve it to the user. All of this comes out of the need of a sophisticated A/B testing platform because, as Rajat mentioned, Netflix performs hundreds of such tests, and soon the combinations would go beyond countable numbers.

To tackle this his team wrote a few directives which included `@conditonal` which would tell webpack's bundler, to conditionally require a particular file. Finally, according to the dependencies of the instance and the conditional flags, they would create something called a conditonal dependency tree. For each instance, the fetching URL would tell the `true` flags and the tree would be parsed and only the nodes matching the condtions would be kept. A lot was going on, eventually a lot to learn.

Finally, I'd give an applause to all the organisers for doing such a great job in the first round itself. Amazing organisation, good food and a beautiful venue - Goa. I'm looking forward to the next day tomorrow and hope there's a lot to learn! Cheers 🍻