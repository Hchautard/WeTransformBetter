import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import '../App.css';
import ResponsiveAppBar from './appBar';
import Footer from './footer';
import Footer2 from './footer2';

function Home() {
  return (
    <>
    <ResponsiveAppBar />
    <div className="App">
      <header className="App-header"></header>
      <div className="home-body">
        <img src={'/img/orange_flowers.jpg'} alt="green leafs" className="side-image" />
        <div className="introduction">
          <h1>Bienvenue sur WeTransformBetter</h1>
          <p>
            WeTransformBetter est une application web innovante qui vous permet de modifier, retoucher, et améliorer vos images en quelques clics. 
            Que vous soyez un amateur de photographie, un designer graphique, ou un utilisateur qui souhaite simplement améliorer ses photos, 
            WeTransformBetter est conçu pour répondre à vos besoins de manière rapide et intuitive.
          </p>
          <p>
            Grâce à notre interface conviviale, vous pouvez accéder à une large gamme d'outils de retouche d'image, y compris le recadrage, 
            la modification de couleurs, l'ajout de filtres artistiques, et bien plus encore. Notre application offre également des fonctionnalités avancées 
            pour les utilisateurs qui souhaitent appliquer des transformations plus complexes, comme l'ajustement des contrastes, 
            la correction des imperfections, et l'amélioration de la résolution.
          </p>
          <p>
            Avec <strong>WeTransformBetter</strong>, transformer vos images n'a jamais été aussi simple et amusant ! 
            Découvrez comment nous transformons l'édition d'image pour la rendre accessible à tous.
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Home;
