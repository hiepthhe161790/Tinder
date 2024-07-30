<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\HistorySubscriptionPlan;
use App\Models\Vnpay;
use App\Events\PaymentSuccess;
class PaymentController extends Controller
{
    public function handleCallback(Request $request)
    {
        // Kiểm tra tính hợp lệ của callback từ VNPAY
        $vnp_SecureHash = $request->input('vnp_SecureHash');
        $vnp_HashSecret = "QXGLHXVMNUJGLPACOIQZRPDLQYGGQKJA"; //Chuỗi bí mật
        $hashData = $request->except('vnp_SecureHash');
        ksort($hashData);
        $query = http_build_query($hashData);
        $secureHash = hash_hmac('sha512', $query, $vnp_HashSecret);
        
        if ($secureHash === $vnp_SecureHash) {
            // Tính hợp lệ của callback, xử lý và lưu thông tin giao dịch vào cơ sở dữ liệu
            $vnpay = new Vnpay();
            $vnpay->vnp_Amount = $request->input('vnp_Amount');
            $vnpay->vnp_BankCode = $request->input('vnp_BankCode');
            $vnpay->vnp_BankTranNo = $request->input('vnp_BankTranNo');
            $vnpay->vnp_CardType = $request->input('vnp_CardType');
            $vnpay->vnp_OrderInfo = $request->input('vnp_OrderInfo');
            $vnpay->vnp_PayDate = $request->input('vnp_PayDate');
            $vnpay->vnp_ResponseCode = $request->input('vnp_ResponseCode');
            $vnpay->vnp_TmnCode = $request->input('vnp_TmnCode');
            $vnpay->vnp_TransactionNo = $request->input('vnp_TransactionNo');
            $vnpay->vnp_TransactionStatus = $request->input('vnp_TransactionStatus');
            $vnpay->vnp_TxnRef = $request->input('vnp_TxnRef');
            $vnpay->vnp_SecureHash = $vnp_SecureHash;
            $vnpay->save();

            // Cập nhật trạng thái thanh toán là success
            $payment = Payment::where('txn_ref', $request->input('vnp_TxnRef'))->first();
            if ($payment) {
                $payment->status = 'success';
                $payment->save();
                $historySubscriptionPlan = new HistorySubscriptionPlan();
                $historySubscriptionPlan->user_id = $payment->user_id;
                $historySubscriptionPlan->subscription_plan_id = $payment->subscription_plan_id;
                $historySubscriptionPlan->start_date = now(); // Điều chỉnh ngày bắt đầu tùy thuộc vào logic của bạn
                $historySubscriptionPlan->end_date = now()->addMonths(1); // Điều chỉnh ngày kết thúc tùy thuộc vào logic của bạn
                $historySubscriptionPlan->save();
            }
            // Phản hồi lại VNPAY rằng giao dịch đã được xử lý thành công
            return response()->json(['code' => '00', 'status' => 'successful']);
        } else {
            // Nếu callback không hợp lệ, phản hồi lỗi
            return response()->json(['code' => '99', 'status' => 'Callback-fail']);
        }
    }
    public function vnpay_payment(Request $request){
error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
date_default_timezone_set('Asia/Ho_Chi_Minh');

$vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
$vnp_Returnurl = config('app.frontend_url') . '/thanks';
$vnp_TmnCode = "TZODF7EK";//Mã website tại VNPAY 
$vnp_HashSecret = "QXGLHXVMNUJGLPACOIQZRPDLQYGGQKJA"; //Chuỗi bí mật

$vnp_TxnRef = rand(00,9999); //Mã đơn hàng. Trong thực tế Merchant cần insert đơn hàng vào DB và gửi mã này sang VNPAY
$vnp_OrderInfo = $request->input('order_info');
$vnp_OrderType = $request->input('order_type');
$vnp_Amount = $request->input('amount')*100;
// $vnp_OrderInfo = "Thanh toan hoa don";
// $vnp_OrderType = "BarBer Shop";
// $vnp_Amount = 10000 * 100;
$vnp_Locale = "VN";
$vnp_BankCode =  "NCB";
$vnp_IpAddr = $_SERVER['REMOTE_ADDR'];

$inputData = array(
    "vnp_Version" => "2.1.0",
    "vnp_TmnCode" => $vnp_TmnCode,
    "vnp_Amount" => $vnp_Amount,
    "vnp_Command" => "pay",
    "vnp_CreateDate" => date('YmdHis'),
    "vnp_CurrCode" => "VND",
    "vnp_IpAddr" => $vnp_IpAddr,
    "vnp_Locale" => $vnp_Locale,
    "vnp_OrderInfo" => $vnp_OrderInfo,
    "vnp_OrderType" => $vnp_OrderType,
    "vnp_ReturnUrl" => $vnp_Returnurl,
    "vnp_TxnRef" => $vnp_TxnRef
);

if (isset($vnp_BankCode) && $vnp_BankCode != "") {
    $inputData['vnp_BankCode'] = $vnp_BankCode;
}
if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
    $inputData['vnp_Bill_State'] = $vnp_Bill_State;
}

//var_dump($inputData);
ksort($inputData);
$query = "";
$i = 0;
$hashdata = "";
foreach ($inputData as $key => $value) {
    if ($i == 1) {
        $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
    } else {
        $hashdata .= urlencode($key) . "=" . urlencode($value);
        $i = 1;
    }
    $query .= urlencode($key) . "=" . urlencode($value) . '&';
}

$vnp_Url = $vnp_Url . "?" . $query;
if (isset($vnp_HashSecret)) {
    $vnpSecureHash =   hash_hmac('sha512', $hashdata, $vnp_HashSecret);//  
    $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
}
$returnData = array('code' => '00'
    , 'status' => 'success'
    , 'data' => $vnp_Url);
    if (isset($_POST['redirect'])) {
        header('Location: ' . $vnp_Url);
        die();
    } else {
        echo json_encode($returnData);
       
    }
    if ($returnData['status'] == 'success') {
        $this->savePaymentData($request, $vnp_TxnRef, $vnp_OrderInfo, $vnp_OrderType, $vnp_Amount,$vnp_Locale,$vnp_BankCode);
    }
    }
    private function savePaymentData(Request $request, $vnp_TxnRef, $orderInfo, $orderType, $amount,$vnp_Locale,$vnp_BankCode)
    {
        $payment = new Payment();
        $payment->user_id = auth()->id(); // Thay đổi cách lấy user_id tùy vào cách xác thực người dùng của bạn
        $payment->subscription_plan_id = $request->input('subscription_plan_id');
        $payment->txn_ref = $vnp_TxnRef;
        $payment->order_info = $orderInfo;
        $payment->order_type = $orderType;
        $payment->amount = $amount;
        $payment->locale = $vnp_Locale;
        $payment->bank_code = $vnp_BankCode;
        $payment->ip_address = $request->ip(); // Sử dụng phương thức ip() để lấy địa chỉ IP từ request của Laravel
        $payment->save();
    }
  
}
