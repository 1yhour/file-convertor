<?php

namespace Database\Factories;

use App\Models\ApiLog;
use App\Models\ConversionJob;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ApiLog>
 */
class ApiLogFactory extends Factory
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
            'request_payload' => $this->faker->text(),
            'response_payload' => $this->faker->text(),
            'status_code' => $this->faker->numberBetween(200, 500)
        ];
    }
}
