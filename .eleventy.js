const moment = require('moment');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const markdownIt = require('markdown-it');
const markdownItAnchor = require("markdown-it-anchor");

moment.locale('en');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('img');
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(lazyImagesPlugin);

    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    }).use(markdownItAnchor, {
        permalink: true,
        permalinkBefore: true,
        permalinkClass: "direct-link",
        permalinkSymbol: "#"
    });
    const rules = {
        table_close: () => '</table>\n</div>',
        table_open: () => '<div class="table-wrapper">\n<table>\n',
    }

    markdownLibrary.renderer.rules = { ...markdownLibrary.renderer.rules, ...rules };
    eleventyConfig.setLibrary("md", markdownLibrary);

    eleventyConfig.addFilter('datePretty', date => {
        return moment(date).format('DD MMMM YYYY')
    });

    eleventyConfig.addFilter('dateReadable', date => {
        return moment(date).format('LL')
    });

    eleventyConfig.addFilter('slice3', arr => {
        return arr.slice(0, 3)
    })
    eleventyConfig.addFilter('slice4', arr => {
        return arr.slice(0, 4)
    })
    eleventyConfig.addFilter('sliceLast', arr => {
        return arr.slice(3, arr.length)
    })
    eleventyConfig.addFilter('printthis', (...args) => {
        console.log(...args);
        return 'Check console'
    })
    eleventyConfig.addFilter('timeToRead', (str) => {
        let mins = Math.ceil(str.split(' ').length / 200)
        return mins > 1 ? mins + ' minutes read' : mins + ' minute read';
    })
    eleventyConfig.setFrontMatterParsingOptions({
        excerpt: true,
        excerpt_separator: "<!-- excerpt -->"
    });
    eleventyConfig.addFilter('excerptise', str => {
        return str ? str.concat('...') : ''
    })
};