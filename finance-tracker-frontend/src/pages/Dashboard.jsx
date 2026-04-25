import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import API from "../api/axios";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,LineChart, Line} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";


export default function Dashboard() {
  
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: "", category: "" });
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);
  // const [dark, setDark] = useState(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const { user, logout } = useAuth();
  const { dark, setDark } = useTheme();


  // Fetch transactions
  useEffect(() => {
    fetchData();
  }, [fetchData]);

 const fetchData = useCallback(async () => {
  const res = await API.get("/transactions");
  setTransactions(res.data);
}, []);



  // Add transaction
 const handleAdd = useCallback(async () => {
  try {
    if (!form.amount || !form.category) {
      alert("Fill all fields");
      return;
    }

    const payload = {
      amount: Number(form.amount), // 👈 YAHAN CHANGE
      category: form.category,
    };

    if (editId) {
      await API.put(`/transactions/${editId}`, payload);
      setEditId(null);
    } else {
      await API.post("/transactions", payload);
    }

    setForm({ amount: "", category: "" });
    fetchData();

  } catch (err) {
  console.log("ERROR:", err.response?.data || err.message);
}
}, [form, editId, fetchData]);


  const handleDelete = useCallback(async (id) => {
  try {
    await API.delete(`/transactions/${id}`);
    fetchData(); // refresh
  } catch (err) {
    console.log(err);
  }
}, [fetchData]);
 

const total = useMemo(() => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}, [transactions]);
 const income = useMemo(() => {
  return transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
}, [transactions]);

const expense = useMemo(() => {
  return transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
}, [transactions]);
const chartData = [
  { name: "Income", value: income },
  { name: "Expense", value: Math.abs(expense) },
];

const filtered = transactions.filter(t => {
  const matchSearch = t.category
    .toLowerCase()
    .includes(search.toLowerCase());

  if (filter === "income") return t.amount > 0 && matchSearch;
  if (filter === "expense") return t.amount < 0 && matchSearch;

  return matchSearch;
});

const paginated = filtered.slice(
  (page - 1) * itemsPerPage,
  page * itemsPerPage
);

const categoryData = Object.values(
  transactions.reduce((acc, t) => {
    if (!acc[t.category]) {
      acc[t.category] = { name: t.category, value: 0 };
    }
    acc[t.category].value += t.amount;
    return acc;
  }, {})
);


const monthlyData = Object.values(
  transactions.reduce((acc, t) => {
    const date = new Date(t.created_at);
    const monthIndex = date.getMonth(); // 0 = Jan

    if (!acc[monthIndex]) {
      acc[monthIndex] = {
        monthIndex,
        name: date.toLocaleString("default", { month: "short" }),
        value: 0,
      };
    }

    acc[monthIndex].value += t.amount;
    return acc;
  }, {})
)

.sort((a, b) => a.monthIndex - b.monthIndex); // 🔥 sorting

const cleanMonthlyData = monthlyData.map(({ name, value }) => ({
  name,
  value,
}));

  return (
    <div className={`${dark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen p-6`}>
         {/* Sidebar */}
 

      {/* 🔵 Navbar */}
     <div className={`flex justify-between items-center px-6 py-4 rounded-xl mb-6 
${dark 
  ? "bg-gray-800/80 backdrop-blur-md border border-gray-700" 
  : "bg-white/80 backdrop-blur-md border border-gray-200 shadow"} 
`}>

  {/* Left Side */}
  <div className="flex items-center gap-3">
    <div className="bg-yellow-400 p-2 rounded-full shadow">
      💰
    </div>
    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
  Finance Tracker
</h1>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-4">

    {/* Dark Mode Button */}
    <button
      onClick={() => setDark(!dark)}
      className={`px-4 py-1 rounded-lg transition 
      ${dark 
        ? "bg-gray-700 text-white hover:bg-gray-600" 
        : "bg-gray-200 hover:bg-gray-300"}`
      }
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>

    {/* Logout Button */}
    <button
      onClick={() => {
        logout();
        navigate("/");
      }}
      className="text-red-500 hover:text-red-700 font-semibold"
    >
      Logout
    </button>

  </div>
</div>

      {/* 📊 Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
  <div className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl 
shadow ${dark ? "shadow-black/50 border border-gray-700" : "shadow-md"}`}>
    <h2>Total</h2>
    <p className="text-3xl font-bold">₹ {total}</p>
  </div>

  <div className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl 
shadow ${dark ? "shadow-black/50 border border-gray-700" : "shadow-md"}`}>
    <h2>Income</h2>
    <p className="text-3xl font-bold">₹ {income}</p>
  </div>

  <div className={`bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-xl 
shadow ${dark ? "shadow-black/50 border border-gray-700" : "shadow-md"}`}>
    <h2>Expense</h2>
    <p className="text-3xl font-bold">₹ {Math.abs(expense)}</p>
  </div>
</div>


{/* //piechart */}
<div className={`${dark 
  ? "bg-gray-800/80 border border-gray-700" 
  : "bg-white/80 border border-gray-200"} 
  backdrop-blur-md p-6 rounded-2xl shadow-lg mb-6`}>

  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
    🥧 Income vs Expense
  </h2>

  <div className="flex justify-center">
    <PieChart width={300} height={300}>
      <Pie
        data={chartData}
        dataKey="value"
        outerRadius={100}
        innerRadius={50}
        paddingAngle={5}
      >
        <Cell fill="#22c55e" /> {/* Income */}
        <Cell fill="#ef4444" /> {/* Expense */}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>
</div>

{/* //linechart */}
<div className={`${dark 
  ? "bg-gray-800/80 border border-gray-700" 
  : "bg-white/80 border border-gray-200"} 
  backdrop-blur-md p-6 rounded-2xl shadow-lg mb-6`}>

  <h2 className="font-semibold text-lg mb-4">
    📈 Monthly Trend
  </h2>

  <div className="flex justify-center">
    <LineChart width={500} height={300} data={cleanMonthlyData}>
      <XAxis dataKey="name" stroke="#9ca3af" />
      <YAxis stroke="#9ca3af" />
      <Tooltip />
      <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} />
    </LineChart>
  </div>
