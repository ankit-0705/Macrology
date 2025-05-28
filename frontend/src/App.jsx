import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


import LoginPage from './routes/Login';
import RegisterPage from './routes/Register'
import Dashboard from './routes/Dashboard'
import ProfilePage from './routes/Profile'
import AboutPage from './routes/About'
import MacroState from './context/MacroState'

function App() {

  return (
    <>
    <MacroState>
      <Router>
        <Routes>
          <Route exact path='/' element={<RegisterPage/>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/about' element={<AboutPage/>}/>
        </Routes>
      </Router>
    </MacroState>
    </>
  )
}

export default App
