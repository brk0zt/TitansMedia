<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\BusinessManager;
use App\Models\AdAccount;
use App\Models\FacebookPage;
use App\Models\BmTeamMember;
use App\Models\Project;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    private const BM_DATA = [
        [
            'name' => 'Titans Media Agency',
            'business_id' => 'BM-001-TITANS',
            'verified' => true,
            'balance' => 250000.00,
            'currency' => 'USD',
            'overdue' => 0.00,
            'ad_accounts' => [
                ['account_id' => 'ACT-001-MAIN', 'fb_ad_account_id' => null, 'name' => 'Titans Media Main', 'status' => 'active', 'spend' => 45000.00, 'impressions' => 2_500_000, 'clicks' => 125_000],
                ['account_id' => 'ACT-002-PMAX', 'fb_ad_account_id' => null, 'name' => 'Titans Performance Max', 'status' => 'active', 'spend' => 32000.00, 'impressions' => 1_800_000, 'clicks' => 98_000],
                ['account_id' => 'ACT-003-BRAND', 'fb_ad_account_id' => null, 'name' => 'Titans Brand Awareness', 'status' => 'active', 'spend' => 18000.00, 'impressions' => 3_200_000, 'clicks' => 45_000],
            ],
            'pages' => [
                ['page_id' => 'PG-001-TITANS', 'name' => 'Titans Media', 'category' => 'Media/News', 'followers' => 145_000, 'engaged' => 12_300],
                ['page_id' => 'PG-002-INSIDER', 'name' => 'Titans Insider', 'category' => 'Blog', 'followers' => 78_000, 'engaged' => 8_900],
                ['page_id' => 'PG-003-COMMUNITY', 'name' => 'Titans Community', 'category' => 'Community', 'followers' => 34_000, 'engaged' => 5_600],
            ],
            'members' => [
                ['name' => 'Michael Scott', 'email' => 'michael@titans.media', 'role' => 'Admin', 'last_active_at' => '-1 hour'],
                ['name' => 'Sarah Connor', 'email' => 'sarah@titans.media', 'role' => 'Ad Manager', 'last_active_at' => '-30 minutes'],
                ['name' => 'James Wilson', 'email' => 'james@titans.media', 'role' => 'Analyst', 'last_active_at' => '-2 hours'],
                ['name' => 'Emily Chen', 'email' => 'emily@titans.media', 'role' => 'Content Creator', 'last_active_at' => '-1 day'],
                ['name' => 'David Park', 'email' => 'david@titans.media', 'role' => 'Viewer', 'last_active_at' => '-3 days'],
            ],
        ],
        [
            'name' => 'Client: Quantum Tech',
            'business_id' => 'BM-002-QUANTUM',
            'verified' => false,
            'balance' => 45000.00,
            'currency' => 'USD',
            'overdue' => 3200.00,
            'ad_accounts' => [
                ['account_id' => 'ACT-101-QT', 'fb_ad_account_id' => null, 'name' => 'QT Launch Campaign', 'status' => 'active', 'spend' => 12000.00, 'impressions' => 890_000, 'clicks' => 43_000],
                ['account_id' => 'ACT-102-QTR', 'fb_ad_account_id' => null, 'name' => 'QT Retargeting', 'status' => 'paused', 'spend' => 5000.00, 'impressions' => 340_000, 'clicks' => 21_000],
            ],
            'pages' => [
                ['page_id' => 'PG-101-QTECH', 'name' => 'Quantum Tech Official', 'category' => 'Technology', 'followers' => 56_000, 'engaged' => 4_200],
                ['page_id' => 'PG-102-QTDEV', 'name' => 'QT Dev Blog', 'category' => 'Software', 'followers' => 12_000, 'engaged' => 1_800],
            ],
            'members' => [
                ['name' => 'Alice Johnson', 'email' => 'alice@quantum.tech', 'role' => 'Admin', 'last_active_at' => '-5 hours'],
                ['name' => 'Bob Martinez', 'email' => 'bob@quantum.tech', 'role' => 'Ad Manager', 'last_active_at' => '-1 day'],
            ],
        ],
        [
            'name' => 'Client: Fusion Labs',
            'business_id' => 'BM-003-FUSION',
            'verified' => true,
            'balance' => 98000.00,
            'currency' => 'USD',
            'overdue' => 0.00,
            'ad_accounts' => [
                ['account_id' => 'ACT-201-FL', 'fb_ad_account_id' => null, 'name' => 'FL Product Launch', 'status' => 'active', 'spend' => 22000.00, 'impressions' => 1_200_000, 'clicks' => 67_000],
                ['account_id' => 'ACT-202-FLG', 'fb_ad_account_id' => null, 'name' => 'FL Lead Gen', 'status' => 'active', 'spend' => 15000.00, 'impressions' => 670_000, 'clicks' => 41_000],
            ],
            'pages' => [
                ['page_id' => 'PG-201-FUSION', 'name' => 'Fusion Labs', 'category' => 'Science', 'followers' => 89_000, 'engaged' => 7_500],
                ['page_id' => 'PG-202-FR', 'name' => 'Fusion Research', 'category' => 'Research', 'followers' => 23_000, 'engaged' => 3_100],
            ],
            'members' => [
                ['name' => 'Carol White', 'email' => 'carol@fusionlabs.io', 'role' => 'Admin', 'last_active_at' => '-15 minutes'],
                ['name' => 'Dan Lee', 'email' => 'dan@fusionlabs.io', 'role' => 'Analyst', 'last_active_at' => '-4 hours'],
            ],
        ],
    ];

    private const PROJECT_DATA = [
        [
            'name' => 'Q4 Campaign Planning',
            'description' => 'Strategic planning and budgeting for Q4 advertising campaigns across all managed accounts.',
            'status' => 'active',
            'estimated_completion' => '+60 days',
            'risk_score' => 7.5,
            'tasks' => [
                ['title' => 'Budget allocation review', 'status' => 'in_progress', 'priority' => 5, 'estimated_hours' => 8, 'due_date' => '+7 days'],
                ['title' => 'Creative asset audit', 'status' => 'completed', 'priority' => 3, 'estimated_hours' => 12, 'due_date' => '-2 days', 'completed_at' => '-1 day'],
                ['title' => 'Audience segmentation', 'status' => 'pending', 'priority' => 4, 'estimated_hours' => 16, 'due_date' => '+14 days'],
                ['title' => 'Competitor analysis report', 'status' => 'in_progress', 'priority' => 3, 'estimated_hours' => 10, 'due_date' => '+10 days'],
            ],
        ],
        [
            'name' => 'Brand Refresh 2026',
            'description' => 'Comprehensive brand identity refresh including visual assets, messaging, and social presence.',
            'status' => 'active',
            'estimated_completion' => '+90 days',
            'risk_score' => 3.2,
            'tasks' => [
                ['title' => 'Logo redesign concepts', 'status' => 'in_progress', 'priority' => 5, 'estimated_hours' => 24, 'due_date' => '+21 days'],
                ['title' => 'Brand guidelines document', 'status' => 'pending', 'priority' => 4, 'estimated_hours' => 16, 'due_date' => '+45 days'],
                ['title' => 'Social media template kit', 'status' => 'pending', 'priority' => 2, 'estimated_hours' => 8, 'due_date' => '+60 days'],
            ],
        ],
        [
            'name' => 'Client Onboarding Automation',
            'description' => 'Build automated onboarding workflows for new client Business Managers.',
            'status' => 'paused',
            'estimated_completion' => '+45 days',
            'risk_score' => 5.8,
            'tasks' => [
                ['title' => 'Design onboarding flow', 'status' => 'completed', 'priority' => 4, 'estimated_hours' => 12, 'due_date' => '-5 days', 'completed_at' => '-3 days'],
                ['title' => 'Develop API integration', 'status' => 'in_progress', 'priority' => 5, 'estimated_hours' => 30, 'due_date' => '+20 days'],
                ['title' => 'Testing & QA', 'status' => 'pending', 'priority' => 3, 'estimated_hours' => 16, 'due_date' => '+40 days'],
            ],
        ],
        [
            'name' => 'Holiday Season Push',
            'description' => 'Major advertising push for the holiday season across all clients and markets.',
            'status' => 'active',
            'estimated_completion' => '+30 days',
            'risk_score' => 6.1,
            'tasks' => [
                ['title' => 'Campaign creative production', 'status' => 'in_progress', 'priority' => 5, 'estimated_hours' => 40, 'due_date' => '+14 days'],
                ['title' => 'Landing page optimization', 'status' => 'pending', 'priority' => 4, 'estimated_hours' => 16, 'due_date' => '+21 days'],
                ['title' => 'Budget pacing setup', 'status' => 'pending', 'priority' => 3, 'estimated_hours' => 6, 'due_date' => '+7 days'],
                ['title' => 'Performance tracking dashboard', 'status' => 'pending', 'priority' => 2, 'estimated_hours' => 10, 'due_date' => '+28 days'],
            ],
        ],
    ];

    public function run(): void
    {
        $user = User::where('email', 'michael@titans.media')->first();

        if (!$user) {
            $this->command->warn('User michael@titans.media not found. Skipping seed.');
            return;
        }

        foreach (self::BM_DATA as $bmItem) {
            $bm = BusinessManager::updateOrCreate(
                ['business_id' => $bmItem['business_id']],
                [
                    'user_id' => $user->id,
                    'name' => $bmItem['name'],
                    'verified' => $bmItem['verified'],
                    'balance' => $bmItem['balance'],
                    'currency' => $bmItem['currency'],
                    'overdue' => $bmItem['overdue'],
                ]
            );

            foreach ($bmItem['ad_accounts'] as $acct) {
                AdAccount::updateOrCreate(
                    ['account_id' => $acct['account_id'], 'business_manager_id' => $bm->id],
                    [
                        'fb_ad_account_id' => $acct['fb_ad_account_id'],
                        'name' => $acct['name'],
                        'status' => $acct['status'],
                        'spend' => $acct['spend'],
                        'impressions' => $acct['impressions'],
                        'clicks' => $acct['clicks'],
                    ]
                );
            }

            foreach ($bmItem['pages'] as $pg) {
                FacebookPage::updateOrCreate(
                    ['page_id' => $pg['page_id'], 'business_manager_id' => $bm->id],
                    [
                        'name' => $pg['name'],
                        'category' => $pg['category'],
                        'followers' => $pg['followers'],
                        'engaged' => $pg['engaged'],
                    ]
                );
            }

            foreach ($bmItem['members'] as $member) {
                BmTeamMember::updateOrCreate(
                    ['email' => $member['email'], 'business_manager_id' => $bm->id],
                    [
                        'name' => $member['name'],
                        'role' => $member['role'],
                        'status' => 'active',
                        'last_active_at' => Carbon::parse($member['last_active_at']),
                    ]
                );
            }
        }

        foreach (self::PROJECT_DATA as $projItem) {
            $project = Project::updateOrCreate(
                ['name' => $projItem['name'], 'user_id' => $user->id],
                [
                    'description' => $projItem['description'],
                    'status' => $projItem['status'],
                    'estimated_completion' => Carbon::parse($projItem['estimated_completion']),
                    'risk_score' => $projItem['risk_score'],
                ]
            );

            foreach ($projItem['tasks'] as $taskItem) {
                $data = [
                    'project_id' => $project->id,
                    'title' => $taskItem['title'],
                    'status' => $taskItem['status'],
                    'priority' => $taskItem['priority'],
                    'estimated_hours' => $taskItem['estimated_hours'],
                    'due_date' => Carbon::parse($taskItem['due_date']),
                ];
                if (isset($taskItem['completed_at'])) {
                    $data['completed_at'] = Carbon::parse($taskItem['completed_at']);
                }
                Task::updateOrCreate(
                    ['title' => $taskItem['title'], 'project_id' => $project->id],
                    $data
                );
            }
        }

        $this->command->info('Titans Media seed data inserted successfully!');
    }
}
