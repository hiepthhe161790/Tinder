<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'subscription_plan_id',
        'txn_ref',
        'order_info',
        'order_type',
        'amount',
        'locale',
        'bank_code',
        'ip_address',
        'status',
    ];

    // Các quan hệ
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // public function subscriptionPlan()
    // {
    //     return $this->belongsTo(SubscriptionPlan::class);
    // }
    public function vnpays(): BelongsTo
    {
        return $this->belongsTo(Vnpay::class, 'vnp_TxnRef', 'txn_ref');
    }
}
