<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use PostsTableSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        

        $this->call([
            UserSeeder::class,
            PostsSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@example.com',
        ]);

    }
}
