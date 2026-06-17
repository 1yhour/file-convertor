<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Bus\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ConversionJob;
use App\Events\ConversionStarted;
class ConvertFileJob implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;
    public int $tired = 3;
    public array $backoff = [10, 30, 60];
    public int $timeout = 300;
    /**
     * Create a new job instance.
     */
    public function __construct(public ConversionJob $conversionJob)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->conversionJob->update([
            'status' => $this->status,
            'started_at' => $this->now(),
            'attempts' => $this->conversionJob->attempts + 1,
        ]);
        
        broadcast(new ConversionStarted($this->conversionJob)->via('reverb'));
        try{
             // Phase 1 will fill this in with the CloudConvert API call
            // For now just simulate success after a short delay
            sleep(2);
            $this->conversionJob->update([
                'status' => $this->status,
                'completed_at' => now(),
                'expires_at'   => now()->addHours(24),
                'download_url' => '/api/conversions/' . $this->conversionJob->id . '/download',
            ]);
            broadcast(new ConversionCompleted($this->conversionJob)->via('reverb'));
        }catch(Throwable $e){
            Log::error('Conversion Failed',[
                'job_id' => $this->conversionJob->id,
                'error'=> $e->getMessage()
            ]);
            $this->conversionJob->update([
                'status' => $this->status,
                'error_message' => $e->getMessage()
            ]);
            broadcast(new ConversionFailed($this->conversionJob)->via('reverb'));
            //let laravel handle retried
            throw $e;
        }
    }
    public function failed(Throwable $e) :void{
        $this->conversionJob->update([
            'status' => $this->status,
            'error_message' => 'Job Failed after' . $this->tired . 'attempts: ' . $e->getMessage(),
        ]);
        broadcast(new ConversionFailed($this->conversionJob)->via('reverb'));
    }
}
