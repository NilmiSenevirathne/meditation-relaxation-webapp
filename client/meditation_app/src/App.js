import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Landing from './components/LandingPage/Landing';
import Login from '../src/components/Login/Login';



function App() {
  return (
    <div>
       <BrowserRouter>
          <Routes>
             <Route path = '/' element={<Landing/>}></Route>
             <Route path = '/login' element={<Login/>}></Route>

          </Routes>
       
       </BrowserRouter>

    </div>
  );
}

export default App;
