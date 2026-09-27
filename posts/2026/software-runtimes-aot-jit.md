---
title: "Software runtimes: AOT compiled, interpreted, JIT compiled and more"
date: 2026-09-26
tags:
  - compilers
  - software-engineering
  - systems
---
Lately there has been a lot of talk around the benefits of building _native_ or _close-to-metal_ applications on X and I wanted to go back and understand the different ways you can _build_ software today in order to compare these methods better. Essentially answer questions like: _What does building native software even mean, are ahead-of-time compiled systems always better than interpreted ones, and are there other ways to build software?_
## The two primary models
Most of us are aware of these two ways to build and run software systems using programming languages and tools that provide the underlying runtime/mechanism to make it all possible:
1. Ahead-of-time (AOT) compilation
2. Interpreted execution (w/ and w/o JIT)
### AOT-compiled systems
_Ahead-of-time_ literally means the source code for these systems is compiled before it is executed, i.e. at build/compile time. Typical examples include software built in languages like C, C++, Rust and Go. These languages have compilers which translate the logic described in the source code down to _machine_ code, which is then executed.

"Machine" code is a bit ambiguous here as what most of the compilers output is the low-level code understood by the target architecture for which the program was built, so in a way it is a specific type of code meant to be run on a specific type of hardware - examples being x86-64, ARM64 and RISC-V - known as _instruction set architectures (ISAs)_. They contain a set of instructions and registers agreed upon as the interface exposed by the CPU to software for executing control and data logic.

E.g. this is how the following piece of C code looks in x86-64's instruction set (thanks to [Compiler Explorer](https://godbolt.org/)):
```c
int square(int num) {
    return num * num;
}
```

x86-64:
```txt
"square":
        push    rbp
        mov     rbp, rsp
        mov     DWORD PTR [rbp-4], edi
        mov     eax, DWORD PTR [rbp-4]
        imul    eax, eax
        pop     rbp
        ret
```

It's called an instruction set because that's what it is. This is the lowest form of software there can be before hardware. The CPU is programmed to understand these instructions and perform actions as per the type of the instruction using predefined registers (places to store bits during computation). An infinite hardware loop goes around iterating through each instruction, performing the corresponding action, storing the results and so on.

In the ISA above, `push`, `mov`, `imul` are instructions that correspond to logic, and `rbp`, `edi`, `eax` are registers that hold data. Compilers use this interface to execute high-level program logic on low-level hardware.

<video lazy autoplay muted loop class="big-video">
  <source src="/img/posts/aot-compiled-fetch-execute.mp4" type="video/mp4" />
</video>

> So, **for AOT-compiled systems:**
> **Input:** High-level source code
> **Output:** Machine code - ISA for target architecture (hardware)
> **Who runs the logic:** CPU
### Interpreted systems and just-in-time (JIT) compilation
The second set of systems involve high-level source code executed by interpreting its logic in a runtime. These languages are usually more _dynamic_, have less-stricter rules than AOT-compiled languages because they can build higher-level abstractions in the runtime that the CPU/OS may not provide.

The runtime is another program which interprets the input source code and executes it according to the expected behaviour. E.g. `1 + 2` in JavaScript would be parsed to an AST and then the JS engine would actually add the two numbers when it identifies that the source code intends to perform addition. This is very similar to what happens in AOT-compiled systems but instead of using CPU as the platform to run pre-defined instructions, the runtime becomes that layer.

<video lazy autoplay muted loop class="big-video">
  <source src="/img/posts/interpreted-execution.mp4" type="video/mp4" />
</video>

_Why would one want to do this anyway?_ Think of scripting languages and enclosed environments where you want to provide the user the ability to program some behaviour e.g. a web browser! Another reason is portability - you can decouple the hardware from source code by building a layer on top of hardware which runs a special format and then convert source code to this special format. This is how the JVM works.

In terms of execution hierarchy, the source code is interpreted and run by the language runtime, which in turn runs on the hardware (unless you write the runtime in another or the same interpreted language). Since this is one level above machine code, the performance is expected to be lower than AOT-systems if naively compared.

> **For interpreted systems:**
> **Input:** High-level source code
> **Output:** No explicit output, a runtime needed to execute
> **Who runs the logic:** Runtime/execution engine
#### Just-in-time (JIT) compilation
An ingenious solution to improving the performance of interpreted systems is to do just-in-time compilation of frequently executed code. **As a program runs, the runtime observes its behaviour and identifies parts that can be compiled down to machine code instead of having to interpret and execute them in the runtime**.

In JS, the v8 engine does extremely powerful JIT compilation that makes running it in browsers and on servers efficient and fast. JVM has been doing JIT for years and has been crucial in making JVM-based software fast.

Usually, many interpreted language runtimes convert the high-level source code to a low-level intermediate representation often called _bytecode_. This custom representation has only the required level of details to be able to execute it - consider it to be the "ISA" of the runtime. The input of JIT is then is this bytecode and the output is machine code. The compiled code is exposed to the runtime via a function pointer which can be executed from the runtime when the code is to be run.

