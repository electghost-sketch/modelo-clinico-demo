window.MODELO_DATA = {
  stats: [
    { value: 20, label: 'Líderes referentes', accent: '#ebc6cd' },
    { value: 51, label: 'Administrativos', accent: '#c8dff4' },
    { value: 72, label: 'Académicos', accent: '#ddd8f2' },
    { value: 67, label: 'Estudiantes 5°', accent: '#bfe4d6' },
    { value: 56, label: 'Estudiantes 4°', accent: '#c8e4ee' },
    { value: 59, label: 'Estudiantes 3°', accent: '#f2d0b6' },
    { value: 64, label: 'Estudiantes especialidad', accent: '#c3eadb' }
  ],
  agenda: [
    {
      day: 'Lunes', date: '10 agosto', place: 'Auditorio',
      items: [
        { time: '08:30', title: 'Acreditación de participantes', detail: 'Ingreso y entrega de información inicial.', badge: 'General' },
        { time: '10:00', title: 'Bienvenida e inducción', detail: 'Presentación general del Modelo Clínico.', badge: 'General' },
        { time: '12:00', title: 'Organización por grupos', detail: 'Revisión de roles, salas y responsables.', badge: 'Grupos' }
      ]
    },
    {
      day: 'Martes', date: '11 agosto', place: 'Sala Postgrado',
      items: [
        { time: '08:30', title: 'Talleres de roles y funciones', detail: 'Trabajo guiado por estamento.', badge: 'Taller' },
        { time: '10:30', title: 'Coordinación por grupos', detail: 'Resolución de dudas y distribución operativa.', badge: 'Grupos' },
        { time: '12:30', title: 'Síntesis del bloque', detail: 'Cierre y acuerdos principales.', badge: 'Cierre' }
      ]
    },
    {
      day: 'Miércoles', date: '12 agosto', place: 'Sala HU Friedy',
      items: [
        { time: '08:30', title: 'Actividades clínicas guiadas', detail: 'Participan grupos 1 y 2.', badge: 'Clínica' },
        { time: '10:30', title: 'Actividades clínicas guiadas', detail: 'Participan grupos 3 y 4.', badge: 'Clínica' },
        { time: '12:30', title: 'Retroalimentación', detail: 'Comentarios y ajustes de funcionamiento.', badge: 'Feedback' }
      ]
    },
    {
      day: 'Jueves', date: '13 agosto', place: 'Sala HU Friedy',
      items: [
        { time: '08:30', title: 'Actividades clínicas guiadas', detail: 'Participan grupos 5 y 6.', badge: 'Clínica' },
        { time: '10:30', title: 'Integración de aprendizajes', detail: 'Puesta en común entre estamentos.', badge: 'Integración' },
        { time: '12:30', title: 'Preparación de cierre', detail: 'Indicaciones para la jornada final.', badge: 'Cierre' }
      ]
    },
    {
      day: 'Viernes', date: '14 agosto', place: 'Auditorio',
      items: [
        { time: '08:30', title: 'Integración y puesta en común', detail: 'Síntesis de aprendizajes y acuerdos.', badge: 'General' },
        { time: '10:30', title: 'Ceremonia hito', detail: 'Actividad de cierre de la habilitación.', badge: 'Hito' },
        { time: '12:00', title: 'Cierre final', detail: 'Conclusiones y próximos pasos.', badge: 'Cierre' }
      ]
    }
  ],
  people: [
    { name:'Andrea Muñoz', category:'Líder referente', group:'Grupo A', day:'Lunes 10', time:'10:00', room:'Auditorio', activity:'Bienvenida e inducción general' },
    { name:'Carlos Rojas', category:'Académico', group:'Grupo B', day:'Martes 11', time:'08:30', room:'Sala Postgrado', activity:'Taller de roles y funciones' },
    { name:'Fernanda Soto', category:'Estudiante 5°', group:'Grupo C', day:'Miércoles 12', time:'08:30', room:'Sala HU Friedy', activity:'Actividad clínica guiada' },
    { name:'Tomás Pérez', category:'Administrativo', group:'Apoyo', day:'Lunes 10', time:'08:30', room:'Auditorio', activity:'Acreditación de participantes' },
    { name:'Javiera Morales', category:'Estudiante 4°', group:'Grupo D', day:'Miércoles 12', time:'10:30', room:'Sala HU Friedy', activity:'Actividad clínica guiada' },
    { name:'Matías Vera', category:'Estudiante 3°', group:'Grupo E', day:'Jueves 13', time:'08:30', room:'Sala HU Friedy', activity:'Actividad clínica guiada' },
    { name:'Daniela Fuentes', category:'Especialidad', group:'Grupo F', day:'Jueves 13', time:'10:30', room:'Sala Postgrado', activity:'Integración de aprendizajes' },
    { name:'Pablo Salinas', category:'Académico', group:'Grupo A', day:'Viernes 14', time:'10:30', room:'Auditorio', activity:'Ceremonia hito' },
    { name:'Camila Araya', category:'Estudiante 5°', group:'Grupo B', day:'Martes 11', time:'10:30', room:'Sala Postgrado', activity:'Coordinación por grupos' },
    { name:'Sebastián López', category:'Líder referente', group:'Grupo C', day:'Viernes 14', time:'08:30', room:'Auditorio', activity:'Integración y puesta en común' },
    { name:'Constanza Díaz', category:'Estudiante 4°', group:'Grupo D', day:'Jueves 13', time:'08:30', room:'Sala HU Friedy', activity:'Actividad clínica guiada' },
    { name:'Nicolás Herrera', category:'Administrativo', group:'Apoyo', day:'Viernes 14', time:'12:00', room:'Auditorio', activity:'Cierre final' }
  ]
};
