---
title: Node.js HTTP and a misconfigured WiFi router
date: 2023-11-15
description: Discovering a Node.js behaviour by accident
tags:
  - posts
  - nodejs
  - systems
---

I recently came across an interesting situation while working on a Node.js service locally. We have a pre-push hook that checks if the CSS bundle version in code is actually the right one by making a HEAD request to the generated URL (from the version) and verifying if the status code is 200. If it is not, we prevent the push. In my branch, I had a very unrelated change to the deployment configuration of the application and whenever I tried to push my changes, the pre-push hook failed at this CSS bundle check.

The error? Initially I only saw the error exposed by the check - `CSS bundle version xx.xx.xx does not exist or network request failed.` I checked the code for the check, there was a function that returned a boolean that represented the existence of the version bundle.

```js
const bundleExists = await serviceClient
  .request({
    method: "HEAD",
    pathname: cssPath,
  })
  .then(
    (res) => res.statusCode === 200,
    () => false
  );
```

To know more, I added a few logs in the reject handler of the promise. I saw some more logs now - `HTTP Request failed. read timeout`. Okay, I have some information now, I thought. So I added increased the timeout to `20000` - enough time to fetch a CSS file from a CDN (should have been a few milliseconds ideally).

```js
.request({
	method: "HEAD",
	pathname: cssPath,
	timeout: 20000
})
```

The check waited for 20 seconds and then failed again with the same error message: `HTTP Request failed. read timeout`. Meanwhile, I was also verifying if the [CSS bundle](https://mosaic02.ztat.net/zds/dx-ui/lib/atom-74.0.27-73-72.css) actually exists - and it did! I could open the URL in my browser. I thought, maybe it is an issue accessing it from code? (This should ideally not be the case since CDNs usually expose content without restrictions). SO I tried making a `fetch` call from my browser console. And it worked! I could receive the CSS content there. So I thought - maybe it is my Node.js HTTP client? I tried to replace it with `fetch`.

```js
const bundleExists = await fetch(BASE + cssPath, {
  method: "HEAD",
}).then(
  (res) => res.status === 200,
  (e) => {
    console.log(e);
    return false;
  }
);
```

Ran the `git push` command and it failed again - with a similar error `code: 'UND_ERR_CONNECT_TIMEOUT'`. Mildly frustrated, I asked for help in my team chat while debugging simultaneously. I decided to try the debugging 101 method to just copy the error message and search for it on the web. I was skeptical to see useful results as the error message was too generic `HTTP Request failed. read timeout`. So I looked up for `UND_ERR_CONNECT_TIMEOUT`.

I found this GitHub issue in the `undici` repository: https://github.com/nodejs/undici/issues/1531

![Screenshot 2023-11-15 at 11.08.41.png](/posts/2023/images/ipv6-1.png)

The initial few comments talk about how the issue is intermittent and the request fails if a short timeout is configured. It succeeds if a high timeout >30 seconds is set. Matteo Colina is super patient and trying to reproduce the issue but he could not. The issue author points out an interesting thing:

![Screenshot 2023-11-15 at 11.16.44.png](/posts/2023/images/ipv6-2.png)

This strikes some thoughts for me - is it an issue with DNS resolution? And specifically with my router somehow? I quickly switch my WiFi connection to a different one and try to push - IT WORKS!! 🤯 But how?!

Another comment below points to the answer:

![Screenshot 2023-11-15 at 11.19.17.png](/posts/2023/images/ipv6-3.png)

The [issue mentioned here](https://github.com/nodejs/node/issues/41625)contains a detailed description of the symptoms I initially faced and how to reproduce them. To summarise, this is what happened:

Node.js v17's HTTP client uses an algorithm to resolve IP address of the requested host that first tries to resolve IPv6 and if it fails then tries IPv4. ([more about IP versions](https://beej.us/guide/bgnet/html/#ip-addresses-versions-4-and-6)) The problem arises when certain routers have a misconfigured IPv6 setting - ideally they need to be configured with the Internet Service Provider's settings to resolve IPv6. When this happens, Node.js waits to resolve IPv6, which eventually fails if you have default timeouts for your client. If you increase them significantly, the request succeeds because Node.js then tries using IPv4 after IPv6 resolution times out.

My old router had a misconfigured IPv6 setting and as soon as I switched to the second router, Node.js could resolve the IPv6 and the request succeeded. The reason it worked in the browser is quite clear - it uses a different network stack, probably implemented in C++.

HTTP clients implement a logic known as [**Happy Eyeballs**](https://en.wikipedia.org/wiki/Happy_Eyeballs), which tries to resolve IPv6 and IPv4 together instead of doing it sequentially. It accepts whatever is resolved first, hence ensuring no timeouts as before. Several HTTP clients like Go's HTTP module, `curl` implement this. Unfortunately Node.js does not yet. As a solution, [Node.js implements](https://github.com/nodejs/node/blob/2d1bc3d130bdd0c948f5ad5874387ab8ffd04a33/lib/net.js#L1401) a weak version of this algorithm - if the option `autoSelectFamily: true` is sent to `socket.connect()`, it tries all the IPv4 and IPv6 addresses in sequence and selects the first successful connection. It waits for `autoSelectFamilyAttemptTimeout` number of milliseconds before trying the next address.

There is an [open issue](https://github.com/nodejs/node/issues/48145) to implement the Happy Eyeballs algorithm in parallel which is still in discussion. That's all folks about my accidental encounter with a Node.js peculiarity!
