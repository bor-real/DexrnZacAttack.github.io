interface PostInfo {
    timestamp: number,
    title: string,
    filename: string,
    postURL: string,
}

interface Post {
    timestamp: Date,
    title: string,
    body: string,
    hidden?: boolean
}

export async function fetchBlogList(): Promise<Post[]> {
    const res = await (await fetch("https://dexrn.duckdns.org/posts")).json();
    let posts: Post[] = [];
    
    for (const postName of res) {
        const post: PostInfo = postName[Object.keys(postName)[0]!];
        
        try {
            const response = await fetch(`https://dexrn.duckdns.org${post.postURL}`);
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            const blogPost: Post = await response.json();
            posts.push(blogPost);
        } catch (error) {
            console.error(`couldnt get post 'https://dexrn.duckdns.org${post.postURL}'`, error);
        }
    }

    return posts;
}
