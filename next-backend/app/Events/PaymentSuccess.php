<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Payment;
class PaymentSuccess
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $payment;

    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    public function handle()
    {
        $payment = $this->payment;
        // Tạo mới HistorySubscriptionPlan dựa trên dữ liệu của $payment
        $historySubscriptionPlan = new \App\Models\HistorySubscriptionPlan();
        $historySubscriptionPlan->user_id = $payment->user_id;
        $historySubscriptionPlan->subscription_plan_id = $payment->subscription_plan_id;
        $historySubscriptionPlan->start_date = now(); // Điều chỉnh ngày bắt đầu tùy thuộc vào logic của bạn
        $historySubscriptionPlan->end_date = now()->addMonths(1); // Điều chỉnh ngày kết thúc tùy thuộc vào logic của bạn
        $historySubscriptionPlan->save();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    // public function broadcastOn(): array
    // {
    //     return [
    //         new PrivateChannel('channel-name'),
    //     ];
    // }
}
