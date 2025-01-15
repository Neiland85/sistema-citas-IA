import React, { useState } from 'react';

const CitaForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const citaData = { name, date, hour, reason };

    fetch('http://localhost:5000/api/citas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(citaData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Cita agendada:', data);
        // Aquí puedes mostrar un mensaje de éxito o redirigir a otro lugar
        alert('Cita agendada correctamente!');
      })
      .catch((error) => {
        console.error('Error al crear cita:', error);
        alert('Error al agendar cita. Intenta nuevamente.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        required
      />
      <input
        type="text"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        placeholder="Fecha (dd/mm/yyyy)"
        required
      />
      <input
        type="text"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        placeholder="Hora (hh:mm)"
        required
      />
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motivo (opcional)"
      />
      <button type="submit">Agendar Cita</button>
    </form>
  );
};

export default CitaForm;
