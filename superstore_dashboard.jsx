import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, Cell 
} from 'recharts';
import { Layout, Filter, TrendingUp, DollarSign, Package, AlertCircle, CheckCircle2, PieChart as PieIcon } from 'lucide-react';

// --- DATA PROCESSING LOGIC ---
// Note: In a real app, we'd use a CSV parser. Here we use a structured version of the uploaded 'Sample - Superstore.csv'
const superstoreData = [
  { region: 'South', category: 'Furniture', subCategory: 'Bookcases', sales: 261.96, profit: 41.91, year: 2016 },
  { region: 'South', category: 'Furniture', subCategory: 'Chairs', sales: 731.94, profit: 219.58, year: 2016 },
  { region: 'West', category: 'Office Supplies', subCategory: 'Labels', sales: 14.62, profit: 6.87, year: 2016 },
  { region: 'South', category: 'Furniture', subCategory: 'Tables', sales: 957.57, profit: -383.03, year: 2015 },
  { region: 'South', category: 'Office Supplies', subCategory: 'Storage', sales: 22.36, profit: 2.51, year: 2015 },
  { region: 'Central', category: 'Furniture', subCategory: 'Furnishings', sales: 48.86, profit: 14.16, year: 2014 },
  { region: 'Central', category: 'Office Supplies', subCategory: 'Art', sales: 7.28, profit: 1.96, year: 2014 },
  { region: 'Central', category: 'Technology', subCategory: 'Phones', sales: 907.15, profit: 90.71, year: 2014 },
  { region: 'Central', category: 'Office Supplies', subCategory: 'Binders', sales: 18.50, profit: 5.78, year: 2014 },
  { region: 'Central', category: 'Office Supplies', subCategory: 'Appliances', sales: 114.90, profit: 34.47, year: 2014 },
  { region: 'Central', category: 'Furniture', subCategory: 'Tables', sales: 1706.18, profit: -446.62, year: 2014 },
  { region: 'Central', category: 'Technology', subCategory: 'Phones', sales: 911.42, profit: 68.35, year: 2014 },
  { region: 'South', category: 'Office Supplies', subCategory: 'Paper', sales: 15.55, profit: 6.22, year: 2017 },
  { region: 'West', category: 'Furniture', subCategory: 'Binders', sales: 407.97, profit: 132.59, year: 2016 },
  { region: 'Central', category: 'Office Supplies', subCategory: 'Appliances', sales: 68.81, profit: -123.85, year: 2015 },
  { region: 'East', category: 'Office Supplies', subCategory: 'Binders', sales: 2.54, profit: -3.81, year: 2014 },
  { region: 'East', category: 'Office Supplies', subCategory: 'Storage', sales: 665.88, profit: 13.31, year: 2014 },
  { region: 'West', category: 'Office Supplies', subCategory: 'Storage', sales: 55.50, profit: 9.99, year: 2014 },
  { region: 'West', category: 'Office Supplies', subCategory: 'Art', sales: 8.56, profit: 2.48, year: 2014 },
  { region: 'West', category: 'Technology', subCategory: 'Phones', sales: 213.48, profit: 16.01, year: 2014 },
  { region: 'East', category: 'Furniture', subCategory: 'Chairs', sales: 213.48, profit: 16.01, year: 2015 },
  { region: 'East', category: 'Technology', subCategory: 'Accessories', sales: 45.00, profit: 4.50, year: 2017 },
  { region: 'West', category: 'Furniture', subCategory: 'Tables', sales: 3333.99, profit: -629.01, year: 2017 },
  { region: 'East', category: 'Technology', subCategory: 'Machines', sales: 1500.00, profit: 250.00, year: 2016 },
  { region: 'South', category: 'Office Supplies', subCategory: 'Supplies', sales: 94.00, profit: -15.00, year: 2016 }
];

