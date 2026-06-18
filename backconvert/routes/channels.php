<?php
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
Broadcast::channel('user.{id}', function (User $user, string $userId) {
    return $user->id === $userId;
});
