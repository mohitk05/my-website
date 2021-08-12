const moment = require('moment');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const markdownIt = require('markdown-it');
const markdownItAnchor = require("markdown-it-anchor");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

moment.locale('en');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('img');
    eleventyConfig.addPassthroughCopy('fonts');
    eleventyConfig.addPassthroughCopy('css');
    eleventyConfig.addPlugin(lazyImagesPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);

    let markdownLibrary = markdownIt({
        html: true,
        breaks: true,
        linkify: true
    })
        .use(markdownItAnchor, {
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
    eleventyConfig.addFilter('slice10', arr => {
        return arr.slice(0, 10)
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
    eleventyConfig.addFilter('randomSingle', arr => {
        return [arr[Math.floor(Math.random() * arr.length)]]
    })
    eleventyConfig.addFilter('commaSeparated', arr => {
        return arr ? arr.join(', ') : '';
    })
    eleventyConfig.addFilter('skipfirst', (arr) => {
        return arr.slice(1, arr.length);
    })
    eleventyConfig.addFilter('tagFilter', (arr) => {
        return arr.filter(a => !/posts|work|life/.test(a));
    })
};