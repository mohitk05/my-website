---
title: How do CDNs work
date: 2023-11-09
tags:
  - posts
  - notes
  - cdn
  - systems
description: Notes about Content Distribution Networks
gardenTag: Evergreen
---
A content distribution network (CDN) is a set of globally-distributed servers that serve content from an origin server. The primary goals of a CDN are to act as a proxy server to an origin and be physically close to users globally.

Physical distance related network latencies are significant and can drastically impact your web application performance for users located far away from where you deploy your application. For example if you choose to deploy your application on Amazon Web Services (AWS) in the Europe West Frankfurt region, and you have active customers in Australia, the website performance for them would be far worse than someone using it from Berlin or Paris.

CDNs aim to get your application or content close to real users. The physical closeness opens up a lot of use cases for CDNs.

>Terminology:
>Origin = The server where the content/application lives

## CDNs as globally-distributed cache
One of the most popular use cases of a CDN is a global cache. This is particularly useful for static assets like images, video and other media, CSS and JavaScript files. Instead of every user request coming to an origin repository for these files, they can be cached at the edge using a CDN so that they are served fast.

"Edge" is a common term used when talking about CDNs - this usually refers to the fact that CDN servers are located at the _starting edge_ of network requests - near the users.

The globally-distributed servers in a CDN are called _points of presence_ (POPs). When a CDN is acting as a cache, each POP behaves like a cache proxy - when a request arrives, it checks if it already has the resource for the request (comparing path, headers). If it does, then it immediately returns the cached content to the user. If it does not, then it sends a request to the _origin_ - which is your application server or a AWS S3 bucket. Once a response is received, it caches its content on the POP for the request and returns the content to the user. The next time the same resource is requested, the POP returns it from its cache.

## CDNs as a protection layer
Another common usage of a CDN is to use it as a cloak for your application and protect it from malicious actors. Since a CDN point of present server is the first entry point while reaching your application, a CDN provider can let you configure certain rules to filter out traffic. This may include bots or expected sources of traffic that are unwanted.

Another protection mechanism CDNs provide is security in case of a distributed denial-of-service (DDOS) attack. Again, since CDNs are the entry points, they can deny or re-route a surge in traffic in order to distribute the traffic globally and apply protective measures to not overwhelm the origin.

Multiple POPs also ensure redundancy for your application - in case a POP goes down, a CDN can route traffic for that region to the closest working POP which might/might not have a similar cache. This will increase traffic to origin momentarily, but as soon as caches refill, it will decrease.

## CDNs as an edge computing layer
Many companies want to server user requests as fast as possible. CDNs proximity to users make them a great place to execute code to serve [[upgrad-internationalization|dynamic requests]]. E.g. consider a website which has a banner at the top which displays a message based on the location of the user using the website. In the UK it is "15% off on all Christmas items" and in India it is "20% off on Diwali items". One way to do this using edge computing is to write a function that maps the user location to a message from a dictionary of messages. Most CDNs provide an approximate country where the user request may have originated.

Apart from calculating data, edge computing is also a great place to render HTML pages close to the users. CDNs like CloudFlare provide "[workers](https://www.cloudflare.com/products/cloudflare-workers/)" to write functions that are executed on the edge. It also provides a distributed key-value database to store data and fetch it in the edge functions.

## Popular CDNs
* CloudFlare
* AWS CloudFront
* Akamai
* Fastly
* Netlify CDN
