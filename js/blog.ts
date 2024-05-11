interface posts {
    name: {
        timestamp: number,
        title: string,
        filename: string,
        postURL: string
    }
}

export async function loadBlog() {
    const res: Promise<posts> = (await fetch("http://dexrn.duckdns.org/posts")).json();
    const blog = (await fetch(`http://dexrn.duckdns.org/${res.postURL}`)).json();
}