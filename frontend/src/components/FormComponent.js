import React, { useState } from 'react';

function FormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    reason: '',
    priority: 'normal',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/citas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert('Error al agendar la cita');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Nombre" onChange={handleChange} required />
      <input type="date" name="date" onChange={handleChange} required />
      <input type="time" name="time" onChange={handleChange} required />
      <input type="text" name="reason" placeholder="Motivo (opcional)" onChange={handleChange} />
      <select name="priority" onChange={handleChange}>
        <option value="normal">Normal</option>
        <option value="urgente">Urgente</option>
      </select>
      <button type="submit">Agendar Cita</button>
    </form>
  );
}

export default FormComponent;

