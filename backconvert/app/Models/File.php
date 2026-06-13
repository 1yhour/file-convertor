<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class File extends Model
{
    /** @use HasFactory<\Database\Factories\FileFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'conversion_job_id',
        'file_type',
        'original_name',
        'stored_name',
        'mime_type',
        'size',
        's3_key',
        'download_url'
    ];
    public function conversionJob():BelongsTo
    {
        return $this->belongsTo(ConversionJob::class);
    }
}
