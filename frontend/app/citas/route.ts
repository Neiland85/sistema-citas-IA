import { NextResponse } from 'next/server';

let citas = [];

function clasificarCita(motivo) {
  const palabrasUrgentes = ['emergencia', 'urgente', 'grave', 'inmediato'];
  return palabrasUrgentes.some((palabra) =>
    motivo.toLowerCase().includes(palabra),
  )
    ? 'urgente'
    : 'no urgente';
}

export async function GET() {
  return NextResponse.json(citas);
}

export async function POST(request: Request) {
  const data = await request.json();
  const nuevaCita = {
    id: citas.length + 1,
    ...data,
    clasificacion: clasificarCita(data.motivo),
  };
  citas.push(nuevaCita);
  return NextResponse.json(nuevaCita, { status: 201 });
}
