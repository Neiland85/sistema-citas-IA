import React, { useState } from 'react';

const CitaForm = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
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
        placeholder="Fecha"
        required
      />
      <input
        type="text"
        value={hour}
        onChange={(e) => setHour(e.target.value)}
        placeholder="Hora"
        required
      />
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Motivo"
      />
      <button type="submit">Agendar Cita</button>
    </form>
  );
};

export default CitaForm;
