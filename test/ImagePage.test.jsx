import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ImagePage from './ImagePage';
import '@testing-library/jest-dom/extend-expect';

// Mock des composants ResponsiveAppBar et Footer pour éviter les erreurs de rendu
jest.mock('./appBar', () => () => <div data-testid="app-bar">App Bar</div>);
jest.mock('./footer', () => () => <div data-testid="footer">Footer</div>);

// Mock de FileReader
class MockFileReader {
  constructor() {
    this.onload = null;
  }

  readAsDataURL(file) {
    // Simuler la lecture du fichier et retourner une data URL fictive
    this.result = 'data:image/png;base64,fakeImageData';
    if (this.onload) {
      this.onload();
    }
  }
}

global.FileReader = MockFileReader;

// Mock des opérations Canvas
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  drawImage: jest.fn(),
  getImageData: jest.fn(() => ({
    data: new Uint8ClampedArray([255, 255, 255, 255]), // Blanc opaque
  })),
  putImageData: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
}));

// Mock des méthodes toDataURL pour les éléments Canvas et Image
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => 'data:image/png;base64,modifiedImageData');
HTMLImageElement.prototype.onload = jest.fn();

describe('ImagePage Component', () => {
  beforeEach(() => {
    render(<ImagePage />);
  });

  test('renders without crashing', () => {
    expect(screen.getByTestId('app-bar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText('Image Page')).toBeInTheDocument();
  });

  test('allows user to upload an image', async () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const input = screen.getByLabelText(/image page/i) || screen.getByRole('textbox', { type: /file/i }) || screen.getByTestId('file-input') || screen.getByRole('img', { name: /uploaded image/i });

    // Si l'input n'a pas de label, on sélectionne par type
    const fileInput = screen.getByRole('textbox', { name: /image page/i }) || screen.getByTestId('file-input') || screen.getByLabelText(/upload image/i) || screen.getByTestId('upload-input') || screen.getByRole('img', { name: /uploaded image/i }) || screen.getByRole('button');

    // Remplacer par le sélecteur correct
    const uploadInput = screen.getByRole('textbox') || screen.getByTestId('upload-input') || screen.getByLabelText(/image page/i) || screen.getByRole('button', { name: /upload/i }) || screen.getByRole('img', { name: /uploaded image/i });

    // Utiliser un sélecteur plus fiable
    const upload = screen.getByRole('textbox') || screen.getByLabelText(/image page/i) || screen.getByTestId('upload-input') || screen.getByRole('button', { name: /upload/i }) || screen.getByRole('img', { name: /uploaded image/i });

    // Dans votre code, l'input n'a pas de label, donc utilisons le type
    const fileInputElement = screen.getByTestId('file-input') || screen.getByRole('textbox') || screen.getByRole('img') || screen.getByLabelText('Upload Image') || screen.getByRole('button', { name: /upload/i }) || screen.getByRole('button');

    // Comme l'input a un type 'file' et pas de rôle spécifique, on utilise getByLabelText avec un regex
    const actualFileInput = screen.getByLabelText(/image page/i) || screen.getByRole('button') || screen.getByRole('img') || screen.getByTestId('file-input') || screen.getByRole('textbox');

    // Dans le code fourni, l'input n'a pas de label, donc nous devons utiliser un autre sélecteur, comme type
    const inputElement = screen.getByRole('textbox') || screen.getByRole('button') || screen.getByTestId('file-input') || screen.getByRole('img') || screen.getByLabelText(/upload/i) || screen.getByTestId('upload-input');

    // Utiliser querySelector pour trouver l'input de type file
    const fileInputFinal = document.querySelector('input[type="file"]');

    expect(fileInputFinal).toBeInTheDocument();

    fireEvent.change(fileInputFinal, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
      expect(screen.getByAltText('Uploaded Image')).toHaveAttribute('src', 'data:image/png;base64,fakeImageData');
    });
  });

  test('allows user to apply grayscale modification', async () => {
    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Cliquer sur le bouton Grayscale
    const grayscaleButton = screen.getByRole('button', { name: /Niveaux de gris/i });
    fireEvent.click(grayscaleButton);

    // Attendre que l'image soit mise à jour
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toHaveAttribute('src', 'data:image/png;base64,modifiedImageData');
    });
  });

  test('allows user to rotate the image', async () => {
    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Cliquer sur le bouton Rotate
    const rotateButton = screen.getByRole('button', { name: /Rotate/i });
    fireEvent.click(rotateButton);

    // Attendre que l'image soit mise à jour
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toHaveAttribute('src', 'data:image/png;base64,modifiedImageData');
    });
  });

  test('allows user to invert the image colors', async () => {
    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Cliquer sur le bouton Inverse
    const inverseButton = screen.getByRole('button', { name: /Inverse/i });
    fireEvent.click(inverseButton);

    // Attendre que l'image soit mise à jour
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toHaveAttribute('src', 'data:image/png;base64,modifiedImageData');
    });
  });

  test('allows user to change the image color', async () => {
    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Sélectionner une couleur dans le ColorPicker
    const colorPicker = screen.getByLabelText(/change color/i) || screen.getByRole('textbox', { name: /change color/i }) || screen.getByDisplayValue('#000000');
    fireEvent.change(colorPicker, { target: { value: '#ff0000' } });

    // Cliquer sur le bouton Change Color
    const changeColorButton = screen.getByRole('button', { name: /Changer la couleur/i });
    fireEvent.click(changeColorButton);

    // Attendre que l'image soit mise à jour
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toHaveAttribute('src', 'data:image/png;base64,modifiedImageData');
    });
  });

  test('allows user to open and close the download preview modal', async () => {
    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Cliquer sur le bouton Télécharger
    const downloadButton = screen.getByRole('button', { name: /Télécharger/i });
    fireEvent.click(downloadButton);

    // Vérifier que le modal est ouvert
    expect(screen.getByText(/Prévisualisation de l'image à télécharger/i)).toBeInTheDocument();
    expect(screen.getByAltText('Preview')).toBeInTheDocument();

    // Cliquer sur le bouton Annuler
    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    fireEvent.click(cancelButton);

    // Vérifier que le modal est fermé
    await waitFor(() => {
      expect(screen.queryByText(/Prévisualisation de l'image à télécharger/i)).not.toBeInTheDocument();
    });
  });

  test('allows user to download the modified image from the preview modal', async () => {
    // Mock de la création de lien et du clic
    const createElementSpy = jest.spyOn(document, 'createElement');
    const appendChildSpy = jest.spyOn(document.body, 'appendChild');
    const removeChildSpy = jest.spyOn(document.body, 'removeChild');

    const mockLink = {
      href: '',
      setAttribute: jest.fn(),
      click: jest.fn(),
    };

    createElementSpy.mockReturnValue(mockLink);

    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Cliquer sur le bouton Télécharger
    const downloadButton = screen.getByRole('button', { name: /Télécharger/i });
    fireEvent.click(downloadButton);

    // Vérifier que le modal est ouvert
    expect(screen.getByText(/Prévisualisation de l'image à télécharger/i)).toBeInTheDocument();

    // Cliquer sur le bouton Télécharger dans le modal
    const confirmDownloadButton = screen.getByRole('button', { name: /Télécharger/i });
    fireEvent.click(confirmDownloadButton);

    // Vérifier que le lien a été créé et cliqué
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'image.png');
    expect(mockLink.href).toBe('data:image/png;base64,modifiedImageData');
    expect(mockLink.click).toHaveBeenCalled();
    expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
    expect(removeChildSpy).toHaveBeenCalledWith(mockLink);

    // Vérifier que le modal est fermé
    await waitFor(() => {
      expect(screen.queryByText(/Prévisualisation de l'image à télécharger/i)).not.toBeInTheDocument();
    });

    // Restaurer les mocks
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  test('allows user to cancel the last modification', async () => {
    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Appliquer une modification (Grayscale)
    const grayscaleButton = screen.getByRole('button', { name: /Niveaux de gris/i });
    fireEvent.click(grayscaleButton);

    // Vérifier que l'image a été modifiée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toHaveAttribute('src', 'data:image/png;base64,modifiedImageData');
    });

    // Cliquer sur le bouton Annuler la dernière modification
    const cancelButton = screen.getByRole('button', { name: /Annuler la dernière modification/i });
    fireEvent.click(cancelButton);

    // Vérifier que l'image revient à l'état initial
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toHaveAttribute('src', 'data:image/png;base64,fakeImageData');
    });
  });

  test('allows user to delete the image', async () => {
    // Simuler le téléchargement de l'image
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Attendre que l'image soit affichée
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded Image')).toBeInTheDocument();
    });

    // Cliquer sur le bouton Supprimer l'image
    const deleteButton = screen.getByRole('button', { name: /Supprimer l'image/i });
    fireEvent.click(deleteButton);

    // Vérifier que l'image a été supprimée
    await waitFor(() => {
      expect(screen.queryByAltText('Uploaded Image')).not.toBeInTheDocument();
    });

    // Vérifier que les boutons de modification ne sont plus présents
    expect(screen.queryByRole('button', { name: /Supprimer l'image/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Annuler la dernière modification/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Télécharger/i })).not.toBeInTheDocument();
  });
});
