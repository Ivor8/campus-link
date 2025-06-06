import './App.css'
import HomePage from './components/Home/HomePage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'  
import ClubProfile from './components/clubs/ClubProfile'
import ClubMessaging from './components/messanger/ClubMessaging'
import LoginPage from './components/access/login/LoginPage '
import RegistrationPage from './components/access/register/RegistrationPage '
import ClubApplicationForm from './components/applications/ClubApplicationForm'
import ClubAdminDashboard from './components/admin/ClubAdminDashboard'
import CreateNewClub from './components/clubs/create-club/CreateNewClub'


function App() {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<HomePage />} ></Route>
      <Route path='/register' element={<RegistrationPage />}></Route>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path="/" element={<RegistrationPage />}></Route>
      <Route path="/clubProfile" element={<ClubProfile/>}></Route>
      <Route path="/messages" element={<ClubMessaging />} ></Route>
      <Route path="/joinClub" element={<ClubApplicationForm />}></Route>
      <Route path='/create-club' element={<CreateNewClub />}></Route>
      <Route path='/admin-dashboard' element={<ClubAdminDashboard  club={{
        name: "Tech Club",
        description: "Club description here",
        categories: ["Technology", "Programming"]
      }}/>}>

        </Route>
    </Routes>
    </BrowserRouter>
    </>
  )
}
export default App
