<?php

namespace Database\Factories;

use App\Models\ConversionJob;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConversionJob>
 */
class ConversionJobFactory extends Factory
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
            'user_id' => User::factory(),
            'cloudconvert_job_id' => $this->faker->sha256(),
            'input_format' => $this->faker->randomElement(['pdf', 'doc', 'docx', 'jpg', 'png']),
            'output_format' => $this->faker->randomElement(['pdf', 'doc', 'docx', 'jpg', 'png']),
            'status' => $this->faker->randomElement(['pending', 'processing', 'completed', 'failed'])
        ];
    }
}
