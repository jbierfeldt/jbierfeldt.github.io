---
layout: "post"
title: "A Thank You Note to Myself for Writing Readable Code"
date: "2018-07-05 14:16"
---

If you've been programming or writing software for more than 45 minutes, you've definitely encountered this [adjuration](https://www.itworld.com/article/2898840/developers-say-the-best-code-is-readable-code.html): *Writing good code means writing readable code.*

Following this maxim is sometimes difficult for beginners, especially when you are working on a project whose code you never expect to be displayed on someone else's monitor. It's easier to encourage yourself to keep up good coding hygiene when you are collaborating with a team or know that someone else is going to pick the project up after you, but maintaining a clean, readable codebase for personal projects is a little more difficult.

But today I ran into a reminder of how important this practice can be, even if it's sometimes tempting to speed past carefully naming every function and to simply call them all ``dinguscallback2`` or ``getfunc3``.

When I checked my email this morning, I found an email from a total stranger asking for help implementing a [little buzzfeed-style quiz generator](https://github.com/jbierfeldt/bf-quiz) that I had written four years ago and hadn't given a single thought to since. The main text of the email asked:

*The userAnswers array captures the full collection of user clicks, including them changing their mind. Thus even if there's only five questions in the quiz, userAnswers might have seven elements.*

*Is there an easy way to generate a vector of their final answers?*

I read this an panicked a little. On the one hand, I was excited that someone had not only found one of my repos, but had decided to implement it in one of their own projects, and I naturally wanted to help them. On the other, I hadn't looked or thought about this repo in over four years and honestly had no idea what anything in their email was referring to or how to even begin going about helping them solve their issue.

I nervously opened the codebase, fully expecting to waste at least an hour wading through some spaghetti code and trying to remember what exactly this program did and how exactly it did it. What I found though was a nice surprise. I found the code to be somewhat neatly organized in a version of the [module pattern](https://yuiblog.com/blog/2007/06/12/module-pattern/) that I had apparently just learned at the time I wrote it, complete with instructive comments and usefully named functions and variables (``writeQuiz``, ``calcResult``, and ``checkInputs`` contain much more information than ``myfunc``).

Granted, there were a few things that made me cringe and that I would do totally differently if I were to completely rewrite the software today (such as the way I  manually manipulated class names in the DOM), but for the most part, I found myself able to quickly understand exactly what every part of the codebase was, what it did, and where the person who emailed me's problem lay. I caught the bug right away, fixed it, and uploaded the updated version of the code to Github, all within five minutes or so.

Honestly, if I had opened this code and found it illegible and confusing, I probably wouldn't have given it the time required to fix it and would have ended up just deleting the repo and apologizing to the person who emailed me.

This is a thank you note to my past self. Thank you for taking the time to write clear, readable code, even if a lot of it isn't as efficient or succinct as it could be. Someone else was able to read it well enough to implement it in one of their own projects, and I was able to read it well enough to quickly spot and fix a bug.

Even if you don't think your code is destined to appear before someone else's eyes, remember, it could appear before your own in the future, maybe years in the future, and that is more than enough time to let all the details of the project that you've stored in your own mental RAM to fall away, causing you to re-enter almost as clueless as someone who has never seen the code before. Do yourself and your futureselves a favor and remember to always write clean, logical, and readable code; it'll make you a [better developer](https://medium.com/@CodementorIO/good-developers-vs-bad-developers-fe9d2d6b582b) anyway!
