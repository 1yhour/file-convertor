<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConversionJob extends Model
{
    /** @use HasFactory<\Database\Factories\ConversionJobFactory> */
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'cloudconvert_job_id',
        'input_format',
        'output_format',
        'status'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }

    public function apiLogs(): HasMany
    {
        return $this->hasMany(ApiLog::class);
    }

    public function history(): HasMany
    {
        return $this->hasMany(ConversionHistory::class);
    }
}
