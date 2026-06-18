<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\ConversionJob;
use App\Events\ConversionStarted;
use App\Events\ConversionCompleted;
use App\Events\ConversionFailed;
use Illuminate\Support\Facades\Log;
use Throwable;
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
            'status' => 'processing',
        ]);
        
        broadcast(new ConversionStarted($this->conversionJob));
        try{
             // Phase 1 will fill this in with the CloudConvert API call
            // For now just simulate success after a short delay
            sleep(5);
            $this->conversionJob->update([
                'status' => 'completed',
            ]);
            broadcast(new ConversionCompleted($this->conversionJob));
        }catch(Throwable $e){
            Log::error('Conversion Failed',[
                'job_id' => $this->conversionJob->id,
                'error'=> $e->getMessage()
            ]);
            $this->conversionJob->update([
                'status' => 'failed',
            ]);
            broadcast(new ConversionFailed($this->conversionJob));
            //let laravel handle retried
            throw $e;
        }
    }
    public function failed(Throwable $e) :void{
        $this->conversionJob->update([
            'status' => 'failed',
        ]);
        broadcast(new ConversionFailed($this->conversionJob));
    }
}
