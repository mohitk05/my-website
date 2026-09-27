module.exports = {
  eleventyComputed: {
    // Posts without an explicit `coverImage` get a generated title+date
    // OG image (see `_og-image/generate.js`) used only for social/meta
    // previews -- it intentionally does NOT set `coverImage`, so it won't
    // show up as the on-page cover banner.
    ogImage: (data) => data.coverImage || `/img/og/${data.page.fileSlug}.png`,
  },
};
