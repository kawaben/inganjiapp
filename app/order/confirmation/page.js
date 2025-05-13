export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
      <p className="text-lg text-gray-700 mb-6">Thank you for your purchase.</p>
      
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <ul className="text-gray-600">
          <li>🧾 Order Number: <strong>#123456</strong></li>
          <li>📦 Items: 3 products</li>
          <li>💳 Total: $89.99</li>
        </ul>
      </div>

      <a href="/" className="mt-6 text-blue-600 underline">
        Back to Home
      </a>
    </div>
  );
}
