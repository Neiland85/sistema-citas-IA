import React from 'react';
import PropTypes from 'prop-types';

const CitasTable = ({ citas }) => {
  if (citas.length === 0) {
    return (
      <section className="my-8">
        <h2 className="text-2xl font-bold mb-4">Citas Programadas</h2>
        <p className="text-center">No hay citas programadas en este momento.</p>
      </section>
    );
  }

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Citas Programadas</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Hora</th>
              <th className="px-4 py-2">Motivo</th>
              <th className="px-4 py-2">Clasificación</th>
            </tr>
          </thead>
          <tbody>
            {citas.map((cita) => (
              <tr key={cita.id} className="border-b">
                <td className="px-4 py-2">{cita.nombre}</td>
                <td className="px-4 py-2">{cita.fecha}</td>
                <td className="px-4 py-2">{cita.hora}</td>
                <td className="px-4 py-2">{cita.motivo}</td>
                <td className="px-4 py-2">{cita.clasificacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
CitasTable.propTypes = {
  citas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      fecha: PropTypes.string.isRequired,
      hora: PropTypes.string.isRequired,
      motivo: PropTypes.string.isRequired,
      clasificacion: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CitasTable;
