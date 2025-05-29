import { useState, useEffect } from 'react';
import MacroContext from './MacroContext';
import axios from 'axios';

const MacroState = (props) => {
  const [profileInfo, setProfileInfo] = useState(null);

  const [macroInfo, setMacroInfo] = useState(null);

  const [dailyGoals, setDailyGoals] = useState({
    energy_kcal: 2000,
    protein_g: 150,
    fat_g: 80,
    carb_g: 200,
  });

  // Fetch User Info
  const infoGetter = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.error("No token found!!!");
      }
      const response = await axios.post(
        'http://127.0.0.1:5000/api/user/getuser',
        {},
        { headers: { 'auth-token': token } }
      );
      setProfileInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error.response?.data || error.message);
    }
  };

  // Fetch Macro Logs for a Specific Date (default = today)
  const fetchMacroInfo = async () => {
  if (!profileInfo?._id) return;

  try {
    const res = await axios.get('http://127.0.0.1:5000/api/macros/logs', {
      params: {
        userId: profileInfo._id,
        year: new Date().getFullYear() // fetch entries for full current year
      }
    });
    setMacroInfo(res.data);
  } catch (error) {
    console.error('Failed to fetch macro logs:', error.response?.data || error.message);
  }
};


  // Fetch profile on mount
  useEffect(() => {
    infoGetter();
  }, []);

  // Fetch macro info after profile is loaded
  useEffect(() => {
    if (profileInfo?._id) {
      fetchMacroInfo();
    }
  }, [profileInfo]);

  // Auto-refresh macro data at midnight
  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0); // Set to midnight
    const msUntilMidnight = nextMidnight - now;

    const timer = setTimeout(() => {
      fetchMacroInfo(); // Refresh data for the new day
    }, msUntilMidnight);

    return () => clearTimeout(timer); // Clean up timer
  }, [profileInfo]);

  return (
    <MacroContext.Provider value={{ profileInfo, infoGetter, macroInfo, fetchMacroInfo, dailyGoals, setDailyGoals }}>
      {props.children}
    </MacroContext.Provider>
  );
};

export default MacroState;
