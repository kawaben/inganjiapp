'use client';

import { Heart,Boxes,TrendingUp,Star,Briefcase } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
 const data = [
  { name: 'Sales', value: 50 },
  { name: 'Returns', value: 40 },
  { name: 'Distribute', value: 10 },
];

    const COLORS = ['#4f46e5', '#f97316', '#facc15'];

  return (
   <>
   
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-left p-6 bg-white rounded-2xl shadow gap-4">
                <div className="flex items-center justify-center text-red-500">
                    <Heart size={18} />
                </div>
                
                <div>
                    <p className="text-sm text-gray-500"> Saved Products</p>
                    <h2 className="text-2xl font-semibold">178+</h2>
                </div>
              
            </div>

            <div className="flex items-center justify-left p-6 bg-white rounded-2xl shadow gap-4">
                <div className="flex items-center justify-center text-yellow-500">
                    <Boxes size={18} />
                </div>
                
                <div>
                    <p className="text-sm text-gray-500">Stock Products</p>
                    <h2 className="text-2xl font-semibold">20+</h2>
                </div>
              
            </div>

            <div className="flex items-center justify-left p-6 bg-white rounded-2xl shadow gap-4">
                <div className="flex items-center justify-center text-green-500">
                    <TrendingUp size={18} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Sales Products</p>
                    <h2 className="text-2xl font-semibold">190+</h2>
                </div>
              
            </div>

            <div className="flex items-center justify-left p-6 bg-white rounded-2xl shadow gap-4">
                <div className="flex items-center justify-center text-blue-500">
                    <Briefcase size={18} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Jobs Applications</p>
                    <h2 className="text-2xl font-semibold">10+</h2>
                </div>
              
            </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="mt-8 p-10 bg-white rounded-2xl shadow">
                <h3 className="text-lg font-semibold mb-4">Analytics</h3>
                <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                    <Pie data={data} dataKey="value" outerRadius={80} label>
                        {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center justify-left gap-2">
                        <div className="h-4 w-4 bg-[#4f46e5] rounded-xl"></div>
                        <div>Sales</div>
                    </div>
                    <div className="flex items-center justify-left gap-2">
                        <div className="h-4 w-4 bg-[#f97316] rounded-xl"></div>
                        <div>Returns</div>
                    </div>
                    <div className="flex items-center justify-left gap-2">
                        <div className="h-4 w-4 bg-[#facc15] rounded-xl"></div>
                        <div>Distribute</div>
                    </div>
                </div>
                </div>
            </div>

            <div className="mt-8 p-6 bg-white rounded-2xl shadow">
                <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2  gap-3">
                    <div className="flex items-center justify-left rounded-xl gap-2">
                        <div><img
                                src="images/f1-blue.jpg"
                                alt="Preview"
                                className="w-20 h-20 mt-2 object-cover rounded-xl"
                                />  
                        </div>
                        <div>
                            <p className="text-gray-700">Queen of Ace</p>
                            <p className="grid grid-cols-5 text-yellow-500"><Star size={15} /><Star size={15} /><Star size={15} /><Star size={15} /></p>
                            <p className="font-semibold">$30</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-left rounded-xl gap-2">
                        <div><img
                                src="images/f1-red.png"
                                alt="Preview"
                                className="w-20 h-20 mt-2 object-cover rounded-xl"
                                />  
                        </div>
                        <div>
                            <p className="text-gray-700">Pen On Tee</p>
                            <p className="grid grid-cols-5 text-yellow-500"><Star size={15} /><Star size={15} /><Star size={15} /><Star size={15} /></p>
                            <p className="font-semibold">$30</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-left rounded-xl gap-2">
                        <div><img
                                src="images/m1-orange.jpg"
                                alt="Preview"
                                className="w-20 h-20 mt-2 object-cover rounded-xl"
                                />  
                        </div>
                        <div>
                            <p className="text-gray-700">I am King</p>
                            <p className="grid grid-cols-5 text-yellow-500"><Star size={15} /><Star size={15} /><Star size={15} /><Star size={15} /></p>
                            <p className="font-semibold">$30</p>
                        </div>
                    </div>
                
                </div>
            </div>
        </div>

            
   </>

  
  );
}
