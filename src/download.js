import React from 'react';

const DownloadButton = () => {
  const download = async (e) => {
    e.preventDefault(); // Empêche le comportement par défaut
    const url = e.target.dataset.href; // Récupère l'URL depuis l'attribut data

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('La réponse du réseau n\'est pas correcte');
      }

      const buffer = await response.arrayBuffer();
      const blob = new Blob([buffer]);
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.setAttribute("download", "image.png");
      document.body.appendChild(link);
      link.click();

      // Nettoie l'URL de l'objet
      window.URL.revokeObjectURL(objectUrl);
      link.remove(); // Retire le lien du DOM
    } catch (error) {
      console.error('Le téléchargement a échoué :', error);
    }
  };

  return (
    <div className="App">
      <button onClick={download} data-href="https://upload.wikimedia.org/wikipedia/en/6/6b/Hello_Web_Series_%28Wordmark%29_Logo.png">
        <i className="fa fa-download" />
        Télécharger
      </button>
    </div>
  );
};

export default DownloadButton;
