import Image from 'next/image';

export default function OrderDetailsPage({ params }) {
  const { orderId } = params;

  // Normally you'd fetch data by orderId here

  return (
    <div className="pt-23 p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow p-4 rounded mb-6">
        <h1 className="text-xl font-semibold">Order ID: {orderId}</h1>
        <p className="text-gray-500">Let’s boost your sales with powerful insights and strategies.</p>
      </div>

      {/* Order Status Tracker */}
      <div className="flex gap-4 bg-white shadow p-4 rounded mb-6 overflow-x-auto">
        {['Order made', 'Order Paid', 'Shipped', 'Completed'].map((step, index) => (
          <div
            key={index}
            className={`px-4 py-2 border rounded ${index === 2 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
          >
            {step}
          </div>
        ))}
        <div className="ml-auto text-sm text-gray-600">No Resi: <span className="font-mono">3du23s9y4z93y</span></div>
      </div>

      {/* Shipping Addresses */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Shipping Address (Seller)</h2>
          <p>Kigali</p>
          <p>kk 143 Market Street, Kigali, PA 19017</p>
          <p>Rwanda</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold mb-2">Shipping Address (Buyer)</h2>
          <p>Rucas Royal</p>
          <p>4567 Elm Street, Apt 3B, Philadelphia, PA 19104, USA</p>
          <p>Near University City</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-4 shadow rounded mb-6">
        <h2 className="font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {/* Item 1 */}
          <div className="flex gap-4">
            <Image src="/images/f1-blue.jpg" width={80} height={80} alt="Sneakers" className="rounded" />
            <div>
              <p className="font-semibold">SNEAKERS INVERNI BW</p>
              <p className="text-sm text-gray-500">Color: Black — Size: 44</p>
              <p>1 x Rp 449.000</p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex gap-4">
            <Image src="/images/f1-red.png" width={80} height={80} alt="Jacket" className="rounded" />
            <div>
              <p className="font-semibold">JACKET PISSED</p>
              <p className="text-sm text-gray-500">Color: Black — Size: XL</p>
              <p>1 x Rp 439.000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-4 shadow rounded">
        <h2 className="font-semibold mb-4">Order Summary</h2>
        <ul className="text-gray-700">
          <li className="flex justify-between">
            <span>Product Price (2 items)</span>
            <span>Rp 888.000</span>
          </li>
          <li className="flex justify-between">
            <span>Shipping Cost</span>
            <span>Rp 50.000</span>
          </li>
          <li className="flex justify-between">
            <span>Shipping Discount</span>
            <span>-Rp 97.500</span>
          </li>
          <li className="flex justify-between">
            <span>Platform Fees</span>
            <span>-Rp 64.500</span>
          </li>
          <hr className="my-2" />
          <li className="flex justify-between font-bold">
            <span>Total Sales</span>
            <span>Rp 876.500</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
