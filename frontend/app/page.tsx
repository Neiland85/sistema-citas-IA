'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CitaForm from '../components/CitaForm';
import CitasTable from '../components/CitasTable';

export default function Home() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCitas();
  }, []);

  const fetchCitas = async () => {
    try {
      const response = await fetch('/api/citas');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      console.error('Error al obtener citas:', error);
      setError(
        'No se pudieron cargar las citas. Por favor, intente más tarde.',
      );
    }
  };

  const handleCitaAdded = (nuevaCita) => {
    setCitas((prevCitas) => [...prevCitas, nuevaCita]);
  };

  return (
    <main className="container mx-auto px-4">
      <Header />
      <CitaForm onCitaAdded={handleCitaAdded} />
      {error && <p className="text-red-500 text-center my-4">{error}</p>}
      <CitasTable citas={citas} />
    </main>
  );
}
