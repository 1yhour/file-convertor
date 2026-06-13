<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConversionHistory extends Model
{
    /** @use HasFactory<\Database\Factories\ConversionHistoryFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'conversion_job_id',
        'old_status',
        'new_status',
        'message'
    ];

    public function conversionJob(): BelongsTo
    {
        return $this->belongsTo(ConversionJob::class);
    }
}
