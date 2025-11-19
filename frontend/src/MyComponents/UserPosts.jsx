import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";

export default function UserPosts() {
    const { id } = useParams();
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Posts
                    </h1>
                    <p className="text-gray-600">User {id}'s collection</p>
                </div>

                {/* Search Bar */}
                <div className="mb-8 flex gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search posts by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && searchPosts()}
                            className="w-full px-4 py-3 pl-11 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                    <button
                        onClick={searchPosts}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                    <button
                        onClick={() => {
                            setSearch("");
                            fetchAllPosts();
                        }}
                        disabled={loading}
                        className="px-6 py-3 bg-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-400 disabled:opacity-50 transition"
                    >
                        Reset
                    </button>
                </div>

                {/* Posts List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-flex flex-col items-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="text-gray-600 mt-4">Loading posts...</p>
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No posts found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((p, index) => (
                            <div
                                key={`${p.id}-${index}`}
                                className="bg-gray-200 border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {p.title}
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {p.content}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
