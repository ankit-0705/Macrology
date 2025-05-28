import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import MacroContext from '../context/MacroContext';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('');

  const { profileInfo, macroInfo, infoGetter } = useContext(MacroContext);

  // Compute totals from macroInfo (instead of local meals state)
  const totals = { energy_kcal: 0, protein_g: 0, fat_g: 0, carb_g: 0 };
  const meals = { breakfast: [], lunch: [], dinner: [] };

  if (macroInfo && Array.isArray(macroInfo)) {
    macroInfo.forEach(item => {
      totals.energy_kcal += item.energy_kcal || 0;
      totals.protein_g += item.protein_g || 0;
      totals.fat_g += item.fat_g || 0;
      totals.carb_g += item.carb_g || 0;

      if (meals[item.meal]) {
        meals[item.meal].push(item);
      }
    });
  }

  const COLORS = ['#22c55e', '#1f2937'];
  const dailyGoals = { energy_kcal: 2000, protein_g: 150, fat_g: 80, carb_g: 200 };

  // Data arrays for Pie charts based on totals and goals
  const dataCalories = [
    { name: 'Consumed', value: totals.energy_kcal },
    { name: 'Remaining', value: Math.max(dailyGoals.energy_kcal - totals.energy_kcal, 0) },
  ];

  const dataMacros = {
    protein_g: [
      { name: 'Consumed', value: totals.protein_g },
      { name: 'Remaining', value: Math.max(dailyGoals.protein_g - totals.protein_g, 0) },
    ],
    fat_g: [
      { name: 'Consumed', value: totals.fat_g },
      { name: 'Remaining', value: Math.max(dailyGoals.fat_g - totals.fat_g, 0) },
    ],
    carb_g: [
      { name: 'Consumed', value: totals.carb_g },
      { name: 'Remaining', value: Math.max(dailyGoals.carb_g - totals.carb_g, 0) },
    ],
  };

  // Fetch search results
  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!searchQuery) return setSearchResults([]);
      try {
        const res = await axios.get(`http://127.0.0.1:5000/api/macros/search?query=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    const delayDebounce = setTimeout(fetchFoodItems, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleAddFood = async () => {
    if (!selectedFood || !selectedMeal) return;

    const today = new Date().toISOString().split('T')[0];

    const foodData = {
      userId: profileInfo?._id,
      foodId: selectedFood._id, // Optional
      food_name: selectedFood.food_name,
      energy_kcal: selectedFood.energy_kcal,
      protein_g: selectedFood.protein_g,
      fat_g: selectedFood.fat_g,
      carb_g: selectedFood.carb_g,
      meal: selectedMeal,
      date: today
    };

    try {
      await axios.post('http://127.0.0.1:5000/api/macros/add', foodData);
      // After adding, refetch macro info to update UI
      if (infoGetter) infoGetter();
    } catch (error) {
      console.error('Failed to add food to backend:', error);
    }

    setSelectedFood(null);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedMeal('');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-7">

        {/* Streak Tracker */}
          <div className='bg-base-300 p-3 my-3'>
            <h6>Streak Tracker</h6>
            <div className="my-2">
              <div className="grid grid-cols-[repeat(auto-fit,_minmax(0.75rem,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(1rem,_1fr))] gap-1">
                {(() => {
                  const datesWithEntries = new Set(
                    (macroInfo || []).map(item => item.date)
                  );

                  return Array.from({ length: 365 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i); // Change from - to + to look ahead
                    const isoDate = date.toISOString().split('T')[0];

                    const isActive = datesWithEntries.has(isoDate);
                    return (
                      <div
                        key={isoDate}
                        className={`w-full aspect-square rounded ${isActive ? 'bg-green-500' : 'bg-gray-700'}`}
                        title={isoDate}
                      ></div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>


        {/* Calories Pie */}
        <div className="bg-base-300 text-white p-4 rounded shadow mb-6">
          <h2 className="text-center font-semibold mb-4 text-green-400">Calories</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dataCalories} innerRadius={50} outerRadius={70} dataKey="value" labelLine={false}>
                    {dataCalories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                    <Label
                      value={`${((dataCalories[0].value / (dataCalories[0].value + dataCalories[1].value)) * 100).toFixed(2)}%`}
                      position="center"
                      fill="#fff"
                      fontSize={14}
                      fontWeight="bold"
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full">
              <div className="mb-2 text-sm font-medium text-white">Progress</div>
              <progress className="progress progress-success w-full h-4" value={totals.energy_kcal} max={dailyGoals.energy_kcal}></progress>
              <p className="mt-2 text-sm text-green-400 font-semibold">{totals.energy_kcal.toFixed(2)} / {dailyGoals.energy_kcal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Macronutrient Charts */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(dataMacros).map(([key, data]) => (
            <div key={key} className="bg-base-300 text-white p-4 rounded shadow text-center">
              <h3 className="capitalize font-medium mb-2 text-green-400">{key}</h3>
              <div className="w-24 h-24 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} innerRadius={30} outerRadius={40} dataKey="value" labelLine={false}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                      <Label
                        value={`${((data[0].value / (data[0].value + data[1].value)) * 100).toFixed(2)}%`}
                        position="center"
                        fill="#fff"
                        fontSize={12}
                        fontWeight="bold"
                      />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-2 text-green-400">{data[0].value.toFixed(2)} g</p>
            </div>
          ))}
        </div>

        {/* Search + Add Food */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food item..."
              className="flex-grow px-4 py-2 rounded bg-base-200 text-white border border-green-500 placeholder-green-400"
            />
            <select
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="bg-base-200 text-white border border-green-500 p-2 rounded"
            >
              <option value="">Choose Meal</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <button
              className="btn btn-soft btn-success"
              disabled={!selectedFood || !selectedMeal}
              onClick={handleAddFood}
            >
              Add +
            </button>
          </div>

          {/* Search Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {searchResults.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedFood(item)}
                className={`p-3 cursor-pointer rounded border ${selectedFood?._id === item._id ? 'bg-gray-800 border-white' : 'bg-base-200'}`}
              >
                <h4 className="text-white font-bold">{item.food_name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <div key={meal} className="bg-base-300 text-white p-4 rounded shadow">
              <h4 className="font-semibold mb-2 text-green-500 capitalize">{meal}</h4>
              <div className="space-y-1">
                {meals[meal].map((item, index) => (
                  <div key={index} className="bg-gray-800 text-white p-2 rounded">
                    {item.food_name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
