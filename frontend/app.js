document.addEventListener('DOMContentLoaded', () => {
    const citaForm = document.getElementById('cita-form');
    const citasTable = document.getElementById('citas-table').getElementsByTagName('tbody')[0];

    citaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const motivo = document.getElementById('motivo').value;

        const newRow = citasTable.insertRow();
        newRow.innerHTML = `
            <td>${nombre}</td>
            <td>${fecha}</td>
            <td>${hora}</td>
            <td>${motivo}</td>
        `;

        citaForm.reset();
    });
});


