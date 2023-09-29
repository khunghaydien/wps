module.exports = {
  stories: [
    // '../../**/*.story.@(js|mdx|tsx)',
    // We can't execute VRT because those have animation or location map.
    '../../stories/atoms/**/!(Spinner).story.@(js|mdx|tsx)',
    '../../stories/molecules/**/!(Loading|Map).story.@(js|mdx|tsx)',
    '../../stories/organisms/**/!(LoadingPage|TimeStamp).story.@(js|mdx|tsx)',
    '../../stories/pages/**/*.story.@(js|mdx|tsx)',
  ],
};
