<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\ConversionJob;
use App\Models\File;
use App\Jobs\ConvertFileJob;
use Throwable;

class ConversionController extends Controller
{
    /**
     * Handle the file upload for conversion.
     */
    public function upload(Request $request)
    {
        // 1. Validation
        // We enforce max 50MB (51200 KB) and require an output format.
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:51200'],
            'output_format' => ['required', 'string', 'max:20'],
        ]);

        $uploadedFile = $request->file('file');
        
        try {
            DB::beginTransaction();

            // 2. Database Record: ConversionJob
            // We check if there's an authenticated user via sanctum. If not, user_id is null.
            $conversionJob = ConversionJob::create([
                'user_id' => $request->user('sanctum')?->id,
                'input_format' => strtolower($uploadedFile->getClientOriginalExtension()),
                'output_format' => strtolower($validated['output_format']),
                'status' => 'pending',
            ]);

            // 3. File Storage
            $originalName = $uploadedFile->getClientOriginalName();
            $mimeType = $uploadedFile->getMimeType();
            $size = $uploadedFile->getSize();
            
            // Generate a secure path: conversions/{job_id}/timestamp_filename
            // The file is stored using the default configured filesystem (local or S3)
            $path = $uploadedFile->storeAs(
                "conversions/{$conversionJob->id}", 
                time() . '_' . str_replace(' ', '_', $originalName),
                config('filesystems.default', 'local')
            );

            // 4. Database Record: File
            // Create a record for the input file linked to the conversion job
            $conversionJob->files()->create([
                'file_type' => 'input',
                'original_name' => $originalName,
                'stored_name' => $path,
                'mime_type' => $mimeType,
                'size' => $size,
            ]);

            DB::commit();

            // 5. Dispatch Queue Job
            // Dispatch the conversion logic to the dedicated 'conversions' queue
            ConvertFileJob::dispatch($conversionJob)->onQueue('conversions');

            // 6. Return response
            // HTTP 202 Accepted is the standard for a request that has been accepted for processing,
            // but the processing has not been completed.
            return response()->json([
                'message' => 'Conversion job created successfully',
                'job_id' => $conversionJob->id,
            ], 202);

        } catch (Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to initiate conversion job',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
    }

    /**
     * Get all conversion jobs for the authenticated user.
     */
    public function index(Request $request)
    {
        $jobs = ConversionJob::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(15);
            
        return response()->json($jobs);
    }

    public function download(Request $request, $jobId)
    {
        $job = ConversionJob::FindOrFail($jobId);

        if($job->status !== 'completed')
            return response()->json([
                'message' => 'Conversion is not completed yet.'
            ], 400);
        $outputFile = $job->file()->where('file_type', 'output')->first();

        if(!$outputFile || !Storage::exists($outputFile->stored_name))
            return response()->json([
                'message' => 'Output file not found.'
            ], 404);
        return Storage::download($outputFile->stored_name, $outputFile->original_name);
    }

}
