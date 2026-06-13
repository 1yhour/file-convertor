<?php

namespace Database\Factories;

use App\Models\ConversionHistory;
use App\Models\ConversionJob;
use Illuminate\Database\Eloquent\Factories\Factory;
/**
 * @extends Factory<ConversionHistory>
 */
class ConversionHistoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'conversion_job_id' => ConversionJob::factory(),
            'old_status'=> $this->faker->randomElement(['pending', 'processing', 'completed', 'failed']),
            'new_status'=> $this->faker->randomElement(['pending', 'processing', 'completed', 'failed']),
            'message'=> $this->faker->sentence(),
            
        ];
    }
}