> **For interpreted systems with JIT:**
> **Input:** High-level source code
> **Output:** Intermediate bytecode, hot code compiled to machine code
> **Who runs the logic:** Runtime/execution engine + CPU (for hot code)
#### JIT in v8 JS Engine
Many production engines using JIT implement a multi-tiered approach at runtime. v8, the JavaScript engine powering Chromium browsers and Node.js on the server, uses at least three kinds of JIT, a.k.a. _optimising compiler_ stages. [This article](https://v8.dev/blog/maglev) on the v8 blog talks about the most recent addition named _Maglev_ which forward-packs JIT as soon as the program starts running and provides a significant performance improvement.

<video lazy autoplay muted loop class="big-video">
  <source src="/img/posts/maglev-jit-v8.mp4" type="video/mp4" />
</video>

Briefly, it does the following:
1. It uses a custom intermediate static single-assignment (SSA) representation, in which a variable is assigned a value only once and any further updates should be done by assigning the value to a new variable while manipulating the old value, to represent program execution graph and attach runtime information to it.
2. It saves results of branches and loops such that these operations can be replayed if necessary without having to run the program. This information is attached to the SSA IR. While doing so, it adds de-optimisation safeguards, i.e. in case the shape of a value (e.g. an object) changes during execution, the compiled form should bail out and fall back to the interpreted version.
3. It then performs register allocation to map variables in the SSA to registers on the hardware. This is a common stage in compilers as _variables_ in high-level code assume that memory is unlimited. The compiler maps this concept to the limited hardware constraints by smartly allocating values with a finite number of _registers_.
4. Finally, the machine code is generated a function reference is exposed to the runtime. Next time the function runs, it directly runs the compiled machine code.

## Is AOT-compiled always better?
One might be tempted to assume that AOT-compiled software is always better than JIT-compiled, JIT was indeed a solution to the slowness of interpreted languages. This is indeed true for several use cases, especially where performance and startup time is important. As most of the heavy work is done during compile time, startup of these programs is very fast.

Several languages also include some runtime code that gets compiled down to machine code along with the user program. E.g. Go has its runtime, a garbage collector, standard packages. There is some pre-work needed in AOT-compiled languages too before the control flow reaches user code, but this is usually extremely minimal. AOT compilation involves several optimisation passes which statically analyse the generated code and transform it over and over to cover numerous common cases that impact performance. Constant folding is one example.

```c
// Constant folding replaces expressions that evaluate to a constant
// with the constant value to avoid re-calculation
int MY_CONSTANT = 100 * 5 * 20; // => MY_CONSTANT = 10000
```

With interpreted JIT languages, startup is usually slower than AOT ones as the first code that runs on the CPU is the runtime itself. The runtime then identifies hot code that is lowered to machine code and eventually performance increases for frequently access paths. This already hints towards where JIT might perform at par or better than AOT. JIT compilation inherently has a feedback loop where information from runtime is fed back to the interpreter which acts on it.

If you think about it, **use cases where workload changes over time and the program runs for a long time (e.g. web servers), JIT compilation can be very useful**. The continuous feedback loop adapts the execution performance as per the workload, optimising frequently executed code _and_ de-optimising what is no longer considered _hot_. And this is evident through history: JVM-based web servers, while memory hungry, perform extremely well at high-throughput. JavaScript in the browser and on the server with Node.js has come a long way since it was first introduced. Over time, advanced JIT compilation techniques in JS engines have made JavaScript very fast.

**_So the answer is no, AOT-compiled might not always be fast, especially when peculiar runtime behaviour exists in the application._** Static analysis and optimisation cannot identify these runtime properties and hence cannot use them to perform optimisations AOT.

Some specific examples where JIT-compiled code works better:
* Branching logic where one branch is dominant, e.g. a large switch case or dynamic method calling on objects implementing the same interface
* Variable folding, i.e. when a variable becomes a constant at runtime due to how it is used
* Optimising for the hardware the program is running on by JIT-compiling catering to that hardware
## A mix of AOT- and interpreted JIT-compiled systems
You might think though, why cannot AOT-compiled languages include a logic to dynamically adapt the runtime itself while the program runs, or include a JIT compiler. This is promising and production runtimes do combine the two approaches to get the best of both worlds. 
### Android Runtime
One of the most prominent runtimes that does this is the **Android Runtime (ART)**. I recently read about ART and it sounded very similar to what a browser does but with AOT compilation. There's one caveat with the Android platform though. While an application is built for "Android", in the field Android runs on a wide range of devices running on different architectures. Hence, the _AOT compilation happens on the device_, customised to the device architecture using tooling embedded in the Android OS.

When an Android app is built, the source code is lowered to an intermediate representation and then packaged for distribution (`.apk`). After the app is installed on a device, ART immediately compiles most of the application code to machine code to ensure fast startup and efficient performance using `dex2oat`. When the app is started, ART provides an environment for the app code to run, similar to how a browser runs JavaScript. While doing so, it uses [JIT-compilation](https://source.android.com/docs/core/runtime/jit-compiler) to optimise _hot_ code and replaces the older machine code with an optimised version which runs faster.
### Extended Berkeley Packet Filters (eBPF)
I found out that OS kernels do not use JIT directly, but one of the prominent use cases where JIT is used is [_eBPF_](https://ebpf.io/what-is-ebpf/#jit-compilation). I know eBPF from observability, but in general it allows running custom code to apply filtering to network packets at the kernel level without changing the kernel code. JIT is useful here to allow dynamic selection of these pieces of code and make them performant by compiling to machine code at runtime.
## The nuance
When you read a post saying _"running closer to metal is best"_ or _"native code is better"_ - there's always nuance to what they are trying to say. Source code compiled to machine code AOT is the best in "absolute" terms, but might not be when running a real production application. The dynamic nature of interpreted runtimes can provide some edge in certain use cases, while AOT-compiled software will definitely perform better in others - and it is important to identify this than to conclude one method is always better.

I learned a lot while reading for this article and refreshed some old knowledge. And there's a lot of [detail](https://johnsalvatier.org/blog/2017/reality-has-a-surprising-amount-of-detail) as you go down these topics.