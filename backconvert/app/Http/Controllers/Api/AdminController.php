<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiLog;
use App\Models\ConversionHistory;
use App\Models\ConversionJob;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // -------------------------------------------------------------------------
    // Dashboard Stats
    // -------------------------------------------------------------------------

    /**
     * Return high-level statistics for the admin dashboard.
     */
    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users'       => User::count(),
            'total_jobs'        => ConversionJob::count(),
            'total_api_logs'    => ApiLog::count(),
            'jobs_by_status'    => ConversionJob::selectRaw('status, count(*) as count')
                                        ->groupBy('status')
                                        ->pluck('count', 'status'),
        ]);
    }

    // -------------------------------------------------------------------------
    // User Management
    // -------------------------------------------------------------------------

    /**
     * List all users with pagination.
     */
    public function listUsers(Request $request): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'created_at')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json($users);
    }

    /**
     * Show a single user with their conversion jobs.
     */
    public function showUser(User $user): JsonResponse
    {
        $user->load(['conversionJobs' => fn ($q) => $q->latest()->limit(10)]);

        return response()->json($user);
    }

    /**
     * Promote a user to admin or demote back to user.
     */
    public function updateUserRole(Request $request, User $user): JsonResponse
    {
        $request->validate([
            'role' => ['required', 'in:user,admin'],
        ]);

        // Prevent admins from demoting themselves
        if ($user->id === $request->user()->id && $request->role !== 'admin') {
            return response()->json([
                'message' => 'You cannot demote yourself.',
            ], 422);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => "User role updated to {$request->role}.",
            'user'    => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    /**
     * Delete a user account.
     */
    public function deleteUser(Request $request, User $user): JsonResponse
    {
        // Prevent self-deletion
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => 'You cannot delete your own account.',
            ], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }

    // -------------------------------------------------------------------------
    // Conversion Jobs (all users)
    // -------------------------------------------------------------------------

    /**
     * List all conversion jobs across all users.
     */
    public function listJobs(Request $request): JsonResponse
    {
        $jobs = ConversionJob::with(['user:id,name,email'])
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json($jobs);
    }

    // -------------------------------------------------------------------------
    // API Logs
    // -------------------------------------------------------------------------

    /**
     * List all API logs.
     */
    public function listApiLogs(Request $request): JsonResponse
    {
        $logs = ApiLog::with(['conversionJob:id,user_id,status'])
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return response()->json($logs);
    }
}
