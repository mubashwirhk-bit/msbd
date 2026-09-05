'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  orderItems: any[];
}

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!order) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const currentStep = statusSteps.indexOf(order.status);

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
        <p className="text-slate-600 mb-8">Order ID: #{order.id}</p>

        {/* Status Badge */}
        <div className="mb-8">
          <span className={`inline-block px-6 py-2 rounded-full font-bold text-lg ${getStatusColor(order.status)}`}>
            {order.status.toUpperCase()}
          </span>
        </div>

        {/* Timeline */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-8">Delivery Progress</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index <= currentStep ? '✓' : index + 1}
                </div>
                <span className="text-sm font-bold text-center">
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 mt-2 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>
            <div className="space-y-3 text-slate-700">
              <p>
                <span className="font-bold">Name:</span> {order.customerName}
              </p>
              <p>
                <span className="font-bold">Email:</span> {order.email}
              </p>
              <p>
                <span className="font-bold">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="font-bold">Address:</span> {order.address}, {order.city}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-slate-700">
              <p>
                <span className="font-bold">Order Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString('en-BD')}
              </p>
              <p>
                <span className="font-bold">Items:</span> {order.orderItems.length}
              </p>
              <p className="text-2xl font-bold text-blue-600">
                Total: ৳{order.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-2xl font-bold mb-4">Ordered Items</h2>
          <div className="space-y-3">
            {order.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center pb-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-bold">{item.productName}</p>
                  <p className="text-slate-600 text-sm">Size: {item.size} × {item.quantity}</p>
                </div>
                <p className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/jerseys"
            className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/contact"
            className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded font-bold hover:bg-blue-50 transition"
          >
            Contact Support
          </Link>
        </div>
      </div>

      <Footer />
    </>
  );
}