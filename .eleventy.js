const moment = require("moment");
const lazyImagesPlugin = require("eleventy-plugin-lazyimages");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

moment.locale("en");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPlugin(lazyImagesPlugin);
  eleventyConfig.addPlugin(syntaxHighlight);

  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkBefore: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
  });
  const rules = {
    table_close: () => "</table>\n</div>",
    table_open: () => '<div class="table-wrapper">\n<table>\n',
  };

  markdownLibrary.renderer.rules = {
    ...markdownLibrary.renderer.rules,
    ...rules,
  };
  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addFilter("datePretty", (date) => {
    return moment(date).format("DD MMMM YYYY");
  });

  eleventyConfig.addFilter("dateReadable", (date) => {
    return moment(date).format("LL");
  });

  eleventyConfig.addFilter("slice2", (arr) => {
    return arr.slice(0, 2);
  });
  eleventyConfig.addFilter("slice3", (arr) => {
    return arr.slice(0, 3);
  });
  eleventyConfig.addFilter("slice4", (arr) => {
    return arr.slice(0, 4);
  });
  eleventyConfig.addFilter("slice10", (arr) => {
    return arr.slice(0, 10);
  });
  eleventyConfig.addFilter("sliceLast", (arr) => {
    return arr.slice(3, arr.length);
  });
  eleventyConfig.addFilter("printthis", (...args) => {
    console.log(...args);
    return "Check console";
  });
  eleventyConfig.addFilter("timeToRead", (str) => {
    let mins = Math.ceil(str.split(" ").length / 200);
    return mins > 1 ? mins + " minutes read" : mins + " minute read";
  });
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });
  eleventyConfig.addFilter("excerptise", (str) => {
    return str ? str.concat("...") : "";
  });
  eleventyConfig.addFilter("randomSingle", (arr) => {
    return [arr[Math.floor(Math.random() * arr.length)]];
  });
  eleventyConfig.addFilter("commaSeparated", (arr) => {
    return arr ? arr.join(", ") : "";
  });
  eleventyConfig.addFilter("skipfirst", (arr) => {
    return arr.slice(1, arr.length);
  });
  eleventyConfig.addFilter("tagFilter", (arr) => {
    return arr.filter((a) => !/posts|work|life/.test(a));
  });

  eleventyConfig.addFilter("groupTags", (collections, tags) => {
    return Object.entries(collections).reduce((acc, curr) => {
      if (tags.includes(curr[0])) {
        curr[1].forEach(post => {
          if (!acc.find(p => p.url === post.url)) acc = [...acc, post];
        })
      };
      return acc;
    }, []);
  });

  eleventyConfig.addFilter("nearestTwoPosts", (arr, url, tags) => {
    if (!arr) return [];
    const index = arr.findIndex(post => post.url === url);
    if (index === 0) return arr.slice(1, 3);
    if (index === arr.length - 1) return arr.slice(index - 2, index);
    return [arr[index - 1], arr[index + 1]];
  });

  eleventyConfig.addNunjucksShortcode("newsletter_cta", function (name) {
    switch (name) {
      case "about-computer-systems":
        return getNewsletterCtaMarkup({
          name,
          title: "About Computing Systems - Newsletter",
          subtitle: "Subscribe to get notified whenever I write something new.",
          successMessage:
            "Thanks for subscribing! ❤️ Please check your email to confirm your subscription.",
        });
      case "about-computer-systems-substack":
        return `<iframe src="https://aboutcomputingsystems.substack.com/embed" width="480" height="320" style="border:1px solid #EEE; background:white;width:100%;margin-top:20px" frameborder="0" scrolling="no"></iframe>`;
    }
    return getNewsletterCtaMarkup(name);
  });
};

function getNewsletterCtaMarkup({ name, title, subtitle, successMessage }) {
  return `<!-- Begin Mailchimp Signup Form -->
    <link href="//cdn-images.mailchimp.com/embedcode/classic-071822.css" rel="stylesheet" type="text/css">
    <style type="text/css">
        #mc_embed_signup{background:#fff; border: 1px solid #ccc; padding: 5px 20px; clear:left; font:14px Helvetica,Arial,sans-serif;font: inherit;margin-top:15px}
        #mc_embed_signup .mc-field-group{padding-bottom:0}
    </style>
    <div id="mc_embed_signup">
        <form action="https://mohitkarekar.us8.list-manage.com/subscribe/post?u=8f017e449a2470cc7d9202109&amp;id=8ac6995cf0&amp;f_id=000364e0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_self">
            <div id="mc_embed_signup_scroll">
            <h2 style="text-align: center;margin-bottom:5px">${title}</h2>
            <p style="text-align: center; margin-top:0">${subtitle}</p>
    <div class="mc-field-group">
        <label for="mce-EMAIL" style="font-size:1rem">Email Address  <span class="asterisk">*</span>
    </label>
        <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL" required>
        <span id="mce-EMAIL-HELPERTEXT" class="helper_text"></span>
    </div>
        <div id="mce-responses" class="clear foot">
            <div class="response" id="mce-error-response" style="display:none"></div>
            <div class="response" id="mce-success-response" style="display:none"></div>
        </div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
        <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_8f017e449a2470cc7d9202109_8ac6995cf0" tabindex="-1" value=""></div>
            <div class="optionalParent">
                <div class="clear foot">
                    <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button">
                    <p class="brandingLogo"><a href="http://eepurl.com/iis989" title="Mailchimp - email marketing made easy and fun"><img src="https://eep.io/mc-cdn-images/template_images/branding_logo_text_dark_dtp.svg"></a></p>
                </div>
            </div>
        </div>
    </form>
    </div>
    
    <!--End mc_embed_signup-->`;
}
