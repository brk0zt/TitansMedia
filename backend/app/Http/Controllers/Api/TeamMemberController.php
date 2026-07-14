<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\InviteMemberRequest;
use App\Http\Requests\UpdateMemberRoleRequest;
use App\Http\Resources\TeamMemberResource;
use App\Models\BusinessManager;
use App\Models\BmTeamMember;
use App\Models\BmInvitation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class TeamMemberController
{
    public function index(Request $request, BusinessManager $businessManager): AnonymousResourceCollection
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $members = $businessManager->teamMembers()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return TeamMemberResource::collection($members);
    }

    public function invite(InviteMemberRequest $request, BusinessManager $businessManager): \Illuminate\Http\JsonResponse
    {
        abort_if($businessManager->user_id !== $request->user()->id, 403);

        $validated = $request->validated();

        $existing = $businessManager->teamMembers()
            ->where('email', $validated['email'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'This user is already a team member.',
            ], 409);
        }

        $invitation = $businessManager->invitations()->create([
            'invited_by' => $request->user()->id,
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => Str::random(64),
            'status' => 'pending',
            'expires_at' => now()->addDays(7),
        ]);

        $name = explode('@', $validated['email'])[0];
        $nameFormatted = Str::of(str_replace(['.', '-', '_'], ' ', $name))
            ->title()
            ->toString();

        $member = $businessManager->teamMembers()->create([
            'name' => $nameFormatted,
            'email' => $validated['email'],
            'role' => $validated['role'],
            'status' => 'active',
            'last_active_at' => now(),
        ]);

        return response()->json([
            'message' => 'Invitation sent successfully.',
            'member' => new TeamMemberResource($member),
        ], 201);
    }

    public function updateRole(
        UpdateMemberRoleRequest $request,
        BusinessManager $businessManager,
        BmTeamMember $teamMember
    ): TeamMemberResource {
        abort_if($businessManager->user_id !== $request->user()->id, 403);
        abort_if($teamMember->business_manager_id !== $businessManager->id, 404);

        $teamMember->update(['role' => $request->validated()['role']]);

        return new TeamMemberResource($teamMember->fresh());
    }

    public function destroy(
        Request $request,
        BusinessManager $businessManager,
        BmTeamMember $teamMember
    ): \Illuminate\Http\JsonResponse {
        abort_if($businessManager->user_id !== $request->user()->id, 403);
        abort_if($teamMember->business_manager_id !== $businessManager->id, 404);

        $teamMember->delete();

        return response()->json(['message' => 'Team member removed.'], 200);
    }
}
