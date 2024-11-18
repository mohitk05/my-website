---
title: Simple statistics in software engineering
date: 2024-11-18
tags:
  - software-engineering
coverImage: /img/covers/stats-engineering-cover.png
---
<style>
img {
		width: auto;
	max-height: 300px;
}
</style>
I recently used a bit of statistics at work and I felt so empowered! I always knew about the domain, but given the kind of work I did (web, JavaScript), it did not involve a lot of applied statistics. Recently, I'm working a lot around site reliability engineering at Zalando - performance testing and reliability of systems during high load events, and what I realised is SRE has tons of statistics!

Statistics comes in very handy when you want to make sense of something that isn't clear in general sense. Usually, for several things in engineering, you'd have patterns and relations that are clearly known. E.g. complexity of algorithms. For commonly-used algorithms, you'd know the relationship between the number of nested for loops and the performance of your code. Another example is a system with only 2 components: a client and a server. You know that if the server takes longer to process a request, the experience on the client is going to be slow.

But when multiple systems come into picture, the pattern starts getting hazy and probably _random_ if looked from the outside. Consider a large micro-service ecosystem with thousands of services talking to each other in synchronous and asynchronous ways. The impact of a service's latency on the end user cannot always be reasoned properly. Statistics is a great tool in such cases, when there are a lot of variables and not a clear relationship equation. Given you have a large amount of historical data about how the services have behaved, you can _derive_ meaning out of the randomness.

## Example 1 - Determining Throughput

At Zalando, we run large load tests to prepare systems for high traffic events like Cyber Week, a time when the shop has great deals and campaigns that attract a large amount of shoppers in a short duration of time. Before each load test, teams owning upstream services prepare their systems to handle the load and perform calculations to determine expected scaling and resource metrics so that they can monitor their systems during the test.

To perform these calculations they need to know an approximate throughput value for their service that would be applied during the load test. A straightforward approach could be using a multiplier factor, e.g. if the load test targets 2x normal traffic on a reference day, I (a service owner) can multiple the traffic I received on the reference date by 2. This might work for simple setups, but for larger, more complex service networks this is an oversimplification. Usually as requests flow through services they can get multiplied, optionally returned early or follow an asynchronous path to reach my service. Unfortunately just multiplying does not work here.

A simple solution here is to use an estimation model, e.g. linear regression (LR). LR tries to determine a relationship between a dependent variable and one or more independent variables when provided with sufficient data points. For the use case of throughput, the dependent variable is the throughput at a particular service (we want to calculate this) and one of the independent variables here can be the edge throughput. By creating a linear regression model, we can try to determine the relationship between the two by plotting a line which then can be used to calculate service throughput values for new edge throughput values.

![linear-regression](/img/posts/linear-regression.png)

