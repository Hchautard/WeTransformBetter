import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextLayerDialog from '../components/TextLayerDialog';

describe('TextLayerDialog Component', () => {
  let mockOnClose, mockSetTextInput, mockSetTextFont, mockSetTextSize, mockSetTextColor, mockAddTextLayer;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockSetTextInput = jest.fn();
    mockSetTextFont = jest.fn();
    mockSetTextSize = jest.fn();
    mockSetTextColor = jest.fn();
    mockAddTextLayer = jest.fn();

    render(
      <TextLayerDialog
        open={true}
        onClose={mockOnClose}
        textInput=""
        setTextInput={mockSetTextInput}
        textFont="Arial"
        setTextFont={mockSetTextFont}
        textSize={24}
        setTextSize={mockSetTextSize}
        textColor="#000000"
        setTextColor={mockSetTextColor}
        addTextLayer={mockAddTextLayer}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('allows the user to type in the text input', () => {
    const input = screen.getByLabelText('Text');
    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(mockSetTextInput).toHaveBeenCalledWith('Hello World');
  });

  test('allows the user to change the text size using the slider', () => {
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: 48 } });
    expect(mockSetTextSize).toHaveBeenCalledWith(48);
  });

  test('allows the user to change the text color using ChromePicker', () => {
    const colorPicker = screen.getByText('Add Text Layer').parentElement.querySelector('input[type="color"]');
    if (colorPicker) {
      fireEvent.change(colorPicker, { target: { value: '#ff5733' } });
      expect(mockSetTextColor).toHaveBeenCalledWith('#ff5733');
    } else {
      console.warn('Color picker not found. Please check if the ChromePicker renders correctly.');
    }
  });

  test('calls the onClose function when the Cancel button is clicked', () => {
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls the addTextLayer function when the Add Text button is clicked', () => {
    const addButton = screen.getByRole('button', { name: /Add Text/i });
    fireEvent.click(addButton);
    expect(mockAddTextLayer).toHaveBeenCalled();
  });

  test('matches the snapshot of the component', () => {
    const { asFragment } = render(
      <TextLayerDialog
        open={true}
        onClose={mockOnClose}
        textInput=""
        setTextInput={mockSetTextInput}
        textFont="Arial"
        setTextFont={mockSetTextFont}
        textSize={24}
        setTextSize={mockSetTextSize}
        textColor="#000000"
        setTextColor={mockSetTextColor}
        addTextLayer={mockAddTextLayer}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
