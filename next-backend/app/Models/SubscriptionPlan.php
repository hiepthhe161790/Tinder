<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'price',
        'duration',
        'duration_type',
    ];

    // Các quan hệ
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
