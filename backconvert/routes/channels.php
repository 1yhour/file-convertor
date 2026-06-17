<?php
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
Broadcast::channel('user.{id}', function (User $user, int $userId) {
    return (int) $user->id === (int) $userId;
});
