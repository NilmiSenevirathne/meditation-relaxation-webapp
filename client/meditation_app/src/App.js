import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Landing from './components/LandingPage/Landing';
import Login from '../src/components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import  Dashboard  from './components/Dashboard/Dashboard';
import SessionPlayer from './components/Sessions/SessionPlayer';



function App() {
  return (
    <div>
       <BrowserRouter>
          <Routes>
             <Route path = '/' element={<Landing/>}></Route>
             <Route path = '/login' element={<Login/>}></Route>
             <Route path='/signup' element={<SignUp/>}></Route>
             <Route path='/dashboard' element={<Dashboard/>}></Route>
             <Route path="/session/:sessionId" element={<SessionPlayer />} />

          </Routes>
       
       </BrowserRouter>

    </div>
  );
}

export default App;
