<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ApiLog extends Model
{
    /** @use HasFactory<\Database\Factories\ApiLogFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'conversion_job_id',
        'request_payload',
        'response_payload',
        'status_code'
    ];

    public function conversionJob(): BelongsTo
    {
        return $this->belongsTo(ConversionJob::class);
    }
}
