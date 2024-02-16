---
title: Concurrent Programming Models and Human Thinking
date: 2024-01-28
---
## Idea
How major [[beginning-with-languages|programming languages]] expose [[concurrency-parallelism|concurrent]] programming and how does it compare with how humans think about concurrency. Finally propose/choose an ideal model.
It could focus on the **readability** of concurrent programs. How easy is it to read large codebases?

Readings:
* Multitasking vs. multiplexing: Toward a normative account of limitations in the simultaneous execution of control-demanding behaviors: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4845905/
* Efficient multitasking: parallel versus serial processing of multiple tasks: https://www.frontiersin.org/articles/10.3389/fpsyg.2015.01366/full
* The role of concurrency in an evolutionary view of programming abstractions: https://arxiv.org/pdf/1507.07719.pdf
* Computational neuroscience: https://en.wikipedia.org/wiki/Computational_neuroscience
* How humans think: [[brains-and-emotions|Cognitive Science]] approach to human task processing
* [Multiple Concurrent Thoughts: The Meaning and Developmental Neuropsychology of Working Memory](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2925295/)
* [MultiLogo: A Study of Children and Concurrent Programming](https://web.media.mit.edu/~mres/papers/MultiLogo/MultiLogo.html)
* [Cognitive Loads in Programming](https://rpeszek.github.io/posts/2022-08-30-code-cognitiveload.html)
* [A Multi-Level Study of Undergraduate Computer Science Reasoning about Concurrency](https://dl.acm.org/doi/pdf/10.1145/3304221.3319763)
* [Gardeners and Cinema Tickets: High School Students'Preconceptions of Concurrency](https://www.tandfonline.com/doi/epdf/10.1076/csed.11.3.221.3831?needAccess=true)
* https://api.pageplace.de/preview/DT0400.9781420072143_A37941791/preview-9781420072143_A37941791.pdf
* https://psychology.stackexchange.com/questions/1946/difference-between-parallel-processing-done-by-human-brain-and-by-computers
* [Mastering Concurrent Computing through Sequential Thinking](https://cis.temple.edu/~wu/teaching/Spring2020_CIS5644_Distributed_Computing/Concurrency.pdf)
* 

Ideas
* Using distributed cognition to offload the process to keep track of concurrent processes
	* A graphical representation of the process which shows current process with a visualization of other possible running processes.


Cognitive load of general software development:
* https://thevaluable.dev/cognitive-load-theory-software-developer/
* https://calnewport.com/our-brains-are-not-multi-threaded/
* https://rpeszek.github.io/posts/2022-08-30-code-cognitiveload.html
* https://stitcher.io/blog/a-programmers-cognitive-load

Idea: Brain and computation concurrency
* Comparing concurrency models of the brain and computers
* How do we think simultaneously?
* Which concurrency model is closest to brain?
* Which concurrency model creates least cognitive load?

------------
## Milestone 1 Deliverables
In this first milestone, please describe your project, the project topic/theme, and your
problem statement. This includes, but is not limited to:
* What broad topic are you studying (e.g., learning and education, design, HCI)?
	* Psychology, learning and education
	* Concurrency in human thought, comparing how the human brain and computers approach concurrency
* What specific research questions are you trying to answer through your project?
	* How do humans handle concurrent tasks?
	* Do we think/process information in parallel?
	* How does it compare to computational models of concurrency?
	* What is a good computational model for human concurrent thinking?
		* Do humans think about computational concurrency similar to how we process concurrent information? (possible survey/interviews)
	* Which programming language offers a low-cognitive-load concurrency model?
* Why are you interested in studying this question?
	* I am interested in computational concurrency and how programming languages expose it to programmers.
	* I want to first understand how humans think, especially concurrently. I know we process multiple kinds of information together. But how?
	* I am interested in programming language design and the HCI aspect of them. As a result of this review, I want to compare how various programming languages expose concurrency and look for a good model that provide the least cognitive load while thinking about concurrency in software systems.
* Why is this important?
	* Concurrency is a common technique in computer programs to achieve greater performance and throughput
	* Providing a model that is natural to human thinking can boost developer productivity while developing programs
* Initial research design and expected outcome:
	* 

Literature Review Track: 
* What are some relevant topics of literature you will be looking at?
* What do you expect to find at the end of your literature review project?
* How are you going to conduct the review moving forward?
* We also expect that you have identified 10-15 literatures as relevant and list them in your submission. You don’t have to read the listed literature in detail just yet, but why and how are they relevant to your research questions? At least 70% of your chosen literature must also have been published within the last 15 years.


### Papers
1. Parallel and serial neural mechanisms for visual search in macaque area V4: https://pubmed.ncbi.nlm.nih.gov/15845848/
2. Towards a Neurodynamical Model of Concurrent Thoughts: Reconciling Divided Attention and Unified Experience: https://journals.physiology.org/doi/epdf/10.1152/physrev.00035.2008
3. Computational approaches to analogical reasoning: A comparative analysis: https://www.sciencedirect.com/science/article/pii/0004370289900039
4. Toward a richer understanding of human cognition: Unleashing the full potential of the concurrent information-processing paradigm: https://www.sciencedirect.com/science/article/pii/S0732118X21000222
5. A roadmap for the study of conscious audition and its neural basis: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5206271/
6. Evidence for increased parallel information transmission in human brain networks compared to macaques and male mice: https://www.nature.com/articles/s41467-023-43971-z
7. Working Memory and Attention – A Conceptual Analysis and Review: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6688548/
8. Threaded Cognition: An Integrated Theory of Concurrent Multitasking: https://psycnet.apa.org/fulltext/2008-00265-005.pdf?auth_token=b899abe3821ed82e96c7a61cfb557a35f00e3109
9. The problem of multimodal concurrent serial order in behavior: https://www.sciencedirect.com/science/article/pii/S0149763415001943
10. The role of prefrontal cortex and posterior parietalcortex in task switching: https://www.pnas.org/doi/epdf/10.1073/pnas.240460497
11. Serial Modules in Parallel: The Psychological Refractory Period and Perfect Time-Sharing: https://psycnet.apa.org/fulltext/2001-18918-010.pdf?auth_token=f17cfbe1f675dabaf8f0de4d3563311feeeaa421
12. Biological Metaphors in he Design of Complex Software Systems: https://docs.lib.purdue.edu/cgi/viewcontent.cgi?referer=&httpsredir=1&article=2448&context=cstech