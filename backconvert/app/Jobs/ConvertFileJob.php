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
use Illuminate\Support\Facades\Storage;
use CloudConvert\Models\Job;
use CloudConvert\Models\Task;
use CloudConvert\Laravel\Facades\CloudConvert;
use Exception;
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
            // 1. Get the uploaded input file
            $inputFile = $this->conversionJob->files()->where('file_type', 'input')->first();
            if (!$inputFile) {
                throw new Exception('Input file not found for conversion job.');
            }

            // Create a read stream from the storage disk (works for local and S3)
            $fileStream = Storage::readStream($inputFile->stored_name);
            if (!$fileStream) {
                throw new Exception('Could not open file stream for upload.');
            }

            // 2. Define the CloudConvert Job and its Tasks
            $job = (new Job())
                ->addTask(
                    (new Task('import/upload', 'import-1'))
                )
                ->addTask(
                    (new Task('convert', 'task-1'))
                        ->set('input', 'import-1')
                        ->set('output_format', $this->conversionJob->output_format)
                )
                ->addTask(
                    (new Task('export/url', 'export-1'))
                        ->set('input', 'task-1')
                );

            // 3. Create the Job via the Laravel Facade
            CloudConvert::jobs()->create($job);

            // Update database with the CloudConvert Job ID
            $this->conversionJob->update(['cloudconvert_job_id' => $job->getId()]);

            // 4. Upload the file to CloudConvert Server using the stream
            $uploadTask = $job->getTasks()->whereName('import-1')[0];
            CloudConvert::tasks()->upload($uploadTask, $fileStream);

            // 5. Wait for the conversion to finish
            CloudConvert::jobs()->wait($job);

            // 6. Download the converted file
            $exportTask = $job->getTasks()->whereName('export-1')[0];
            $fileTask = CloudConvert::tasks()->wait($exportTask);

            $cloudConvertFile = $fileTask->getResult()->files[0];
            $downloadUrl = $cloudConvertFile->url;

            $newStoredName = "conversions/{$this->conversionJob->id}/converted_" . $cloudConvertFile->filename;
            
            // Stream the download directly to Storage (S3 or local) to save memory
            $downloadStream = fopen($downloadUrl, 'r');
            Storage::put($newStoredName, $downloadStream);
            if (is_resource($downloadStream)) {
                fclose($downloadStream);
            }

            // 7. Save output file details to DB
            $this->conversionJob->files()->create([
                'file_type' => 'output',
                'original_name' => $cloudConvertFile->filename,
                'stored_name' => $newStoredName,
                'size' => $cloudConvertFile->size,
            ]);

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
