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
            new PrivateChannel('user.' . $this->job->user_id),
        ];
    }
    public function broadcastWith(): array{     //What data to send
        return [
            'job_id' => $this->job->id,
            'status' => "completed",
            'input_format' => $this->job->input_format,
            'output_format' => $this->job->output_format
        ];
    }
    public function broadcastAs(): string{      //The event name on the frontend
        return 'conversion.completed';
    }
}
