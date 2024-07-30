<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vnpay extends Model
{
    use HasFactory;
    protected $fillable = [
        'vnp_Amount',
        'vnp_BankCode',
        'vnp_BankTranNo',
        'vnp_CardType',
        'vnp_OrderInfo',
        'vnp_PayDate',
        'vnp_ResponseCode',
        'vnp_TmnCode',
        'vnp_TransactionNo',
        'vnp_TransactionStatus',
        'vnp_TxnRef',
        'vnp_SecureHash',
    ];
      // Định nghĩa mối quan hệ với model Payment
      public function payment(): HasMany
      {
          return $this->hasMany(Payment::class, 'txn_ref', 'vnp_TxnRef');
      }
}
