---
title: Slate - A playground for ideas
tags:
  - idea
  - tools
  - projects
date: 2024-03-16
description: Code notebooks with seamless LLM integration. Code when you want to, skip when you don't.
gardenTag: Seedling
coverImage: /img/posts/slate-cover.jpg
coverImageHeight: 360px
---
<style>
.content img {
	max-width: 100%;
}
</style>
> You can try Slate at [try-slate.com](https://try-slate.com). I have also recorded a short demo that you can watch on [Loom](https://www.loom.com/share/bcde36f3fa424b2f80c860def0b3f164?sid=94c5874f-b815-45d8-8a1d-81a46f013a71).

I have pondered over the idea of visual programming and enriched code execution environments for quite some time. My previous project [unipipe](/posts/2021/unipipe-executor), played with the idea of block-based visual programming in the browser. I experimented a lot with JavaScript execution and providing ready-made blocks that could be plugged into an existing flow. With an increased interest in large language models, I was tempted to extend this idea to include a LLM-based block in the environment that could take in an input and apply a prompt over the input data.

And I did implement that, it looked something like this. The _custom script_ block contains a script that takes in a prompt and runs it by calling an OpenAI API, and the resultant output is displayed in a HTML block.

<img src="/img/posts/unipipe-llm.png" style="width:100%;max-width:100%;margin:auto;display:block" >

Well, the idea of block-based programming is a great programming challenge but it has a very limited usability scope. This paradigm shines bright for use cases like graphics programming and popular tools like Blender and vvvv use visual block-based models to allow creating re-usable, modular transformations. Daily programming though seems restricted in this format - the need to visual create logic isn't very appealing and can slow down the process.

While block-based programming does not have several use cases, a modified, restricted version is extremely popular. I'm talking about code notebooks such as Jupyter Notebooks and ObservableHQ notebooks. These are similar to block-based programming but restrict flow creation to a single dimension, i.e. each block can only have a single successor. This restriction works really well because for use cases like data visualisation and transformation you generally work in steps, modifying and visualising your data each time.

Notebooks are also a great combination of code and runtime - i.e. more feature-rich than just a file and more portable than an IDE-based project. For use cases that fit into this category, a notebook works really well.

An idea recently struck me and I wanted to try it out. LLMs today are great with dealing with data and understanding natural instructions. What if I could combine them in a code notebook? A notebook where you can code as well as write LLM prompts that operate on the same set of data - a seamless transition between regular coding and natural language instructions. Code when you want the power of text-based code, offload it to LLMs when you don't feel like it! I hacked a quick prototype, I call it [**Slate**](https://try-slate.com).

![slate-preview](/img/posts/slate-1.png)
Slate provides you a notebook environment where you can write code and LLM prompts while working with a dataset. Instead of writing complex visualisation code, you can write natural language prompts to specify how you want your data visualised or transformed. Slate uses a charting library underneath to create charts for you in combination with OpenAI's LLM models.

![slate-preview](/img/posts/slate-2.png)

Visualisation isn't the only thing you'd want to offload to LLMs. Sometimes simple or complex data transformations are tiring to write - why not ask an LLM to do it? Slate's prompt blocks seamlessly integrate with rest of the notebook and operate within the context.

To use Slate, head to https://try-slate.com and start creating. Slate uses OpenAI APIs to execute prompt blocks and asks for an API key when you begin. Everything is local to your browser and the notebook can also be exported as a file, which can later be imported to continue your work. To save on prompt execution costs, Slate uses a meta-technique in case of array-like datasets to apply transformations and hence can be considered to be constantly (O(1)) related to the size of your data.

Current set of features include:
* Code, Prompt, HTML and Dataset (CSV & JSON) blocks
* Run a notebook with any combination of available blocks
* Download a notebook as a file
* Load a notebook from a file

Give it a try and send in your feedback in the comments below or to my email.

