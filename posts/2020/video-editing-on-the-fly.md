---
title: Editing Videos, Right Before Streaming
eleventyExcludeFromCollections: true
---

Create a utility which accepts a syntax, reads it and applies relevant changes to a video file while streaming it.

For e.g. if the syntax says 'trim 3-10' the video file is piped through a processing function which streams only the 3rd minute to 10th minute part of the video.

Parts:
the syntax - language + interpreting it
the utility - video trimming while streaming

to begin with, try trimming

Frontend should be able to use the video as any other video file.

Frontend -> video url -> fetch video -> process using provided instructions -> stream

Implement util in Rust

Notes: amazing article on closures - https://doc.rust-lang.org/book/ch13-01-closures.html