</div>


   {/* //barchart      */}
<div className={`${dark 
  ? "bg-gray-800/80 border border-gray-700" 
  : "bg-white/80 border border-gray-200"} 
  backdrop-blur-md p-6 rounded-2xl shadow-lg mb-6`}>

  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
    📊 Category Wise
  </h2>
   <div className="flex justify-center">
    <BarChart width={500} height={300} data={categoryData}>
     <XAxis dataKey="name" stroke="#9ca3af" />
<YAxis stroke="#9ca3af" />
    <Tooltip
  contentStyle={{
    backgroundColor: "#1f2937",
    border: "none",
    borderRadius: "8px",
    color: "#fff"
  }}
/>
      <Bar dataKey="value">
  {categoryData.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={
        entry.value > 0
          ? "#22c55e"   // income = green
          : "#ef4444"   // expense = red
      }
    />
  ))}
</Bar>
    </BarChart>
  </div>

</div>


<div className="mb-4">
  <input
    type="text"
    placeholder="🔍 Search transactions..."
    className={`p-2 w-full rounded-lg outline-none 
    ${dark 
      ? "bg-gray-700 text-white placeholder-gray-400" 
      : "bg-gray-200"}`}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
 
 <div className="flex gap-3 mb-4">
 <button
  onClick={() => setFilter("all")}
  className={`px-4 py-1 rounded ${
    filter === "all"
      ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
      : "bg-gray-300"
  }`}
>
  All
</button>

 <button
  onClick={() => setFilter("income")}
  className={`px-4 py-1 rounded ${
    filter === "income"
      ? "bg-green-600 text-white"
      : "bg-gray-300"
  }`}
>
  Income
</button>

<button
  onClick={() => setFilter("expense")}
  className={`px-4 py-1 rounded ${
    filter === "expense"
      ? "bg-red-600 text-white"
      : "bg-gray-300"
  }`}
>
  Expense
</button>
</div>
      {/* ➕ Add Transaction */}
      <div className={`${dark 
  ? "bg-gray-800/80 border border-gray-700" 
  : "bg-white/80 border border-gray-200"} 
  backdrop-blur-md p-6 rounded-2xl shadow-lg mb-6`}>
        <h2 className="font-bold mb-2">Add Transaction</h2>

        <div className="flex gap-2">
         <input
  type="number"
  placeholder="Amount (+income, -expense)"
  className={`p-3 rounded-lg w-full outline-none transition 
  ${dark 
    ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
    : "bg-gray-100 focus:ring-2 focus:ring-blue-500"}`}
  value={form.amount}
  onChange={(e) =>
    setForm({ ...form, amount: e.target.value })
  }
/>

          <input
            type="text"
            placeholder="Category"
            className={`p-3 rounded-lg w-full outline-none transition 
${dark 
  ? "bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500" 
  : "bg-gray-100 focus:ring-2 focus:ring-blue-500"}`}
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          {user?.role !== "read-only" && (
  <button
    onClick={handleAdd}
    className="bg-blue-500 text-white px-4 rounded"
  >
    {editId ? "Update" : "Add"}
  </button>
)}
        </div>
      </div>

      {/* 📋 Transaction List */}
      <div className={`${dark 
  ? "bg-gray-800/80 border border-gray-700" 
  : "bg-white/80 border border-gray-200"} 
  backdrop-blur-md p-6 rounded-2xl shadow-lg`}>
        <h2 className="font-semibold text-lg mb-4">📋 Transactions</h2>

        {paginated.map((t) => (
          <div
            key={t.id}
            className="flex justify-between items-center border-b border-gray-300 dark:border-gray-700 py-3 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span>{t.category}</span>
            <div className="flex gap-4 items-center">
            <span className={t.amount > 0 ? "text-green-500" : "text-red-500"}>
              ₹ {t.amount}
            </span>
         {user?.role !== "read-only" && (
  <button
    onClick={() => handleDelete(t.id)}
    className="text-red-500"
  >
    ❌
  </button>
)}


 {user?.role !== "read-only" && (
  <button
    onClick={() => {
      setForm({ amount: t.amount, category: t.category });
      setEditId(t.id);
    }}
    className="text-blue-500"
  >
    ✏️
  </button>
)}

          </div>
          </div>
        ))}
        {/* 🔥 Pagination Buttons */}
<div className="flex justify-center gap-4 mt-4">

  <button
    onClick={() => setPage(page - 1)}
    disabled={page === 1}
    className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    ⬅ Prev
  </button>

  <span className="px-3 py-1 font-semibold">
    Page {page}
  </span>

  <button
    onClick={() => setPage(page + 1)}
    disabled={page * itemsPerPage >= filtered.length}
    className="px-4 py-1 bg-gray-300 rounded disabled:opacity-50"
  >
    Next ➡
  </button>

</div>

        {filtered.length === 0 && (
  <p className="text-center text-gray-400 mt-4">
    No transactions yet
  </p>
)}
      </div>
    </div>
  );
}