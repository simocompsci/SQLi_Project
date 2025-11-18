<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostsController extends Controller
{
    // Get all posts for a user (VULNERABLE)
    public function getUserPosts($id)
    {
        // EXTREMELY VULNERABLE SQL (deliberately unsafe)
        $sql = "SELECT id, user_id, title, content, is_sensitive, created_at, updated_at 
            FROM posts WHERE user_id = $id";

        try {
            $posts = DB::select($sql);

            return response()->json([
                "status" => "success",
                "user_id" => $id,
                "posts" => $posts,        // includes full content
                "executed_sql" => $sql
            ]);
        } catch (\Exception $e) {

            return response()->json([
                "status" => "error",
                "message" => "Database error",
                "error" => $e->getMessage(),
                "executed_sql" => $sql
            ], 500);
        }
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

    public function searchUserPosts(Request $request, $id)
{
    $search = $request->input('search');

    // EXTREMELY VULNERABLE SQLI
    $sql = "
        SELECT * FROM posts
        WHERE user_id = $id
        AND title LIKE '%$search%'
    ";

    $posts = DB::select($sql);

    return response()->json([
        "posts" => $posts,
        "executed_sql" => $sql
    ]);
}
}
