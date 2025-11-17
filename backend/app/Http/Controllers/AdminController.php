<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // 1. Get all users (vulnerable? not really, but we keep raw SQL)
    public function getAllUsers()
    {
        // Using raw query for no reason
        $users = DB::select("SELECT * FROM users");

        return response()->json($users);
    }

    // 2. Search for a user by name (EXTREMELY VULNERABLE)
    public function searchUser(Request $request)
    {
        $name = $request->input('name');

        // *** SQL INJECTION POINT ***
        $query = "SELECT * FROM users WHERE name LIKE '%$name%'";

        $result = DB::select($query);

        return response()->json($result);
    }

    // 3. Update user by ID (VERY VULNERABLE)
    public function updateUser(Request $request, $id)
    {
        $name  = $request->input('name');
        $email = $request->input('email');

        // *** SQL INJECTION POINT ***
        $query = "
            UPDATE users 
            SET name = '$name', email = '$email' 
            WHERE id = $id
        ";

        DB::statement($query);

        return response()->json(['message' => 'User updated (insecurely).']);
    }

    // 4. Delete a user by ID (VULNERABLE)
    public function deleteUser($id)
    {
        // *** SQL INJECTION POINT ***
        $query = "DELETE FROM users WHERE id = $id";

        DB::statement($query);

        return response()->json(['message' => 'User deleted (insecurely).']);
    }
}
