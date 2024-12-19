import './App.css';
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ImagePage from './components/ImagePage';
import ConditionsGenerales from './components/cgu';  


function App() {
  return (
   <body>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/conditions" element={<ConditionsGenerales />} />
      </Routes>
      </Router>
   </body>
  );
}

export default App;
