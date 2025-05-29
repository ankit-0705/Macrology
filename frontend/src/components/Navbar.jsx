import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import MacroContext from '../context/MacroContext';

function Navbar() {

    const {dailyGoals, setDailyGoals} = useContext(MacroContext);

    const handleClear = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete all macro entries?');
    if (!confirmDelete) return;

    try {
        const response = await axios.delete('http://127.0.0.1:5000/api/macros/deleteAll');
        alert(`Success: ${response.data.deletedCount} entries deleted.`);
    } catch (error) {
        console.error('Error clearing macros:', error);
        alert('An error occurred while deleting entries.');
    }
    };

    const handleGoal = () => {
    const newEnergy = prompt('Enter daily calorie goal (kcal):', dailyGoals.energy_kcal);
    const newProtein = prompt('Enter daily protein goal (g):', dailyGoals.protein_g);
    const newFat = prompt('Enter daily fat goal (g):', dailyGoals.fat_g);
    const newCarb = prompt('Enter daily carb goal (g):', dailyGoals.carb_g);

    if (newEnergy && newProtein && newFat && newCarb) {
      setDailyGoals({
        energy_kcal: Number(newEnergy),
        protein_g: Number(newProtein),
        fat_g: Number(newFat),
        carb_g: Number(newCarb),
      });
      alert('Goals updated!');
    } else {
      alert('Goal update cancelled or invalid input');
    }
  };

  return (
    <>
        <div className="navbar border-2 border-white/10 hover:bg-gray-800/40 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/about">About Us</Link></li>
                </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link className="btn btn-ghost text-xl" to="/dashboard">Macrology</Link>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
                    <li><button onClick={handleGoal}>Set Your Goal</button></li>
                    <li><button onClick={handleClear}>Clear Everything</button></li>
                    <li><Link to='/login'>Log Out</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar
