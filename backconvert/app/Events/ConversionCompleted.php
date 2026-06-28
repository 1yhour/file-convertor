<?php

namespace App\Events;

use App\Models\ConversionJob;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ConversionCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public ConversionJob $job)
    {
        //
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array       //Where to send it
    {
        return [
            new Channel('job.' . $this->job->id),
        ];
    }
    public function broadcastWith(): array{     //What data to send
        return [
            'status' => "done",
            'progress' => 100,
            'downloadUrl' => env('APP_URL', 'http://localhost') . '/api/convert/download/' . $this->job->id
        ];
    }
    public function broadcastAs(): string{      //The event name on the frontend
        return 'ConvertProgressUpdated';
    }
}
