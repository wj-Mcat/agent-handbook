import React from "react";
import BlogPostItem from "@theme-original/BlogPostItem";
import type BlogPostItemType from "@theme/BlogPostItem";
import type { WrapperProps } from "@docusaurus/types";
import { useBlogPost } from "@docusaurus/theme-common/internal";
import GiscusComponent from "@site/src/components/GiscusComponent";
import TextAnnotations from "@site/src/components/TextAnnotation";

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const { metadata, isBlogPostPage } = useBlogPost();
  const { comments = true, annotations = true } = metadata.frontMatter;

  return (
    <>
      <BlogPostItem {...props} />
      {comments && isBlogPostPage && <GiscusComponent />}
      {annotations && isBlogPostPage && <TextAnnotations />}
    </>
  );
}