[`simple-statistics`](https://simple-statistics.github.io/docs/#linearregression) is a tiny JavaScript library that helps you plot LR lines and use them to predict new values.

## Example 2 - Detecting drops (anomalies)

This one was an interesting problem to solve. We built a load testing capability internally at Zalando using open source [Grafana k6](https://github.com/grafana/k6) (an amazing load testing tool), hosted it in Kubernetes internally and enabled distributed load generation along with more features like finer control over manual ramping of virtual users, small framework layer over k6's JavaScript API to cater some org-specific needs and more.

We conduct large-scale end-to-end user journey load tests in preparation for Cyber Week, which is a high-sale event at Zalando. During these tests, we frequently had to shunt some traffic on the target system level because a particular service had received sufficient traffic but others needed more. In such cases, service owners would add shunt filters on their ingresses, powered by [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-usage/). Shunts, in general, are a great way to stop traffic to your service if you feel you are overwhelmed, or if an attacker is bombarding you with requests.

> My electrical engineering degree reminds me of the concept of a [_shunt_](<https://en.wikipedia.org/wiki/Shunt_(electrical)>). It is a device with low resistance that is placed in parallel to the main device/network and in case of overcurrent, the shunt allows an easier path for it flow and hence protecting the main device.

Shunting an endpoint at times would lead to a sudden drop in end-to-end latency, and a load test tool being a dumb while-loop after all, it may start executing faster than before - meaning rest of the endpoints in the script now get called more frequently. We faced such situations a few times where when a shut was applied, a sudden spike of requests was observed to the target system. This was an undesired behaviour and put the target system and customer experience stability at risk - the load test tool is a double-edged sword.

We decided to write a protection mechanism, the idea was simple: **if we see a sudden drop in the total duration of a single iteration of the script, we will inject synthetic latency (by adding a dynamic sleep() call) to keep the overall rate constant.** This would ensure that the rate of requests being sent from k6 remains constant even when the virtual user can potentially generate more. We do lose some computation power, but the target system does not see a blitzkrieg of incoming requests. How do we detect a "drop" though? Well, statistics had the answer: _exponentially weighted moving average (EWMA)_.

EWMA is a value for a time series which keeps track of a moving average where the importance of past values drops exponentially. It is widely used to smoothen a set of data points to a curve and in the financial domain to analyse volatility in market. The general equation of EWMA is as follows:

![math-20241117 (1).png](/img/posts/math-20241117.png)

* `𝜆` is the smoothing factor which tells how much weight should be given to new values in the time series.
* `rt` is the latest data point at time `t`
* `EWMA(t-1)` is the moving average value at time `t - 1` (previous)

The EWMA over time keeps track of the average of moving values and helps map a curve to the scattered points in the time series. The moving average values then can help us determine how the average value of the entity being measured moving over time. This eventually can be used to determine the range of "safe" values, and any values beyond this range would be anomalies.

![/img/posts/ewma.png](/img/posts/ewma.png)
_Source_: https://itl.nist.gov/div898/handbook/pmc/section3/pmc324.htm
### EWMA Thresholds
The moving average keeps track of the smoothened value which represents the past and the current data points. To identify anomalies, standard deviation (SD) can be put to use. A rule of thumb is **if the EWMA value is beyond +/-3 * SD, then an anomaly has occurred**. When a new data point is recorded, we can check the resultant EWMA value to determine if a breach has occurred. In code (Golang), it looks like follows:

```go
type EWMA struct {
	lambda float64
	ewma   float64
}

func (e *EWMA) AddDatapoint(value float64) {
	e.ewma = e.lambda*value + (1-e.lambda)*e.ewma
}

func (e *EWMA) GetNewEWMA(value float64) float64 {
	return e.lambda*value + (1-e.lambda)*e.ewma
}

func (e *EWMA) GetEWMA() float64 {
	return e.ewma
}

func NewEWMA(lambda float64) *EWMA {
	return &EWMA{lambda: lambda, ewma: 0}
}

type EWMADropDetector struct {
	ewma        *EWMA
	sdThreshold float64
}

func (e *EWMADropDetector) AddDatapoint(value float64, skipUpdate bool) bool {
	newEWMA := e.ewma.GetNewEWMA(value)
	sd := math.Sqrt(newEWMA * e.ewma.lambda / (2 - e.ewma.lambda))

	if skipUpdate {
		return value < newEWMA-e.sdThreshold*sd
	}

	e.ewma.AddDatapoint(value)

	return value < e.ewma.ewma-e.sdThreshold*sd
}
```

The `AddDatapoint` method accepts a new data point value and returns if the resultant EWMA breaches the defined thresholds in terms of standard deviation.

---
This sprinkle of statistics has heightened my interest in the field and am imagining more areas to use these models. I'm following this great [talk](https://www.youtube.com/watch?v=awrMqCXZunc) by Heinrich Hartmann (Senior Principal SRE at Zalando) which goes over essentials of statistics every engineer should know. 
[Statistics for Engineers](https://www.heinrichhartmann.com/pdf/Statistics%20for%20Engineers%20SRECon%20EMEA%202023.pdf)

I'm also collecting various anomaly detection models in a repository, if you are interested:
https://github.com/mohitk05/anomaly-detection