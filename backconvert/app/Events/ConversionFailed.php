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

class ConversionFailed implements ShouldBroadcast
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
    public function broadcastOn(): array
    {
        return [
            new Channel('job.' . $this->job->id),
        ];
    }
    public function broadcastWith(): array
    {
        return [
            'status' => "failed",
            'error' => $this->job->error_message ?? "Conversion failed"
        ];
    }
    public function broadcastAs(): string{
        return 'ConvertProgressUpdated';
    }
}
