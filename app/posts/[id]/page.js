export async function generateStaticParams() {
    const posts = await fetch("https://jsonplaceholder.typicode.com/posts").then(res => res.json());
  
    return posts.slice(0, 5).map(post => ({ id: post.id.toString() }));
  }
  
  export default async function Post({ params }) {
    const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`).then(res => res.json());
  
    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.body}</p>
      </div>
    );
  }
  