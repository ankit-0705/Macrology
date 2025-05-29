import React, { useContext, useState } from 'react';
import MacroContext from '../context/MacroContext';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

const backendUrl = import.meta.env.VITE_API_BASE_URL;

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProfilePage() {
  const { profileInfo, infoGetter, macroInfo } = useContext(MacroContext);
  const [editInfo, setEditInfo] = useState({ name: '', email: '', pnum: '' });
  const [monthOffset, setMonthOffset] = useState(0);

  const handleClick = () => {
    setEditInfo({
      name: profileInfo?.name || '',
      email: profileInfo?.email || '',
      pnum: profileInfo?.pnum || '',
    });
    document.getElementById('my_modal_1').showModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      await axios.put(`${backendUrl}/api/user/updateuser`, editInfo, {
        headers: { 'auth-token': token }
      });
      await infoGetter();
      document.getElementById('my_modal_1').close();
    } catch (error) {
      console.error('Some Error Occurred!!', error);
    }
  };

  // 🔄 Process macro data into daily totals for the selected month
  const processChartData = (macroInfo, offset = 0) => {
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() + offset);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dailyData = Array.from({ length: daysInMonth }, () => ({
      protein: 0,
      carbs: 0,
      fats: 0,
    }));

    macroInfo?.forEach(entry => {
      const entryDate = new Date(entry.date);
      if (entryDate.getFullYear() === year && entryDate.getMonth() === month) {
        const dayIndex = entryDate.getDate() - 1;
        dailyData[dayIndex].protein += entry.protein_g || 0;
        dailyData[dayIndex].carbs += entry.carb_g || 0;
        dailyData[dayIndex].fats += entry.fat_g || 0;
      }
    });

    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
    return {
      labels,
      datasets: [
        {
          label: 'Protein',
          data: dailyData.map(d => d.protein),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Carbs',
          data: dailyData.map(d => d.carbs),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
        {
          label: 'Fats',
          data: dailyData.map(d => d.fats),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };
  };

  const chartData = processChartData(macroInfo, monthOffset);
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      x: { title: { display: true, text: 'Day of Month' } },
      y: { title: { display: true, text: 'Grams' } },
    },
  };

  // Calculate month name and year for display under the chart
  const now = new Date();
  const displayedDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const monthName = displayedDate.toLocaleString('default', { month: 'long' });
  const year = displayedDate.getFullYear();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 text-white overflow-x-hidden">
        <main className="flex-1">
          <div className="flex flex-col items-center px-6 pt-6 max-w-5xl mx-auto">

            {/* Banner and Profile Image */}
            <div className="w-full relative">
              <img src="https://thumbs.dreamstime.com/b/abstract-food-background-top-view-dark-rustic-kitchen-table-wooden-cutting-board-cooking-spoon-frame-banner-137304354.jpg"
                alt="Banner" className="w-full h-48 object-cover rounded-lg" />
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2">
                <img src="https://masterpiecer-images.s3.yandex.net/42f8251e747a11ee9c29b646b2a0ffc1:upscaled"
                  alt="Profile" className="w-28 h-28 rounded-full border-4 border-black shadow-lg" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-20 w-full px-4">
              <h1 className="text-3xl font-bold text-center">{profileInfo?.name || 'Loading...'}</h1>

              <div className="mt-10 w-full max-w-3xl mx-auto flex justify-between items-center">
                <h2 className="text-white text-lg font-semibold">Remaining Info:</h2>
                <button onClick={handleClick} className="text-green-400 hover:text-green-300 transition text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                  </svg>
                  Edit
                </button>

                {/* Modal */}
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box bg-base-100 text-white">
                    <h3 className="font-bold text-lg text-green-500 mb-4">Edit Profile Info</h3>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <input type="text" name="name" value={editInfo.name} onChange={handleChange} required placeholder="Username"
                        className="input input-bordered" minLength="3" maxLength="30" />
                      <input type="email" name="email" value={editInfo.email} onChange={handleChange} required placeholder="Email"
                        className="input input-bordered" />
                      <input type="tel" name="pnum" value={editInfo.pnum} onChange={handleChange} required placeholder="Phone"
                        pattern="[0-9]*" minLength="10" maxLength="10" className="input input-bordered" />
                      <div className="modal-action justify-between">
                        <button type="submit" className="btn btn-success">Save</button>
                        <button type="button" className="btn" onClick={() => document.getElementById('my_modal_1').close()}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </dialog>
              </div>

              {/* Extra Info */}
              <div className="mt-2 collapse bg-base-100 border border-base-300 rounded">
                <input type="checkbox" />
                <div className="collapse-title font-semibold text-white">Click to view more info</div>
                <div className="collapse-content text-white flex flex-col gap-4">
                  <p><span className="font-medium">Email:</span> {profileInfo?.email}</p>
                  <p><span className="font-medium">Phone Number:</span> {profileInfo?.pnum}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Tracker */}
          <div className='bg-base-300 p-3 my-3'>
            <h6>Streak Tracker</h6>
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
                        className={`w-full aspect-square rounded ${isActive ? 'bg-green-500' : 'bg-gray-700'}`}
                        title={isoDate}
                      ></div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>


          {/* 📊 Chart */}
          <div className="bg-base-300 p-5 mx-5 rounded-lg my-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Monthly Macro Consumption</h3>
              <div className="flex gap-2">
                <button onClick={() => setMonthOffset(prev => prev - 1)} className="btn btn-sm btn-outline">Previous</button>
                <button onClick={() => setMonthOffset(prev => prev + 1)} className="btn btn-sm btn-outline">Next</button>
              </div>
            </div>
            <Bar options={chartOptions} data={chartData} />
            <p className="mt-3 text-center text-gray-400">{monthName} {year}</p>
          </div>
        </main>
      </div>
    </>
  );
}

export default ProfilePage;
