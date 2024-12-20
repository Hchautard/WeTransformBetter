# BONNE PRATIQUES DE DEVELOPPEMENT
## 1. Introduction
Ce document a pour but de définir les bonnes pratiques de développement à suivre lors de la réalisation d'un projet informatique. Ces bonnes pratiques sont basées sur les standards de développement web et mobile. Elles sont destinées à garantir la qualité du code, la maintenabilité du projet et la collaboration entre les développeurs.
## 2. Organisation du projet
### 2.1. Structure du projet
La structure du projet doit être organisée de manière à ce que les fichiers soient faciles à retrouver. Il est recommandé de suivre une structure de projet standard. Voici un exemple de structure de projet pour une application web :
```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    components/
      Header.js
      Footer.js
    pages/
      Home.js
      About.js
    App.css
    App.js
    index.css
    index.js
```
### 2.2. Nommage des fichiers
Les fichiers doivent être nommés de manière à ce qu'ils soient faciles à retrouver. Il est recommandé de suivre une convention de nommage standard. Voici un exemple de convention de nommage pour les fichiers d'une application web :
- Les noms de fichiers doivent être en minuscules.
- Les noms de fichiers doivent être en anglais.
- Les noms de fichiers doivent être descriptifs.
- Les noms de fichiers doivent être séparés par des tirets bas.
- Les noms de fichiers doivent avoir une extension correspondant à leur type (par exemple, .js pour les fichiers JavaScript, .css pour les fichiers CSS, .html pour les fichiers HTML).
- Les noms de fichiers doivent être courts et concis.
## 3. Manipulation git
### 3.1. Branches
Il est recommandé de travailler sur des branches séparées pour chaque fonctionnalité ou tâche. Cela permet de séparer le code en fonctionnalités distinctes et de faciliter la collaboration entre les développeurs. Voici un exemple de convention de nommage pour les branches d'un projet :
- Les noms de branches doivent être en minuscules.
- Les noms de branches doivent être en anglais.
- Les noms de branches doivent être descriptifs.
### 3.2. Commits
Il est recommandé de faire des commits réguliers et de les commenter de manière à ce qu'ils soient faciles à comprendre. 
Pour chaque commit, il est recommandé de suivre les règles suivantes :
- Le message de commit doit être en anglais.
- Le message de commit doit être descriptif.
- Le message de commit doit commencer par une majuscule.
- Pour faire un commit, il faut **créer une branch** et **push** les modifications sur cette branche.


# REACT INITIAL DOCUMENTATION
## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
