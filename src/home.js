import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import ResponsiveAppBar from './appBar';
import Footer from './footer';

function Home() {
  return (
    <>
    <ResponsiveAppBar />
    <div className="App">
      <header className="App-header">
  
      </header>
    </div>
    <Footer/>
    </>
  );
}

export default Home;
