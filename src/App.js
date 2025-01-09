import logo from './logo.svg';
import './App.css';
import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import AppRoutes from './Routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBarComponent from './Components/NavigationBar';

function App() {
  return (
    <div>
      <AppRoutes/>
      <ToastContainer />
    </div>
  );
}

export default App;
