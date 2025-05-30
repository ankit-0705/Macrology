import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import MacroContext from '../context/MacroContext';
const backendUrl = import.meta.env.VITE_API_BASE_URL;

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedMeal, setSelectedMeal] = useState('');

  const { profileInfo, macroInfo, infoGetter, dailyGoals } = useContext(MacroContext);

  // Compute totals from macroInfo (instead of local meals state)
  const todayISO = new Date().toISOString().split('T')[0];
  const todaysEntries = (macroInfo || []).filter(item => item.date === todayISO);

  const totals = { energy_kcal: 0, protein_g: 0, fat_g: 0, carb_g: 0 };
  const meals = { breakfast: [], lunch: [], dinner: [] };

  todaysEntries.forEach(item => {
    totals.energy_kcal += item.energy_kcal || 0;
    totals.protein_g += item.protein_g || 0;
    totals.fat_g += item.fat_g || 0;
    totals.carb_g += item.carb_g || 0;

    if (meals[item.meal]) {
      meals[item.meal].push(item);
    }
  });

  // Calorie calculation and visual logic
  const getCalorieData = (consumed, goal) => {
    const remaining = goal - consumed;
    const percentage = (consumed / goal) * 100;

    return {
      data: [
        { name: 'Consumed', value: consumed },
        { name: 'Remaining', value: remaining > 0 ? remaining : 0 },
      ],
      percentage: percentage.toFixed(2),
      isOver: percentage > 100,
    };
  };

const calorieChart = getCalorieData(totals.energy_kcal, dailyGoals.energy_kcal);


  const getMacroData = (consumed, goal) => {
    const remaining = goal - consumed;
    const percentage = (consumed / goal) * 100;

    return {
      data: [
        { name: 'Consumed', value: consumed },
        { name: 'Remaining', value: remaining > 0 ? remaining : 0 },
      ],
      percentage: percentage.toFixed(2),
      isOver: percentage > 100,
    };
  };

  const dataMacros = {
    protein_g: getMacroData(totals.protein_g, dailyGoals.protein_g),
    fat_g: getMacroData(totals.fat_g, dailyGoals.fat_g),
    carb_g: getMacroData(totals.carb_g, dailyGoals.carb_g),
  };

  // Fetch search results
  useEffect(() => {
    const fetchFoodItems = async () => {
      if (!searchQuery) return setSearchResults([]);
      try {
        const res = await axios.get(`${backendUrl}/api/macros/search?query=${searchQuery}`);
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
      await axios.post(`${backendUrl}/api/macros/add`, foodData);
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
        <div className='bg-base-300 p-3 my-3 rounded'>
          <h6 className='text-slate-100'>Streak Tracker</h6>
          <div className="my-2">
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(0.75rem,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(1rem,_1fr))] gap-1">
              {(() => {
                const datesWithEntries = new Set(
                  (macroInfo || []).map(item => item.date)
                );

                const currentYear = new Date().getFullYear();
                const startDate = new Date(currentYear, 0, 1); // Jan 1 current year
                const daysInYear = (new Date(currentYear + 1, 0, 1) - startDate) / (1000 * 60 * 60 * 24); // 365 or 366

                return Array.from({ length: daysInYear }).map((_, i) => {
                  const date = new Date(startDate);
                  date.setDate(startDate.getDate() + i);
                  const isoDate = date.toISOString().split('T')[0];

                  const isActive = datesWithEntries.has(isoDate);
                  return (
                    <div
                      key={isoDate}
                      className={`w-full aspect-square rounded ${isActive ? 'bg-green-600' : 'bg-gray-700'}`}
                      title={isoDate}
                    ></div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

    {/* Calories Pie */}
    <div className="bg-base-300 text-slate-100 p-4 rounded shadow mb-6">
        <h2 className="text-center font-semibold mb-4 text-green-500">Calories</h2>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calorieChart.data}
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  labelLine={false}
                  stroke="#e0e5cd"
                  strokeWidth={1}
                >
                  {calorieChart.data.map((entry, index) => (
                    <Cell
                      key={`cell-cal-${index}`}
                      fill={
                        index === 0
                          ? calorieChart.isOver
                            ? '#991b1b' // bright red for over
                            : '#22c55e' // bright green for under
                          : '#1f2937'
                      }
                    />
                  ))}
                  <Label
                    value={`${calorieChart.percentage}%`}
                    position="center"
                    fill="#f1f5f9"
                    fontSize={14}
                    fontWeight="semibold"
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 w-full">
            <div className="mb-2 text-sm font-medium text-slate-100">Progress</div>
            <progress
              className={`progress w-full h-4 ${
                calorieChart.isOver ? 'progress-error' : 'progress-success'
              }`}
              value={totals.energy_kcal}
              max={dailyGoals.energy_kcal}
              style={{
                filter: 'brightness(0.75)', // reduce brightness for progress bar
              }}
            ></progress>
            <p
              className="mt-2 text-sm font-semibold"
              style={{
                color: calorieChart.isOver ? '#ff4d4d' : '#4ade80', // brighter versions
                filter: 'brightness(1.2)', // increase brightness of text
              }}
            >
              {totals.energy_kcal.toFixed(2)} / {dailyGoals.energy_kcal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

        {/* Macronutrient Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(dataMacros).map(([key, data]) => (
          <div key={key} className="bg-base-300 text-slate-100 p-4 rounded shadow text-center">
            <h3 className="capitalize font-medium mb-2 text-green-500">{key}</h3>
            <div className="w-24 h-24 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.data} innerRadius={30} outerRadius={40} dataKey="value" labelLine={false} stroke='#e0e5cd' strokeWidth={1}>
                    {data.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0
                          ? data.isOver ? '#991b1b' /* red */ : '#22c55e' /* green */
                          : '#1f2937' /* gray */}
                      />
                    ))}
                    <Label
                      value={`${data.percentage}%`}
                      position="center"
                      fill="#f1f5f9"
                      fontSize={12}
                      fontWeight="semibold"
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-green-500">{data.data[0].value.toFixed(2)} g</p>
          </div>
        ))}
        </div>

        {/* Search + Add Food */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food item..."
              className="flex-grow px-4 py-2 rounded bg-base-200 text-slate-100 border border-green-600 placeholder-green-500"
            />
            <select
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="bg-base-200 text-slate-200 border border-green-600 px-3 py-2 rounded"
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
            {searchResults.map((item) => {
              const isSelected = selectedFood?.food_name === item.food_name;
              return (
                <div
                  key={item.food_name}
                  onClick={() => setSelectedFood(item)}
                  className={`p-3 cursor-pointer rounded border ${isSelected ? 'border-green-600' : 'border-#f1f5f9'} bg-base-200`}
                >
                  <h4 className="text-slate-200 font-semibold">{item.food_name}</h4>
                </div>
              );
            })}
          </div>

        </div>

        {/* Meals */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {['breakfast', 'lunch', 'dinner'].map((meal) => (
            <div key={meal} className="flex-1 bg-base-300 text-slate-100 p-4 rounded shadow">
              <h4 className="font-semibold mb-2 text-green-500 capitalize">{meal}</h4>
              <div className="flex flex-wrap gap-2">
                {meals[meal].map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 text-slate-100 px-3 py-1 rounded text-sm max-w-full break-words"
                  >
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
