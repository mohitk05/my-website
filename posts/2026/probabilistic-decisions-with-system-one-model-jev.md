---
title: Probabilistic decisions with TypeSafe's System One model Jev
date: 2026-09-17
description: A new model has popped up from TypeSafe which only produces structured responses and has great use cases in existing agentic tooling
tags:
  - artificial-intelligence
  - llms
---
TypeSafe's Jev is a new _System One_ model which makes _"fast, structured decisions for software"_. There are three primitives in Jev:
1. Choice: You ask the model to pick the best choice from a set based on a _state_.
2. Score: You ask the model to score a situation in a range.
3. Noul: You ask the model a yes/no question and the probability of a _yes_.

Jev is a general classifier which works on arbitrary input data and responds extremely fast. It does not need to be trained like usual classifiers, making it really powerful.

The three primitives are widespread across agentic tooling and applications and even beyond that in general software engineering. The core idea is to accept the uncertainty with certain kinds of tasks and find the best way through them. Over the last few days, X community has gone crazy over Jev's launch and has been exploring unique use cases.
## Why all the hype
I was genuinely excited when I first tried this model and this was the first time I was actively following this release on X. Something clicked for me, most probably the primitives and the idea of building on top of them in existing software instead of simply re-generating the whole code and looking at systems as black boxes.

The _hype_ around Jev is mostly due to everyone relating to the primitives bit, and because it is extremely fast. Correctness is still an open question for me, but since it's all probabilities, you can implement your own guardrails.
## My experiments: tool selection in agents
I have been experimenting with local LLMs in the browser recently and trying to make a full-featured agent possible in the browser, i.e. the model is loaded locally using WebLLM and it can use various tools from user-configured MCP servers, connected directly in the browser via HTTP SSE or via a `stdio` bridge proxy.

One of the primary limitations with browser-local LLMs is the model size. There is an initial cost of loading the model which limits the size of the model you could use, and eventually the number of parameters of this model and its functionality. I was experimenting with Qwen 3 8B for this purpose but WebLLM does not support tool call for this model directly so I had to implement some kind of hacky technique myself where I would send a list of tools to the model and ask it to choose the best one. This was indeed slow.

I tried this today with Jev and changed the workflow to do the following:
1. User sends a message
2. The agent loop asks Jev two questions:
	1. To select the best tool out of the available ones from configured MCPs
	2. Pick the best option for tool call arguments from a set of possible arguments (parsed with heuristics)
3. Jev responds extremely quickly with the best match
4. The agent executes the tool
5. The response and initial message is then sent to the main model (Qwen3) for response generation

This worked quite well, the responses from Jev are extremely fast and structured. Here's what the request to Jev API looks like. It has one `state` and multiple `questions` of one of the primitive types.

```json
{
    "state": "User message: Who am I on Github?",
    "questions": {
        "tool": {
            "type": "choice",
            "instructions": "Which tool, if any, should be used to respond to this message?",
            "criteria": {
                "__none__": "No tool is needed to respond to this message; a plain reply is enough.",
                // other tools ...
                "get_me": "Get details of the authenticated GitHub user. Use this when a request is about the user's own profile for GitHub. Or when information is missing to build other tool calls.",
                "get_release_by_tag": "Get a specific release by its tag name in a GitHub repository",
                "get_tag": "Get details about a specific git tag in a GitHub repository",
                "get_team_members": "Get member usernames of a specific team in an organization. Limited to organizations accessible with current credentials",
                "get_teams": "Get details of the teams the user is a member of. Limited to organizations accessible with current credentials"
                // other tools ...
            }
        }
    }
}
```

The response looks like follows:
```json
{
    "model": "jev-1.13.0",
    "answers": {
        "tool": {
            "type": "choice",
            "choice": "get_me",
            "confidence": 0.91,
            "probabilities": {
                "__none__": 0.08,
                // other probabilities ...
                "get_me": 0.92,
                "push_files": 0,
                // other probabilities ...
            }
        }
    },
    "usage": {
        "input_tokens": 2360,
        "output_tokens": 440
    }
}
```

Here, Jev returned back with 91% confidence that `get_me` is the relevant tool here.
## What folks are building with Jev
I have come across multiple use cases for Jev and what I'm seeing is it has opened up a way of modelling problems where determinism can be added when there's some level of uncertainty. Think of all the existing use cases for classification - Jev would be a great tool for these, and more! Here's what people have been building on X.
### Harnesses
Many steps in a harness can be done very well and quickly by Jev. The one I already mentioned was tool selection. Others include model routing, i.e. picking the right models for a task to optimise either performance or cost.
<blockquote class="twitter-tweet"><p lang="zxx" dir="ltr"><a href="https://t.co/CF54CU9Ddz">https://t.co/CF54CU9Ddz</a></p>&mdash; Sydney Runkle (@sydneyrunkle) <a href="https://x.com/sydneyrunkle/status/2100754364545761643?ref_src=twsrc%5Etfw">September 18, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

