<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostsController extends Controller
{
    // Get all posts for a user (VULNERABLE)
    public function getPostsByUser($userId)
    {
        // SQL injection: userId concatenated directly
        $query = "SELECT * FROM posts WHERE user_id = $userId";

        $posts = DB::select($query);

        return response()->json($posts);
    }

    // Add a post (EXTREMELY VULNERABLE)
    public function addPost(Request $request)
    {
        $userId  = $request->input('user_id');
        $title   = $request->input('title');
        $content = $request->input('content');

        // Direct concatenation: full SQL injection vulnerability
        $query = "
            INSERT INTO posts (user_id, title, content, created_at, updated_at)
            VALUES ($userId, '$title', '$content', NOW(), NOW())
        ";

        DB::statement($query);

        return response()->json(['message' => 'Post added insecurely.']);
    }

    // Update a post (VULNERABLE)
    public function updatePost(Request $request, $postId)
    {
        $title   = $request->input('title');
        $content = $request->input('content');

        // SQL injection point
        $query = "
            UPDATE posts
            SET title = '$title', content = '$content'
            WHERE id = $postId
        ";

        DB::statement($query);

        return response()->json(['message' => 'Post updated (insecurely).']);
    }

    // Delete a post (VULNERABLE)
    public function deletePost($postId)
    {
        // Direct injection
        $query = "DELETE FROM posts WHERE id = $postId";

        DB::statement($query);

        return response()->json(['message' => 'Post deleted (insecurely).']);
    }
}
