<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PostsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('posts')->insert([

            // User 1: Admin
            [
                'user_id' => 2,
                'title' => 'Engagement Announcement (Private)',
                'content' => 'We finally got engaged yesterday ❤️ Keeping it quiet for now until we tell our families.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'title' => 'Doctor Visit Results',
                'content' => 'Blood test came back. Doctor said I need to monitor my sugar levels… might be pre-diabetic.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 2
            [
                'user_id' => 2,
                'title' => 'Travel Plans',
                'content' => 'Booked a surprise trip to Paris for Sara. Flight on March 8. Need to hide it from her until then.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'title' => 'Job Stress',
                'content' => 'Thinking about quitting… My manager blamed me for something I didn’t do. I’m exhausted.',
                'is_sensitive' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 3
            [
                'user_id' => 3,
                'title' => 'Family Issue',
                'content' => 'Mom has been getting worse lately. Doctors still don’t know what’s causing her fainting.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'title' => 'Deleted Messages',
                'content' => 'I deleted all screenshots about the breakup. But I still feel guilty for how I handled it.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 4
            [
                'user_id' => 4,
                'title' => 'Relationship Post',
                'content' => 'Still can’t believe he cheated on me again. I’m done this time… for real.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4,
                'title' => 'New Job Offer',
                'content' => 'Got an offer from a company in Dubai. Salary is insane, but I’m scared to move alone.',
                'is_sensitive' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 5
            [
                'user_id' => 5,
                'title' => 'Financial Trouble',
                'content' => 'My bank account is almost empty… rent is due in 4 days. I don’t know what to do.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 5,
                'title' => 'Therapy Notes',
                'content' => 'Therapist said I should open up more about my anxiety. Still not ready to tell anyone.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // User 6
            [
                'user_id' => 6,
                'title' => 'Unexpected Pregnancy Scare',
                'content' => 'I’m 5 days late… I don’t know how to tell him. I’m scared to check.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 6,
                'title' => 'Burnout',
                'content' => 'Haven’t slept properly in weeks. I feel like my chest is always tight.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 7
            [
                'user_id' => 7,
                'title' => 'Family Secret',
                'content' => 'My brother got arrested last night… We’re trying to keep it from the neighbors.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 7,
                'title' => 'Crush Confession',
                'content' => 'Okay… I think I’m starting to fall for my best friend. I can’t tell anyone though.',
                'is_sensitive' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 8
            [
                'user_id' => 8,
                'title' => 'Hospital Update',
                'content' => 'Dad is in the hospital again. Doctors found something in the scan… praying it’s nothing.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 8,
                'title' => 'Private Voice Note',
                'content' => 'I re-listened to the voice note I sent him last night. I sounded broken. I need to get it together.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 9
            [
                'user_id' => 9,
                'title' => 'Money Loan',
                'content' => 'Borrowed 2,000 MAD from Samir again… I hope he doesn’t tell anyone. I hate asking.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 9,
                'title' => 'Relationship Guilt',
                'content' => 'I broke up with her through text… She didn’t deserve that. I feel horrible.',
                'is_sensitive' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // User 10
            [
                'user_id' => 10,
                'title' => 'Private Work Info',
                'content' => 'Got access to the new client list today. Some of the names surprised me ngl.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 10,
                'title' => 'Mental Health',
                'content' => 'Skipped all calls today. Couldn’t pretend to be okay. Needed time alone.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // User 10
            [
                'user_id' => 11,
                'title' => 'Private Work Info',
                'content' => 'Got access to the new client list today. Some of the names surprised me ngl.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 11,
                'title' => 'Mental Health',
                'content' => 'Skipped all calls today. Couldn’t pretend to be okay. Needed time alone.',
                'is_sensitive' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
