import './App.css'
import HomePage from './components/Home/HomePage'
import {BrowserRouter, Routes, Route} from 'react-router-dom'  
import ClubProfile from './components/clubs/ClubProfile'
import ClubMessaging from './components/messanger/ClubMessaging'
import LoginPage from './components/access/login/LoginPage'
import RegistrationPage from './components/access/register/RegistrationPage'
import ClubApplicationForm from './components/applications/ClubApplicationForm'
import ClubAdminDashboard from './components/admin/ClubAdminDashboard'
import CreateNewClub from './components/clubs/CreateNewClub'
import ClubDetails from './components/clubs/ClubDetails'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './ErrorBoundary';

function App() {
  function ErrorFallback({ error }) {
    return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre style={{ color: 'red' }}>{error.message}</pre>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          
          <Route path='/' element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
          <Route path='/register' element={<RegistrationPage />} />
          <Route path='/login' element={<LoginPage />} />
          
          {/* Club Routes */}
          <Route path="/clubProfile/:clubId" element={<ErrorBoundary><ClubProfile /></ErrorBoundary>} />
          <Route path="/clubs/:clubId/admin" element={<ClubAdminDashboard />} />
          <Route path="/messages" element={<ClubMessaging />} />
          <Route path="/joinClub" element={<ClubApplicationForm />} />
          <Route path='/create-club' element={<CreateNewClub />} />
          
          {/* Removed duplicate route */}
          {/* <Route path="/" element={<RegistrationPage />}></Route> */}
          {/* <Route path="/clubProfile" element={<ClubProfile/>}></Route> */}
          
          {/* Removed hardcoded club prop */}
          {/* <Route path='/admin-dashboard' element={<ClubAdminDashboard club={{
            name: "Tech Club",
            description: "Club description here",
            categories: ["Technology", "Programming"]
          }}/>} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;