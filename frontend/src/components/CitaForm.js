import React, { useState } from 'react';
import PropTypes from 'prop-types';

const CitaForm = ({ onCitaAdded }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    fecha: '',
    hora: '',
    motivo: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      onCitaAdded(data);
      setFormData({
        nombre: '',
        email: '',
        fecha: '',
        hora: '',
        motivo: '',
      });
    } catch (error) {
      console.error('Error al agregar cita:', error);
      setError('No se pudo agregar la cita. Por favor, intente más tarde.');
    }
  };

  return (
    <section id="citas" className="my-8">
      <h2 className="text-2xl font-bold mb-4">Agendar Cita</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="time"
          name="hora"
          value={formData.hora}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          placeholder="Motivo de la cita"
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Agendar Cita
        </button>
      </form>
    </section>
  );
};
CitaForm.propTypes = {
  onCitaAdded: PropTypes.func.isRequired,
};

export default CitaForm;
