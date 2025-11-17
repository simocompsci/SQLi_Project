<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostsController;



// --------------------------------------
// AUTH (VULNERABLE)
// --------------------------------------
Route::post('/register', [AuthController::class, 'Register']);
Route::post('/login', [AuthController::class, 'Login']);
Route::post('/logout', [AuthController::class, 'Logout']);

// --------------------------------------
// ADMIN ENDPOINTS (VERY VULNERABLE)
// --------------------------------------
Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
Route::get('/admin/search', [AdminController::class, 'searchUser']);
Route::post('/admin/update', [AdminController::class, 'updateUser']);
Route::post('/admin/delete', [AdminController::class, 'deleteUser']);

// --------------------------------------
// USER CONTROLLER (PROFILE + UPDATE)
// --------------------------------------
Route::get('/user/profile', [UserController::class, 'getProfile']);
Route::post('/user/update', [UserController::class, 'updateUser']);

// --------------------------------------
// POSTS CONTROLLER (CRUD)
// --------------------------------------
Route::get('/posts', [PostsController::class, 'getAllPosts']);
Route::post('/posts/add', [PostsController::class, 'addPost']);
Route::post('/posts/update', [PostsController::class, 'updatePost']);
Route::post('/posts/delete', [PostsController::class, 'deletePost']);
