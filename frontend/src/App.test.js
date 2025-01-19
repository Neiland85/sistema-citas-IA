import React from 'react';
import {
  render,
  screen,
  fireEvent,
  test,
  expect,
} from '@testing-library/react';
import App from './App';

test('renders CitaForm and handles user input', async () => {
  // Marcamos la función como async
  render(<App />);

  const nameInput = screen.getByPlaceholderText(/Nombre/i);
  const dateInput = screen.getByPlaceholderText(/Fecha/i);
  const hourInput = screen.getByPlaceholderText(/Hora/i);
  const reasonInput = screen.getByPlaceholderText(/Motivo/i);
  const submitButton = screen.getByText(/Agendar Cita/i);

  expect(nameInput).toBeInTheDocument();
  expect(dateInput).toBeInTheDocument();
  expect(hourInput).toBeInTheDocument();
  expect(reasonInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();

  fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
  fireEvent.change(dateInput, { target: { value: '2025-01-15' } });
  fireEvent.change(hourInput, { target: { value: '10:00' } });
  fireEvent.change(reasonInput, { target: { value: 'Consulta general' } });

  fireEvent.click(submitButton);

  // Asegurarse de que el mensaje de éxito aparece
  expect(
    await screen.findByText(/Cita agendada correctamente/i),
  ).toBeInTheDocument();
});
