import React from 'react';
import BlogPostPaginator from '@theme-original/BlogPostPaginator';
import {CommentSection} from "@site/src/components/CommentSection";

export default function BlogPostPaginatorWrapper(props) {
    return (
        <>
            <BlogPostPaginator {...props} />
            <CommentSection/>
        </>
    );
}