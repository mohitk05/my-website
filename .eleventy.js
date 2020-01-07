const moment = require('moment');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

moment.locale('en');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy('img');
    eleventyConfig.addPlugin(syntaxHighlight);
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
};