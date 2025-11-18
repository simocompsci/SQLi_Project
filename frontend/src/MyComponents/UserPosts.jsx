import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserPosts() {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");

    // Fetch ALL posts at first load
    const fetchAllPosts = async () => {
        const res = await fetch(`http://localhost:8000/api/posts/${id}`);
        const data = await res.json();
        setPosts(data.posts);
    };

    // Vulnerable search request
    const searchPosts = async () => {
        const res = await fetch(
            `http://localhost:8000/api/posts/search/${id}?search=${encodeURIComponent(search)}`
        );

        const data = await res.json();
        console.log("Executed SQL:", data.executed_sql); // to show your teacher
        setPosts(data.posts);
    };

    useEffect(() => {
        fetchAllPosts();
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl">
            <h1 className="text-3xl font-bold mb-6">
                User {id}'s Posts
            </h1>

            {/* Search Box — Vulnerable SQL Injection */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search posts by title (SQLi allowed)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 p-3 border rounded-lg shadow-sm text-lg"
                />

                <button
                    onClick={searchPosts}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700"
                >
                    Search
                </button>
            </div>

            {/* Posts list */}
            {posts.length === 0 ? (
                <p className="text-gray-500 text-lg">No posts found</p>
            ) : (
                posts.map((p, index) => (
                    <div
                        key={`${p.id}-${index}`}
                        className="mb-6 p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50"
                    >
                        <h3 className="text-2xl font-semibold">{p.title}</h3>
                        <p className="text-gray-700 mt-2">{p.content}</p>
                    </div>
                ))
            )}
        </div>
    );
}
