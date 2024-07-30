<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubscriptionPlan;

class SubscriptionPlanController extends Controller
{
    public function index()
    {
        $subscriptionPlans = SubscriptionPlan::all();
        return response()->json(['subscriptionPlans' => $subscriptionPlans]);
    }

    public function create()
    {
        // Not needed for JSON API
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'weekly_price' => 'required|numeric',
            'monthly_price' => 'required|numeric',
            'yearly_price' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $subscriptionPlan = SubscriptionPlan::create($validatedData);

        return response()->json(['message' => 'Subscription Plan created successfully', 'subscriptionPlan' => $subscriptionPlan], 201);
    }

    public function show($id)
    {
        $subscriptionPlan = SubscriptionPlan::findOrFail($id);
        return response()->json(['subscriptionPlan' => $subscriptionPlan]);
    }

    public function edit($id)
    {
        // Not needed for JSON API
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'weekly_price' => 'required|numeric',
            'monthly_price' => 'required|numeric',
            'yearly_price' => 'required|numeric',
            'description' => 'nullable|string',
        ]);

        $subscriptionPlan = SubscriptionPlan::findOrFail($id);
        $subscriptionPlan->update($validatedData);

        return response()->json(['message' => 'Subscription Plan updated successfully', 'subscriptionPlan' => $subscriptionPlan]);
    }

    public function destroy($id)
    {
        $subscriptionPlan = SubscriptionPlan::findOrFail($id);
        $subscriptionPlan->delete();

        return response()->json(['message' => 'Subscription Plan deleted successfully']);
    }
}
