<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // ----------------------------
    // GET USER PROFILE (VULNERABLE)
    // ----------------------------
    public function getProfile(Request $request)
    {
        // attacker can manipulate ?id=1 OR 1=1
        $id = $request->query('id');

        $sql = "SELECT id, name, email FROM users WHERE id = '$id'";

        try {
            $result = DB::select($sql);

            return response()->json([
                'status' => 'success',
                'executed_sql' => $sql,
                'data' => $result
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 'error',
                'executed_sql' => $sql,
                'error' => $e->getMessage()
            ]);
        }
    }

    // ---------------------------------
    // UPDATE USER INFO (VERY VULNERABLE)
    // ---------------------------------
    public function updateUser(Request $request)
    {
        // NO validation, NO sanitization
        $id = $request->input('id');
        $name = $request->input('name');
        $email = $request->input('email');

        // attacker can inject into $name and $email
        $sql = "
            UPDATE users 
            SET name = '$name', email = '$email'
            WHERE id = '$id'
        ";

        try {
            $result = DB::update($sql);

            return response()->json([
                'status' => 'success',
                'executed_sql' => $sql,
                'rows_affected' => $result
            ]);

        } catch (\Exception $e) {

            return response()->json([
                'status' => 'error',
                'executed_sql' => $sql,
                'error' => $e->getMessage()
            ]);
        }
    }
}
