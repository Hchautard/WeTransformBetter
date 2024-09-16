import './App.css';
import Home from './home';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
   <body>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      </Router>
   </body>
  );
}

export default App;
