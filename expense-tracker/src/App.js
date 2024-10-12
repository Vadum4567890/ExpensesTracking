import './App.css';
import AppRoutes from './Routes/AppRoutes';
import Navbar from './components/Navbar';

// Main component
const App = () => {
  return(
    <>
      <Navbar/>
      <AppRoutes/>
    </>
  )
}

export default App;
