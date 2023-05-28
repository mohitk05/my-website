---
title: "Paper Pursuit #3 - Isolating Web Programs in Modern Browser Architectures"
date: "2023-05-09T06:01:21.017Z"
description: "Authors: Charles Reis, Steven D. Gribble (University of Washington / Google, Inc.) [2009]"
tags: ["posts"]
coverImage: /img/acs/5ac73225-6f25-4e0f-a765-3a714a4119d0_1646x850.jpeg
---

_This is **issue #3** in the series **[Paper Pursuit](https://aboutcomputingsystems.substack.com/p/series-introduction-paper-pursuit)** where I review and summarize interesting research papers in computer science every Tuesday. You can check out the previous issues in the series [here](https://aboutcomputingsystems.substack.com/s/paper-pursuit)._

---

**Original paper**: _[Isolating Web Programs in Modern Browser Architectures](https://static.googleusercontent.com/media/research.google.com/en//pubs/archive/34924.pdf)_

In today’s issue, we enter the exciting domain of **web browsers**. Browsers have been the carriers of the internet evolution, making the internet accessible to everyone from everywhere. Since I work primarily with the front end of the web at Zalando, this topic particularly interests me as it introduces a concept that is generally common today.

The paper talks about **multi-process browser architecture** and focuses a lot on what defines the boundaries of a web application in _modern_ times. These boundaries define how web security and reliability evolve over time in browsers.

# Introduction

_Isolating Web Programs in Modern Browser Architectures (2009)_ is written by two Google engineers, one of whom later worked on Chromium’s site isolation feature that put it at the forefront of multi-process browsers.

Most of the browsers during the time this paper was written were **monolithic** in nature, i.e. **they had a single browser process that handled all of the browser’s functionality**. This was natural because websites initially were only a set of web pages meant to be visited by the browser. But this was changing rapidly with the advent of **client-side JavaScript applications** (Gmail, Google Maps being some of the early ones) that involved much more than just loading web pages.

Another peculiarity of the web from the browser’s perspective is that they are supposed to run code from untrusted sources on the client machine, meaning if this code wasn’t well written and if the browser did not take enough precautions, it could lead to unexpected results. The monolithic architecture did not help much here, meaning one bad website could bring down the whole browser.

![image](/img/acs/25f90f90-9c2c-4ca0-b560-567bc56dec8c_1906x906.gif)

Yet another problem with monolithic browsers that the paper highlights is their poor security. Without isolation, it was easy for malicious actors to exploit innocent Internet users with attacks such as [XSS (Cross-site scripting)](https://portswigger.net/web-security/cross-site-scripting).

Enjoying reading? Subscribe for free to receive new posts and support my work.

# The proposed solution

The paper suggests that browsers need to behave more like an operating system and provide good process isolation for host programs that run in their environment. **According to the “multi-process architecture” proposed by the paper, the browser isolates “web programs” into separate OS processes, making use of the good abstractions already exposed by the OS.**

Running each web program in a separate process ensures that the browser is fault-tolerant (if a program fails, it only affects one process) and security measures can be applied to restrict data access per process. **But what is a** _**web program**_**?** Websites don’t load a single binary that runs in the browser, but it is a complex mixture of HTML, CSS, and JavaScript entities. **How do we define isolation?**

# Finding Boundaries in web programs

_“A web program is a set of conceptually related pages and their sub-resources, as organized by a web publisher.”_

**Backward compatibility is a major constraint** in applying internal boundaries as browsers should not break existing websites.

**[Origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin)** is a strong candidate for this boundary but it is discarded as an option because websites can change their origin at runtime. A more general identifier for a web program is the _**[site](https://developer.mozilla.org/en-US/docs/Glossary/Site)**_. **The** _**site**_ **is a combination of the protocol and the registry-controlled domain name.**

![image](/img/acs/fa615ade-e28d-45bd-b29a-b418faa3f193_1200x630.jpeg)

Two more definitions are introduced - **the browsing instance** and **the site instance.** They represent internal browser representation of how users browse websites on the internet.

![image](/img/acs/c7ca6b09-0eaa-488f-95e7-9df0cf8a15f2_760x606.png)

With these, it is now possible to define how the browser can isolate different web programs and their instances.

# The new architecture

With the isolation boundaries defined, the paper proceeds to talk about the implementation details of the new architecture, focussing on how it is implemented in Chromium. This setup is supported by three fundamental pieces in the browser.

#### Rendering Engine

This is a process created for every instance of a web program and handles the parsing, rendering and execution of the program.

#### Browser Kernel

This is a base process that includes all the common functionalities that are required horizontally across web programs. E.g. the browser interface, and storage.

#### Plugins

A separate process handles browser plugin instances.

![image](/img/acs/abb5b9ed-93f2-4011-92d7-5118f3f2aa5c_748x404.png)

Chromium operates in a **“process-per-site-instance”** model by default, **creating a rendering engine process for each web program instance**.

# Benefits and evaluation

In the last sections, the paper discusses and analyses the benefits of the new setup. The following characteristics are provided by the multi-process browser architecture:

1.  **Fault Tolerance**. In case of an error in the HTML renderers or JavaScript engines, only one rendering engine process is affected and the rest of the processes and web program instances remain usable.
2.  **Accountability**. Since there the architecture operates by isolating sites and uses operating system processes to isolate resources, each process can be easily tracked and held accountable for an increase in resource usage.
3.  **Memory Management**. This architecture makes it easy to separate and de-allocate memory per process when it has been completed.
4.  **Performance**. Since web program instances are on separate OS processes, they are more performant than in monolithic browsers where every website competes for resources.

    ![image](/img/acs/a578a759-cb51-4913-8e03-1bcfa21fd76b_483x201.png)

5.  **Security**. Process isolation allows better security in web programs. Chromium sandboxes rendering engine processes from accessing the filesystem and other resources.

The new architecture also provides great compatibility with existing web programs, and the paper notes that there have been no compatibility bugs reported for which the architecture was responsible.

# Caveat: The overhead for multi-process

While the multi-process architecture shines bright in several aspects, it introduces a new cost: **memory overhead**. Since the architecture assigns an OS process to each web program instance, a set of global cache objects have to be copied over in each of these processes. The paper found out that the average site instance footprint rises _**from 3.9 MB in monolithic to 10.6 MB in multi-process**_.

Chromium restricts the maximum number of rendering engine processes to 20, after which it reuses them for new site instances.

![image](/img/acs/7e4b55af-d71e-47f3-b58e-17f45a14f6eb_636x231.jpeg)

# Takeaways and further readings

The paper introduces the idea and motivation behind the multi-process browser architecture and shows why it is better than its monolithic counterpart by giving examples from Chromium. The architecture was pivotal in the [Second Browser War](<https://en.wikipedia.org/wiki/Browser_wars#Second_browser_war_(2004%E2%80%932017)>) as Google Chrome’s usage skyrocketed given its rich features and stability.

Mozilla’s Firefox also later moved to a multi-process architecture but took some learnings from the memory overhead issues of Chrome. Today, most browsers operate on this model, ensuring isolated failures, performance and security.

Following is a list of related readings for you.

1.  [Inside look at modern web browser (part 1)](https://developer.chrome.com/blog/inside-browser-part1/), Chrome Developers
2.  [Google Chrome Comic](https://www.google.com/googlebooks/chrome/big_04.html), Google Chrome
3.  [Multi-process Architecture](https://www.chromium.org/developers/design-documents/multi-process-architecture/), The Chromium Projects
4.  [Firefox 54 Finally Supports Multithreading, May Beat Chrome on RAM Usage](https://www.extremetech.com/internet/250930-firefox-54-finally-supports-multithreading-claims-higher-ram-efficiency-chrome), ExtremeTech

---

Did you find this review useful? If yes, then you’d be happy to know that I write such paper reviews every Tuesday as part of the series Paper Pursuit. Subscribe to the newsletter, if you haven’t, and I’ll see you next Tuesday!

[Subscribe now](https://aboutcomputingsystems.substack.com/subscribe?)
