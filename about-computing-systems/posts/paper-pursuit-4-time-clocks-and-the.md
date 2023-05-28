---
title: "Paper Pursuit #4 - Time, Clocks, and the Ordering of Events in a Distributed System"
date: "2023-05-16T06:01:05.657Z"
description: "Author: Leslie Lamport [1978]"
tags: ["posts"]
coverImage: /img/acs/ca78b843-a2d5-48b9-af8c-0e361454298f_1646x850.jpeg
---

Original paper: _[Time, Clocks, and the Ordering of Events in a Distributed System](https://lamport.azurewebsites.net/pubs/time-clocks.pdf)_

# Introduction

_Time, Clocks, and the Ordering of Events in a Distributed System_ by Leslie Lamport is an important piece of work that introduces the concept of logical clocks to achieve synchrony in a distributed system.

![image](/img/acs/2dbb337a-7a0d-4a61-a191-a882f18e45a0_1200x474.jpeg)

# The concept of “happened before”

Time in a distributed system is not as straightforward as one might think. Before I dive into the paper, let me introduce a _distributed system._ The paper succinctly defines it as **a system that is made up of spatially separated processes**. This spatial separation introduces two interesting scenarios:

1.  The concept of absolute time is skewed
2.  Communication from one process to another includes a time delay

These two properties make the study of time and ordering an important part of operating distributed systems. Let’s take an example to understand why this is crucial and what may go wrong if order is not taken into consideration.

Let’s consider computers use the _time of the day (timestamps)_ to compare which event happened first. Consider Ben (our hypothetical subject) wants to buy a t-shirt that he likes a lot from a fashion e-commerce website, but he isn’t earning yet so he asks his sister Lily to send him some funds to his bank account so that he can finally buy his favorite graphic tee. There is a hot drop sale that will last for a few minutes before stocks wipe off the website, Ben has to be quick.

Ben is an impatient teen and cannot wait so he proceeds to place an order, expecting Lily to have transferred the funds. Lily, _has_ in fact transferred the funds, there is a caveat though — Lily’s computer has a clock that is running 1 minute ahead of the actual time. When she transfers the funds, the bank notes the time as 18:30:35 (hh:mm:ss) circa 18:29:35 in actual time.

Now the fashion e-commerce website initiates the payment request to Ben’s bank account. This is done on a server that is synced perfectly with the Internet time and the time noted by this server is 18:30:00.

When the bank server receives these two requests, it sees that the fund transfer was done at 18:30:35 and the purchase request came in at 18:30:00 and hence processes the purchase first. The purchase fails because Ben does not have enough funds in his account. Uh oh! Poor Ben cannot get his favorite tee.

This is a very simple scenario, but you can imagine other similar ones in the scope of distributed systems. Determining if an event happened before the other is a tricky affair and depending only on timestamps is not a great idea as they may not be synced correctly across processes.

![image](/img/acs/dbdaa8ef-6136-42c8-80be-bea4265d96bc_2162x1402.png)

[Subscribe now](https://aboutcomputingsystems.substack.com/subscribe?)

# Partial Ordering of Events

Before tackling the problem of time and the overall ordering of events, the paper talks about the partial ordering of events. **Partial ordering is, given two events** _**a**_ **and** _**b**_**, stating which event happened before the other**. Lamport introduces the relation

_**a**_ → _**b**_ as _a_ happened before _b_

This relation also means that

if _**a**_ \-/→ _**b**_ and _**b**_ -/→ _**a**_, then _a_ and _b_ are concurrent. _(-/→ is “did not happen before”)_

## Causality

Causality is the property of one event affecting the other. _a_ and _b_ have a causal relationship if _a_ affects in some way the occurrence of _b_ (e.g. _a_ triggers _b_). In this case,

_**a**_ → _**b**_ has to be true.

This is because _b_ happens because _a_ happened before.

If two events are not causally related, they are concurrent. This is because there is no way to compare their occurrence in time.

## Logical Clocks

The paper then introduces logical clocks — **these are located at each process and they hold a counter value that is incremented between consecutive events in a process**. Two processes P and Q holding the clock values for an event _i_ can be denoted as follows:

![image](/img/acs/f6862416-2375-46e2-a23e-6aeca14f5387_739x79.png)

While sending messages, a process sends the counter value (as a timestamp for an event) along with the event. The receiving process can read this value.

For two events _a_ and _b_ (_a_ happens in P and _b_ happens in Q):

![image](/img/acs/f4c2e6c1-b906-4224-9b43-9967a00bedc1_412x33.png)

This constraint introduced by the logical clocks is important to partially order events occurring in different processes. Now, in order to respect this constraint:

1.  Each process increments its counter value C between any two successive local events
2.  If P sending a message to Q is event _i_ at _C(i)_ and Q receiving the message is event _j_ at _C(j)_, then Q must set _C(j)_ to a higher value than _C(i)_.

These two conditions ensure that the processes maintain the correct ordering of events using the logical clock counters, and hence partial ordering is achieved.

![image](/img/acs/22216fcb-1ef6-41f8-b385-37f77c53d12e_4685x2123.jpeg)

The figure above shows an example of how two processes maintain the constraint to make it possible to determine the partial ordering of two events.

# Total Ordering

In order to determine the **global ordering of events** in a distributed system, we must be able to relate events across all processes. To do that, we define a new relation of total ordering ⇒. If _a_ is an event in process P and _b_ is an event in process Q, then

_**a**_ ⇒ _**b**_ if and only if either _C(a)_ < _C(b)_ or (_C(a)_ = _C(j)_ and P < Q)

P < Q is any arbitrary ordering for processes.

# Example

The paper describes an **example of a system where multiple processes share a single resource**. A central scheduler process is not possible as it introduces the same challenges as described earlier when using only timestamps. **The system should respect first-come-first-serve for the single resource as it can only be accessed by one process at a time**.

We will use a system of logical clocks as described above to totally order events happening in the system and decide which process gets the resource. The following diagram shows the setup.

![image](/img/acs/cbd7095b-ce81-4d12-ac00-3d83485c3fc7_3437x2344.jpeg)

Each process maintains its own **request events queue**. Each process that wants to access the resource will send a request event (with a timestamp) to all other processes. Initially, we will assume that a process has access to the resource, hence all processes will have T1P1 (assuming P1 requested at time T1) in their request queues as shown in the diagram.

The system works as follows:

1.  To request access to the resource, a process Pi sends a message of the form _TxPi_. Here _Tx_ is the timestamp of the request event.
2.  When the other process Pj receives _TxPi_, it adds it to its request queue.
3.  To release the resource, Pi removes any _TxPi_ request message from its request queue and sends a timestamped release resource message to all other processes. Each other process removes any _TxPi_ from their queues.
4.  A process Pi is granted the resources when both conditions are true:

    - There is a _TxPi_ request message in its queue before all other request messages (_determined by total ordering_).
    - Pi has received a message from every other process timestamped later than _Tx._

![image](/img/acs/277637b8-6f37-4bc1-8be3-1d143c060fde_1200x783.gif)

That works great! This algorithm using logical clocks solves our problem of asynchrony between processes. **Every event happening after another event is guaranteed to have a larger counter value**.

But there is a caveat. **The system above uses total ordering for picking which event happened before and has no context of real-world time.** Assume a situation where P1 is a computer owned by a person in Berlin who makes the request for the resource over the Internet and then calls up their friend in Mumbai who has a computer P3 to make a request for the same resource. **If the Internet was totally ordered using logical clocks, there is a high chance that P3’s request would get a lower counter value than P1’s**. This is because there is no relation to real-world time while assigning counter values.

# Using Physical Clocks Instead

The anomaly mentioned above can be solved by replacing the logical clocks in our solution with **synchronized physical clocks**. This means that **the counter value for each process is an actual timestamp (e.g. UTC epoch)**. The rest of the logic stays the same — when a process receives an event, it sets the event’s timestamp as the maximum of its own timestamp and the one received with the event.

The paper then discusses the reliability of physical clocks as it is inevitable to avoid them from going out of sync with actual time. Today, computers use the [Network Time Protocol](https://en.wikipedia.org/wiki/Network_Time_Protocol) to keep their clocks closely in sync with UTC, keeping the deviation under a few milliseconds.

The paper concludes by providing mathematical proof of how closely physical clocks can be synchronized. The solution of total ordering in combination with physical clocks is proposed as a solution to achieve synchrony in a distributed system.

# Takeaways and further readings

The concept of time is interesting in the field of distributed systems and a lot of research has been done in this area. This paper was a seminal contribution to the field. Leslie Lamport’s other impactful contributions include [LaTex](https://www.latex-project.org/), the popular typesetting system.

Following are some resources you can explore:

1.  [\[Talk\] Time, Clocks, and Ordering of Events in a Dist. System by Dan Rubenstein \[Papers We Love, NYC\]](https://www.youtube.com/watch?v=hK6m6WBk-d8&ab_channel=PapersWeLove)
2.  [Distributed Systems Lecture Series](https://www.youtube.com/watch?v=FQ_2N3AQu0M&list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB&index=8&ab_channel=MartinKleppmann), Martin Kleppmann

---

Did you enjoy today’s issue? You can **share** it with someone you know who would be interested in reading! Sharing also supports my newsletter by increasing its reach and letting more people know about my work. So send this post around! 💛 I’ll see you next Tuesday.

[Share](https://aboutcomputingsystems.substack.com/p/paper-pursuit-4-time-clocks-and-the?utm_source=substack&utm_medium=email&utm_content=share&action=share&token=eyJ1c2VyX2lkIjozODMxNjgxNiwicG9zdF9pZCI6MTE4NjI0NDU2LCJpYXQiOjE2ODUzMDgyMjYsImV4cCI6MTY4NzkwMDIyNiwiaXNzIjoicHViLTEzODU1MDMiLCJzdWIiOiJwb3N0LXJlYWN0aW9uIn0.BMxO7-vAV98aWp_uyAvGFtvhTc3xGH0oupdzZIgUYfk)
