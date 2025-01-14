import React, { useState } from 'react';
import axios from 'axios';

const CitaForm = () => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un objeto con los datos del formulario
    const cita = {
      nombre,
      fecha,
      hora,
      motivo,
    };

    try {
      // Enviar los datos al backend con una solicitud POST
      const response = await axios.post(
        'http://localhost:5000/api/citas',
        cita
      );

      // Ver respuesta del backend
      console.log('Cita creada:', response.data);

      // Mostrar mensaje de éxito
      alert('Cita creada con éxito');

      // Limpiar el formulario
      setNombre('');
      setFecha('');
      setHora('');
      setMotivo('');
    } catch (error) {
      console.error('Hubo un error al crear la cita:', error);
      alert('Error al crear la cita');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Hora:</label>
        <input
          type="time"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Motivo (opcional):</label>
        <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} />
      </div>
      <button type="submit">Agendar Cita</button>
    </form>
  );
};

export default CitaForm;