### Browser agents and computer use
One of the problems in interacting with browser UIs via natural language prompts has been the indeterminism while converting the prompt to UI element identifier. Using Jev, this could be converted into a decision problem: _given the current DOM tree, which element should be interacted with to perform the next action?_

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Breaking: Browser Use + Jev = Ultrafast ⚡<br><br>Findings flights took 7s and cost only $0.0039 🤯<br><br>&gt; new action space every step<br>&gt; DOM state space<br>&gt; small LLM fallback to type<br><br>(this video is at 1x speed btw)<br><br>Built a tiny open source browser agent. try it below ↓ <a href="https://t.co/AplCBRYC5o">pic.twitter.com/AplCBRYC5o</a></p>&mdash; Gregor Zunic (@gregpr07) <a href="https://x.com/gregpr07/status/2100411066966749359?ref_src=twsrc%5Etfw">September 17, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>

This concept can also be extended for E2E testing and people have shared working examples, especially on mobile where this has been hard before.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">e2e + jev from <a href="https://x.com/typesafeai?ref_src=twsrc%5Etfw">@typesafeai</a> ⚡<br><br>I&#39;m building an open-source framework for running e2e tests with agents. supports web, mobile (and more!)<br><br>available soon: <a href="https://t.co/G3XB2L8tiC">https://t.co/G3XB2L8tiC</a> <a href="https://t.co/LvJgAbgvBb">pic.twitter.com/LvJgAbgvBb</a></p>&mdash; Oskar (@o_kwasniewski) <a href="https://x.com/o_kwasniewski/status/2100966838905585687?ref_src=twsrc%5Etfw">September 18, 2026</a></blockquote> 
<script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>
### Command safety classification in auto-mode
Classifying whether a command is safe to be run locally by an agent could be handed over to Jev. I am not sure how successful this would be, but seems like a valid use case.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">We&#39;re seeing extraordinary results from <a href="https://x.com/typesafeai?ref_src=twsrc%5Etfw">@typesafeai</a>. Default mode in 𝚏𝚡 is auto, with a safety reviewer analyzing every command.<br><br>That reviewer runs on GPT Luna today. Jev is up to 18x faster (p95) *and* more accurate. It&#39;s coming to <a href="https://x.com/vercel?ref_src=twsrc%5Etfw">@vercel</a> AI Gateway and likely new default. <a href="https://t.co/y5tFnlFN2l">https://t.co/y5tFnlFN2l</a></p>&mdash; Guillermo Rauch (@rauchg) <a href="https://x.com/rauchg/status/2100307962262872105?ref_src=twsrc%5Etfw">September 16, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>
### Classifying and routing tickets/issues/forms
Jev is being used to classify an incoming support request as one of the predefined types. This works great due to the `choice` primitive and is super fast with Jev.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Jev will be super helpful for agents to make split second decisions in workflows, data classification, judgment calls, and hundreds of other use-cases in the enterprise.<br><br>Here&#39;s a quick demo with Box and Jev to make that real. The demo pulls an incident report from Box, asks… <a href="https://t.co/U8SJ7W10WO">pic.twitter.com/U8SJ7W10WO</a></p>&mdash; Aaron Levie (@levie) <a href="https://x.com/levie/status/2101007708044574906?ref_src=twsrc%5Etfw">September 18, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>
### Higher programming primitives based on Jev
An interesting take is embedding Jev's primitives into code directly and creating programming syntax which works on uncertainty. Imagine being able to branch based on probabilistic conditions. I had thought of this early when I was exploring LLMs and thinking about how they can be embedded into software, but a classifier works better than general purpose LLMs.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I&#39;ve seen people describe Jev as an &quot;AI if statement&quot;. But what if it actually WAS an if statement?<br><br>Introducing Probably: a programming language powered by Jev: <a href="https://t.co/Sg8lTR4Zx3">https://t.co/Sg8lTR4Zx3</a><br><br>Jev baked into the language. “feels” asks a question. “match” routes between descriptions.… <a href="https://t.co/xSxQIgFz8X">pic.twitter.com/xSxQIgFz8X</a></p>&mdash; Steve Faulkner (@southpolesteve) <a href="https://x.com/southpolesteve/status/2100767781868150938?ref_src=twsrc%5Etfw">September 18, 2026</a></blockquote> <script async src="https://platform.x.com/widgets.js" charset="utf-8"></script>
## What next
I recommend you to give Jev a try. These primitives make more sense to me for building software than general purpose LLMs in many use cases currently. See if some of your existing problems are decision-based and try to integrate Jev there. You'll notice a significant difference.