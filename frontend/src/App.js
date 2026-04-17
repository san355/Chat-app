import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';


const PrivateRoute = ({ children }) => {
  const userId = localStorage.getItem('trtc_userID');
  return userId ? children : <Navigate to='/login' />
}

function App() {
  return (
    <Router>
      <div className='min-h-screen'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route
            path='/'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
