import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserPosts() {
    const { id } = useParams(); 
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const res = await fetch(`http://localhost:8000/api/posts/${id}`);
            const data = await res.json();
            setPosts(data.posts);
        };

        fetchPosts();
    }, [id]);

    return (
        <div>
            <h1>User {id}'s Posts</h1>

            {posts.length === 0 ? (
                <p>No posts found</p>
            ) : (
                posts.map((p, index) => (
                    <div key={index}>
                        <h3>{p.title}</h3>
                        <p>{p.content}</p>
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}
