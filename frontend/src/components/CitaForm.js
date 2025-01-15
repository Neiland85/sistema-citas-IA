import React, { useState } from 'react';

const CitaForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    hora: '',
    motivo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar la información a tu API de backend
    console.log('Cita registrada:', formData);
    // Limpiar el formulario después de enviar los datos
    setFormData({
      nombre: '',
      fecha: '',
      hora: '',
      motivo: '',
    });
  };

  return (
    <div>
      <h2>Agendar Cita</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="fecha">Fecha:</label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="hora">Hora:</label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="motivo">Motivo (opcional):</label>
          <textarea
            id="motivo"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Agendar Cita</button>
      </form>
    </div>
  );
};

export default CitaForm;
