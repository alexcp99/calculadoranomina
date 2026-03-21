// ─── Convenios Colectivos — datos oficiales 2026 ───────────────────────────────
// salarioBase = salario mínimo mensual bruto según convenio (en 14 pagas)

export interface ConvenioCategoria {
  id: string;
  nombre: string;
  salarioBase: number; // mensual bruto, base × 14 = anual
}

export interface Convenio {
  id: string;
  nombre: string;
  icono: string;
  trabajadores: string;
  categorias: ConvenioCategoria[];
}

export const CONVENIOS: Convenio[] = [
  {
    id: "hosteleria",
    nombre: "Hostelería",
    icono: "🍽️",
    trabajadores: "1.500.000",
    categorias: [
      { id: "jefe-cocina",        nombre: "Jefe/a de Cocina",          salarioBase: 1487 },
      { id: "cocinero",           nombre: "Cocinero/a",                 salarioBase: 1387 },
      { id: "camarero",           nombre: "Camarero/a",                 salarioBase: 1298 },
      { id: "ayudante-camarero",  nombre: "Ayudante Camarero/a",        salarioBase: 1260 },
      { id: "recepcionista",      nombre: "Recepcionista Hotel",         salarioBase: 1380 },
      { id: "gobernanta",         nombre: "Gobernanta",                  salarioBase: 1420 },
      { id: "limpieza-hotel",     nombre: "Limpieza/Habitaciones",       salarioBase: 1240 },
    ],
  },
  {
    id: "comercio",
    nombre: "Comercio",
    icono: "🛒",
    trabajadores: "1.200.000",
    categorias: [
      { id: "encargado-tienda",   nombre: "Encargado/a de Tienda",      salarioBase: 1650 },
      { id: "dependiente",        nombre: "Dependiente/a",               salarioBase: 1350 },
      { id: "cajero",             nombre: "Cajero/a",                    salarioBase: 1298 },
      { id: "reponedor",          nombre: "Reponedor/a",                 salarioBase: 1260 },
      { id: "jefe-seccion",       nombre: "Jefe/a de Sección",           salarioBase: 1520 },
    ],
  },
  {
    id: "construccion",
    nombre: "Construcción",
    icono: "🏗️",
    trabajadores: "1.000.000",
    categorias: [
      { id: "jefe-obra",          nombre: "Jefe/a de Obra",             salarioBase: 2100 },
      { id: "encargado-obra",     nombre: "Encargado/a de Obra",         salarioBase: 1780 },
      { id: "oficial-primera",    nombre: "Oficial de Primera",          salarioBase: 1580 },
      { id: "oficial-segunda",    nombre: "Oficial de Segunda",          salarioBase: 1480 },
      { id: "peon",               nombre: "Peón",                        salarioBase: 1320 },
    ],
  },
  {
    id: "metal",
    nombre: "Metal e Industria",
    icono: "⚙️",
    trabajadores: "900.000",
    categorias: [
      { id: "ingeniero",             nombre: "Ingeniero/a",              salarioBase: 2400 },
      { id: "tecnico",               nombre: "Técnico/a Especialista",   salarioBase: 1850 },
      { id: "oficial-primera-metal", nombre: "Oficial de Primera",       salarioBase: 1620 },
      { id: "oficial-segunda-metal", nombre: "Oficial de Segunda",       salarioBase: 1520 },
      { id: "operario",              nombre: "Operario/a",               salarioBase: 1380 },
    ],
  },
  {
    id: "limpieza",
    nombre: "Limpieza de Edificios",
    icono: "🧹",
    trabajadores: "400.000",
    categorias: [
      { id: "jefe-equipo-limpieza",    nombre: "Jefe/a de Equipo",       salarioBase: 1420 },
      { id: "especialista-limpieza",   nombre: "Especialista",            salarioBase: 1290 },
      { id: "limpiador",               nombre: "Limpiador/a",             salarioBase: 1240 },
      { id: "cristalero",              nombre: "Cristalero/a",            salarioBase: 1310 },
    ],
  },
  {
    id: "transporte",
    nombre: "Transporte y Logística",
    icono: "🚛",
    trabajadores: "350.000",
    categorias: [
      { id: "jefe-trafico",       nombre: "Jefe/a de Tráfico",          salarioBase: 1980 },
      { id: "conductor-trailer",  nombre: "Conductor/a Tráiler",         salarioBase: 1650 },
      { id: "conductor-rigido",   nombre: "Conductor/a Rígido",          salarioBase: 1520 },
      { id: "repartidor",         nombre: "Repartidor/a",                salarioBase: 1380 },
      { id: "mozo-almacen",       nombre: "Mozo/a de Almacén",           salarioBase: 1298 },
    ],
  },
  {
    id: "sanidad-privada",
    nombre: "Sanidad Privada",
    icono: "🏥",
    trabajadores: "300.000",
    categorias: [
      { id: "medico",                 nombre: "Médico/a",                salarioBase: 3200 },
      { id: "enfermero",              nombre: "Enfermero/a",              salarioBase: 1980 },
      { id: "tecnico-sanitario",      nombre: "Técnico/a Sanitario",     salarioBase: 1620 },
      { id: "auxiliar-enfermeria",    nombre: "Auxiliar de Enfermería",  salarioBase: 1380 },
      { id: "administrativo-clinica", nombre: "Administrativo/a Clínica",salarioBase: 1350 },
    ],
  },
  {
    id: "oficinas",
    nombre: "Oficinas y Despachos",
    icono: "💼",
    trabajadores: "280.000",
    categorias: [
      { id: "director-oficina",          nombre: "Director/a de Oficina",    salarioBase: 2800 },
      { id: "jefe-seccion-oficina",      nombre: "Jefe/a de Sección",         salarioBase: 2100 },
      { id: "oficial-primera-oficina",   nombre: "Oficial de Primera",        salarioBase: 1650 },
      { id: "oficial-segunda-oficina",   nombre: "Oficial de Segunda",        salarioBase: 1450 },
      { id: "auxiliar-administrativo",   nombre: "Auxiliar Administrativo/a", salarioBase: 1298 },
    ],
  },
];