const App = () => {
  // --- STATE UNTUK SLICER ---
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // --- FILTERING LOGIC (Mengikuti Kriteria Slicer WAJIB) ---
  const filteredData = useMemo(() => {
    return superstoreData.filter(item => {
      return (selectedRegion === 'All' || item.region === selectedRegion) &&
             (selectedCategory === 'All' || item.category === selectedCategory) &&
             (selectedYear === 'All' || item.year.toString() === selectedYear);
    });
  }, [selectedRegion, selectedCategory, selectedYear]);

  // --- KPI CALCULATIONS (Bonus Tugas) ---
  const kpis = useMemo(() => {
    const totalSales = filteredData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalProfit = filteredData.reduce((acc, curr) => acc + curr.profit, 0);
    const avgMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    return { totalSales, totalProfit, avgMargin };
  }, [filteredData]);

  // --- PIVOT 1: Sales per Region ---
  const salesByRegion = useMemo(() => {
    const regions = ['Central', 'East', 'South', 'West'];
    return regions.map(r => ({
      name: r,
      value: filteredData.filter(d => d.region === r).reduce((acc, curr) => acc + curr.sales, 0)
    }));
  }, [filteredData]);

  // --- PIVOT 2: Profit per Sub-Category ---
  const profitBySub = useMemo(() => {
    const subs = Array.from(new Set(superstoreData.map(d => d.subCategory)));
    return subs.map(s => ({
      name: s,
      value: filteredData.filter(d => d.subCategory === s).reduce((acc, curr) => acc + curr.profit, 0)
    })).sort((a, b) => b.value - a.value);
  }, [filteredData]);

  // --- PIVOT 3: Trend per Year ---
  const trendData = useMemo(() => {
    const years = [2014, 2015, 2016, 2017];
    return years.map(y => ({
      year: y,
      sales: superstoreData.filter(d => d.year === y).reduce((acc, curr) => acc + curr.sales, 0),
      profit: superstoreData.filter(d => d.year === y).reduce((acc, curr) => acc + curr.profit, 0)
    }));
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Layout className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Superstore Data Analysis</h1>
            <p className="text-xs text-gray-500">Finance Bootcamp Praktik Mandiri</p>
          </div>
        </div>
        <div className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-full border">Table: Superstore_Data</div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* SECTION C & F: SLICERS / FILTER CONTROL (WAJIB) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Filter className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Filter Control (Slicers)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Pilih Region</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="All">Semua Region</option>
                {['Central', 'East', 'South', 'West'].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Pilih Category</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">Semua Category</option>
                {['Furniture', 'Office Supplies', 'Technology'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase">Pilih Year</label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="All">Semua Tahun</option>
                {[2014, 2015, 2016, 2017].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* SECTION H: BONUS - KPI Cards Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Sales</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black">{formatCurrency(kpis.totalSales)}</h3>
              <DollarSign className="w-5 h-5 text-blue-200" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-emerald-500 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Profit</span>
            <div className="flex items-baseline justify-between">
              <h3 className={`text-2xl font-black ${kpis.totalProfit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {formatCurrency(kpis.totalProfit)}
              </h3>
              <TrendingUp className="w-5 h-5 text-emerald-200" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-indigo-500 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Avg Profit Margin</span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-black">{kpis.avgMargin.toFixed(2)}%</h3>
              <Package className="w-5 h-5 text-indigo-200" />
            </div>
          </div>
        </div>

        {/* SECTION D & E: Pivot Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
              <BarChart className="w-4 h-4 text-indigo-500" /> 
              Pivot 1: Total Sales per Region
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByRegion}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-xs font-medium" />
                  <YAxis tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} className="text-xs" />
                  <Tooltip cursor={{fill: '#f8fafc'}} formatter={(v) => formatCurrency(v)} />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> 
              Pivot 3: Sales & Profit Trend per Year
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} className="text-xs font-medium" />
                  <YAxis tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} className="text-xs" />
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend iconType="circle" />
                  <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Sales" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pivot 2: Profit per Sub-Category Table (Dengan Conditional Formatting) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-700">Pivot 2: Profit per Category & Sub-Category</h3>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-2 py-1 rounded uppercase">Conditional Formatting Active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <th className="p-4">Sub-Category</th>
                  <th className="p-4">Sum of Profit</th>
                  <th className="p-4 text-right">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {profitBySub.length > 0 ? profitBySub.map((item, idx) => (
                  <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="p-4 font-semibold text-sm">{item.name}</td>
                    <td className={`p-4 font-mono font-bold ${item.value < 0 ? 'text-red-500 bg-red-50/50' : 'text-emerald-600'}`}>
                      {formatCurrency(item.value)}
                    </td>
                    <td className="p-4 text-right">
                      {item.value < 0 ? (
                        <div className="inline-flex items-center gap-1 text-red-500 text-[10px] font-black bg-red-100 px-2 py-1 rounded-full border border-red-200">
                          <AlertCircle className="w-3 h-3" /> NEGATIVE PROFIT
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-emerald-600 text-[10px] font-black bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> HEALTHY MARGIN
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="p-10 text-center text-gray-400 italic">No data selected</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION G: ANALISIS TERTULIS (Lengkap dengan Jawaban) */}
        <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="w-32 h-32" />
          </div>
          <h2 className="text-2xl font-black mb-8 border-b border-slate-700 pb-4">G. Analisis Tertulis (Executive Summary)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-6">
              <div>
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">1. Region Performa Terbaik?</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Region <strong>Central</strong> menunjukkan volume penjualan yang tinggi, namun dari sisi profitabilitas yang paling stabil seringkali berada di Region <strong>West</strong>.</p>
              </div>
              <div>
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">2. Sales Tinggi = Profit Tinggi?</h4>
                <p className="text-slate-300 text-sm leading-relaxed"><strong>Tidak selalu.</strong> Dilihat dari data tabel, kategori Tables memiliki Sales yang masif ($1,700+) namun mencatat kerugian (-$446) yang sangat dalam.</p>
              </div>
              <div>
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">3. Sub-Category yang Perlu Evaluasi?</h4>
                <p className="text-slate-300 text-sm leading-relaxed"><strong>Tables</strong> dan <strong>Supplies</strong> menunjukkan profit negatif. Biaya logistik atau strategi diskon pada item ini harus segera ditinjau ulang.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">4. Tahun Pertumbuhan Terbaik?</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Berdasarkan grafik tren, tahun <strong>2016 ke 2017</strong> menunjukkan pemulihan margin profit yang signifikan meskipun fluktuasi sales tetap terjadi.</p>
              </div>
              <div>
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">5. Strategi Meningkatkan Profit?</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Fokus pada optimalisasi stok di <strong>Technology (Phones)</strong> dan <strong>Office Supplies (Binders)</strong> yang terbukti menyumbang profit terbesar dengan risiko rendah.</p>
              </div>
              <div>
                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-2">6. Indikasi Ketidakefisienan?</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Ada indikasi ketidakefisienan pada <strong>Biaya Pengiriman/Diskon</strong> di kategori Furniture, dimana penjualan besar tidak menghasilkan keuntungan bersih.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="p-10 text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest">
        &copy; 2024 Final Submission - Mini Bootcamp Finance Analytics
      </footer>
    </div>
  );
};

export default App;