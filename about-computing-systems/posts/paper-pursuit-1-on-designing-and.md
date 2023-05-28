---
title: "Paper Pursuit #1 - On Designing and Deploying Internet-Scale Services"
date: "2023-04-25T06:00:21.953Z"
description: "Author: James Hamilton – Windows Live Services Platform"
tags: ["posts"]
coverImage: /img/acs/ca372c6e-df17-4fa4-8d18-988eb39c32cf_1646x850.jpeg
---

**Original paper:** _[On Designing and Deploying Internet-Scale Services](https://s3.amazonaws.com/systemsandpapers/papers/hamilton.pdf)_

I picked up this paper to start off the _Paper Pursuit_ series where I will read and review important papers in computer science and software engineering. Reading research exposes you to progressive ideas on a topic and helps you know the cutting-edge thoughts from when it was published. The research I read may not be the latest but it is some of the most important in the history of CS.

# Introduction

_On Designing and Deploying Internet-Scale Services_ is an essential paper in software engineering. It is a result of the author's long-time work with large-scale systems and the learnings derived from the experience. I enjoyed reading the paper as I could relate the points mentioned to my work and also could compare the technologies from 2007, the year this paper was published, and now - 2023.

[Subscribe now](https://aboutcomputingsystems.substack.com/subscribe?)

# Review

All of the ideas mentioned in the introduction suggest the following three simple points. I will summarise the discussion in the paper based on these points.

![image](/img/acs/87c02a75-3840-4f0b-8625-5611345b2f9b_1200x500.jpeg)

## Expect failures

“Those unwilling to test in production aren’t yet confident that the service will continue operating through failures.”

The paper suggests that while designing systems, failures should be a significant deciding factor. Often they are an afterthought to the process which leads to safety patches being applied in code and infrastructure. **When you design for failure, you assume that failure is inevitable**. A system, according to Hamilton, should be able to “survive failure without any human intervention”. I recall a [StrangeLoop conference](http://link) talk on NASA’s Voyager mission where the speaker mentioned the extensive satellite engineering that was put to work to ensure the longevity and reliability of the mission.

**Redundancy is a must to overcome failures**. Simply put, redundancy is to have copies of the system running together so that in case one fails, the others keep the overall service running and thus maintain the SLAs. Redundant systems could be in the form of multiple load-balanced servers, database clones, or geographically distributed servers as in a content delivery network. Once a service has redundancy, various mechanisms can be implemented to achieve automatic recovery in case of failures.

Systems can grow large enough for engineers to be unaware of their components. To know what can fail **it is important to thoroughly know how a system behaves as a whole**. Developers working on a service should know its dependencies and clients and be easily able to find any further up/downstream services. Additionally, they should develop features in a complete environment (either locally or remotely). Knowledge of the entire landscape helps in avoiding single points of failure eventually.

**Testing in production, according to the paper, should be a norm**. It is heavily critical about any system that “cannot be tested in production” - “those unwilling to test in production aren’t yet confident that the service will continue operating through failures”. It also suggests periodically bringing entire services down to test the overall failure recovery, also known as chaos engineering. One way to lower the barrier for testing in production is to have a version rollback feature, making it easy to go to an older state quickly.

**Expect that all dependencies will fail**. Service developers should implement mechanisms like retries and timeouts to overcome these scenarios. It is also important to isolate these failures by not reacting to failure with more panic a.k.a cascading failures. One way to avoid this is to have inter-service monitoring – a dependency can notify your service that it is experiencing failure and you should behave accordingly.

Do not go for a so-called “big-bang change”. While deploying a huge feature, go for a **gradual rollout**. Make it easy to revert. Instead of a late-night deployment, prefer a mid-day deployment as it will be easy to mitigate in the day in case of a failure.

Observability and alerting are a must – “**instrument everything**” according to the paper. You cannot predict the state of your system without knowing what’s going on inside it. Observability gives us an inside picture of the system for us humans sitting outside the system boundaries. Good alerting is hard to achieve, it is going to be an iterative process where you will fine-tune and even remove alerts to increase their reliability. While diagnosing, it should be easy to find specific traces and logs in a system.

In case of failure, the system should **gracefully degrade**. One of the ways to do this is admission control. Your system should have a way to control access to it. E.g. when there is a spike in traffic, you could rate-limit a portion of the requests, or shed non-critical operations to focus only on the bare minimum requirement for your feature. E.g. at my company (an e-commerce shop), we can shunt traffic (send it to a null backend) in case of high traffic. This reduces the load on downstream services, preventing a total failure.

Expecting failures also means being proactive in **communication post an incident**. You should have a standard process for sending out communication to the stakeholders and should do it as soon as possible. Some incidents will be really bad (potential data breach or loss), and being prepared for such a scenario is an important part of building the system.

## Keep things simple

“Simple and nearly stupid is almost always better in a high-scale service..”

I think this is an overly-mentioned fact for a lot of software scenarios. Keeping software simple helps reduce the overload of maintaining it and the probability of errors due to too many moving parts in production. Systems have an advantage over other “packaged” software as they _can_ always maintain a single live version. There is ideally no overhead of maintaining old versions and caring for compatibility.

Developers should **avoid replicating functionality** in systems, rather they should replicate infrastructure to achieve redundancy. Duplicate logic can lead to unpredictable outcomes. Services should be kept stateless as much as possible, state should be maintained in data stores. This allows carefree scaling and predictable behavior.

**Build and deploy shallowly and iteratively**. You should start deploying early in development, e.g. deploying just an API and shunting the logic. This allows early testing with clients and an overall user perspective. The same goes for SLA goals – gradually ramp up. Do not target 99.99% at the very beginning, start at an acceptable target and then move towards it gradually.

## Automate everything

“An operations engineer working under pressure at 2 a.m. will make mistakes.”

The paper strongly believes that **avoiding manual intervention can reduce errors** in a system. Humans are prone to errors, and the best way to go around it is to automate as much as possible. This includes automatic recovery, monitoring, and catering to every failure scenario.

As a fundamental necessity, each service should have a health check. A way to know that the service is working in a healthy state, or _is_ _alive_. **Then, for each known failure scenario write extensive playbooks for mitigation and write scripts that fix the service.** Rather than applying mitigation steps manually, these scripts should be used, and to make this possible they should be **thoroughly tested in production**.

Automate service analysis and connect it to service provisioning. Schedule any known traffic spikes and let the system preemptively scale. Predict traffic from business metrics and relate service provisioning to serve any spikes. This is made easy if the code and configuration are part of the same unit, every code that is shipped has an attached configuration.

## Communication post an incident

The paper talks about handling communication and providing information to customers in case of an incident. Customers should be notified as early as possible with essential information about what went wrong, the impact of the failure, and a probable restoration plan. To achieve this, the process should be defined beforehand and executed promptly. This helps in maintaining trust with the customers who might otherwise quit using the service due to lack of transparency leading to frustration.

# Takeaways and further readings

The points summarised by the paper are true (and more applicable) even after 15 years since it was published. Today, most of the hardware-level heavy lifting is handled by **cloud providers** like AWS meaning you rarely work with physical machines. On top of this virtualization, we have platforms like **Kubernetes** that automate most of the provisioning, scaling, and traffic management to maintain a _desired state_ specified by a configuration.

Building and maintaining Internet-scale services is truly a complex and interesting feat with a lot of learnings on the way. Being part of the on-call team at Zalando for some of the most critical services, I have been fortunate to experience some of these scenarios in real life. The ideas outlined in this paper are extremely valuable for any team handling operations at scale.

**If you enjoyed this paper, here are a few links that talk about how** _**large-scale general systems**_ **can fail, and what software engineering teams can learn from other industries:**

1.  [How Complex Systems Fail](https://how.complexsystems.fail/), Richard I. Cook, MD, Cognitive Technologies Laboratory, University of Chicago
2.  [What can incident management teams learn from aviation?](https://www.atlassian.com/incident-management/incident-response/aviation#incident-management-in-mind), Atlassian docs

If you enjoyed this issue, share this with your friends, and I’ll see you next time with another interesting paper in _Paper Pursuit_!

![image](/img/acs/5c1b2b40-74fb-4f2b-b217-6dc8c22663d6_826x352.jpeg)

[Share](https://aboutcomputingsystems.substack.com/p/paper-pursuit-1-on-designing-and?utm_source=substack&utm_medium=email&utm_content=share&action=share&token=eyJ1c2VyX2lkIjozODMxNjgxNiwicG9zdF9pZCI6MTA0MjgyMDUwLCJpYXQiOjE2ODUzMDgyMjYsImV4cCI6MTY4NzkwMDIyNiwiaXNzIjoicHViLTEzODU1MDMiLCJzdWIiOiJwb3N0LXJlYWN0aW9uIn0.AHmsYTg7G9gNZFE6Ecdi-PTyebc0NTO-G8t6lXzMwOc)
