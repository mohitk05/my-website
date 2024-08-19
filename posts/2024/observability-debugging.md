---
title: Observability-based Debugging Mindset
date: 2024-08-18
tags:
  - software-engineering
  - sre
coverImage: /img/posts/obs-debug.jpg
---
Most of today's software environments are heavily distributed. Systems are made up of micro-services that work together to serve requests, many-a-times times processing information asynchronously. To know what's happening inside a distributed software system various observability techniques are implemented in order to mitigate issues.

With distributed tracing you can stitch request flows through multiple services and can attribute failures to a root cause. Usually, distributed tracing is put to use during production incidents when a monitoring check fails and an alert is triggered. The person responsible comes to the observability platform and looks for the traces belonging to the unhealthy service and tries to narrow down the cause. Distributed tracing helps them see the entire picture and they can then point to a service which probably caused a bottleneck and fix it or page the responsible team.

We all know tracing works very well for incident management but what I've seen is teams participating in on-call shifts are more used to using the observability platform and distributed tracing becomes a _reliability-focused_ feature. Over the past few years I've realised that it is much more powerful tool for any software engineer.
## Building a observability-first debugging mindset
Distributed tracing is extremely helpful for day-to-day debugging when most of your development systems are deployed remotely and instrumented. At Zalando, our local setups talk directly to _preview_ environments which are similar to production and hence behave exactly like them. Some common cases when you can use distributed tracing to find out root cause of issues:
### You get an error response from a service locally
A very common scenario for a developer working on a service making calls to a dependency service - a 401 or a 400 error with a slightly vague error message. Some responses hint which service in the call chain is the one returning the error, but a lot of times it's just the one you are making requests to responding back the error it received from the dependency.

Well, you may decide to ask the team in their support chat why this is happening, OR, head to your observability platform and check the traces your local requests generated and locate the issue. I strongly believe building this observability-first mindset can help you as an engineer and the platform teams to solve the issue faster. The trace will tell you which service is failing and most-probably why.

You may ask, _"how do I find the trace corresponding to my request?"_ The idea is to use attributes - many services attribute their spans with several request properties, e.g. user agent, HTTP path, IP and other custom headers. Look for the attributes that match your setup. In the local setup my team provides at Zalando, we accept a _debug header_ that is converted to a span attribute to make it easy for you to tag debug requests and find them in the trace.
### You don't see the expected traffic to a dependency service
Here you are working either locally or in the preview environment and you make a request to a service and it returns a success status but the 2nd-level dependency service you on which you expected to see some traffic does not see it at all. As a frontend engineer, one might think of giving up, but wait - you have powerful tools at your service! Distributed tracing is made to answer this question - where did my request go?

Trace your request, find the culprit, report.
### Your end-to-end tests are failing and you don't know why
End-to-end tests running in a pipeline fail at times and debugging them is frustrating if there's no proper logging or if logging helps little in case of certain errors. Well if your organisation is fully committed to distributed tracing, your pipelines will be traced as well! Head to your observability tool and check for the pipeline traces and try to locate the one for your end-to-end tests. It is highly probable the trace will tell you what's going wrong.

---
What I'm trying to say here is that one should build a observability-first debugging mindset. Many large companies have a setup where certain teams build the platforms that are used by other engineering teams. If you are part of the consuming team, distributed tracing can be a way to see on a high-level if something is wrong in the platforms you use, without having to know their internals. Doing this helps you debug faster and more independently, and if need be, you can reach out to the team in their support chats and ask for help. You will already have some finding to share, helping the other team solve the problem faster.

Next time you find yourself in a situation where something does not work, try heading over to your observability platform and checking a few traces!

<a href="https://www.freepik.com/free-vector/flat-business-persons-searching-new-work-opportunities_33125991.htm#fromView=search&page=1&position=22&uuid=53862a81-62ee-4a9d-94d8-cb9a74c73d97">Cover Image by redgreystock on Freepik</a>