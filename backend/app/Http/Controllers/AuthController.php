<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function Register(Request $request)
    {
        $request->validate([
            'name' => 'nullable',
            'email' => 'required',
            'password' => 'required',
        ]);

        $name = $request->input('name') ?? '';
        $email = $request->input('email');
        $password = $request->input('password');

        // VULNERABLE: direct string concatenation
        $query = "INSERT INTO users (name, email, password) VALUES ('$name', '$email', '$password')";

        try {
            DB::statement($query);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully'
            ], 200);
        } catch (\Exception $e) {

            // LEAK THE REAL ERROR TO FRONTEND (VULNERABLE)
            return response()->json([
                'status' => 'error',
                'message' => 'Database error occurred.',
                'error' => $e->getMessage(), // FULL ERROR LEAKED
                'executed_sql' => $query     // LEAK ACTUAL SQL TOO
            ], 500);
        }
    }


    public function Login(Request $request)
    {
        $email = $request->email;
        $password = $request->password;

        try {
            // 🔥 Fully vulnerable SQL injection
            $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
            $user = DB::select($sql);

            // ❌ if empty = invalid credentials
            if (empty($user)) {
                return response()->json([
                    "status" => "error",
                    "message" => "Invalid credentials.",
                    "executed_sql" => $sql
                ], 401);
            }

            // ✔ Extract the first user row
            $userObject = $user[0];

            // ✔ Store vulnerable session (fake login)
            session(['vulnerable_logged_in' => true]);
            session(['user_id' => $userObject->id]);  // store only ID
            session(['user_email' => $userObject->email]); // optional

            return response()->json([
                "status" => "success",
                "message" => "Login successful",
                "user" => $userObject,
                "executed_sql" => $sql
            ]);
        } catch (\Exception $e) {

            return response()->json([
                "status" => "error",
                "message" => "Database error occurred.",
                "error" => $e->getMessage(),
                "executed_sql" => $sql
            ], 500);
        }
    }




    public function Logout(Request $request)
    {
        $userId = $request->input('user_id'); // attacker can choose ANY USER

        try {
            $user = User::find($userId);

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found.',
                    'provided_user_id' => $userId
                ], 404);
            }

            // Delete ALL of the user’s tokens — no auth required
            $deleted = $user->tokens()->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User logged out. (All tokens deleted without auth)',
                'user_id' => $userId,
                'tokens_deleted' => $deleted
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Logout error.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
