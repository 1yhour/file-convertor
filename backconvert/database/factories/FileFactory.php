<?php

namespace Database\Factories;

use App\Models\File;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\ConversionJob;
/**
 * @extends Factory<File>
 */
class FileFactory extends Factory
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
            'file_type' => $this->faker->randomElement(['input', 'output']),
            'original_name' => $this->faker->word(),
            'stored_name' => $this->faker->sha256(),
            'mime_type' => $this->faker->mimeType(),
            'size' => $this->faker->numberBetween(1024, 10485760),
            's3_key' => $this->faker->sha256(),
            'download_url' => $this->faker->url()
        ];
    }
}
