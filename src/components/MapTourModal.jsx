import React, { useState } from "react";
import "./MapTourModal.css";

// Guías contextuales paso a paso para cada herramienta, con carteles centrados
const toursData = {
  home: [
    {
      title: "1. Bienvenido al Centro Táctico",
      description: "Esta es la pantalla de inicio principal. Desde acá podés acceder de forma directa a las tres herramientas clave para tu equipo competitivo."
    },
    {
      title: "2. Simulador de Draft (Picks & Bans)",
      description: "El núcleo de las rotaciones competitivas. Entremos para ver cómo funciona el armado de composiciones y los tiempos oficiales."
    },
    {
      title: "3. Tablero Táctico (MapBoard)",
      description: "El mapa interactivo de la Grieta del Invocador para planificar rotaciones, objetivos y jugadas visuales en conjunto."
    },
    {
      title: "4. Gestión de Champion Pool",
      description: "El administrador para registrar, filtrar y actualizar los comfort picks y bloqueos prioritarios de tu roster."
    },
    {
      title: "5. ¡Comenzamos el Recorrido!",
      description: "Seleccioná un modo o herramienta para iniciar la guía detallada de sus componentes y funciones clave."
    }
  ],
  draft: [
    {
      title: "1. Interfaz General de Draft",
      description: "Esta guía te acompaña directamente sobre la pantalla de drafteo real para que puedas ver los campeones y la interfaz sin mover los ojos por toda la pantalla."
    },
    {
      title: "2. Formato de Torneo y Bans",
      description: "Acá visualizás las fases de prohibición. El sistema simula la alternancia oficial de torneos competitivos de LoL con sus respectivos baneos y ubicaciones."
    },
    {
      title: "3. Selección de Picks",
      description: "Los espacios donde se confirman las elecciones definitivas de carril, evaluando las sinergias y el balance general de daño de tu equipo."
    },
    {
      title: "4. Sincronización Automática",
      description: "Una vez finalizada la sesión de picks y bans, el sistema guarda el estado actual para trasladarlo sin fricciones al tablero táctico."
    },
    {
      title: "5. ¡Listo para el Mapa Táctico!",
      description: "Al hacer clic en finalizar, saltaremos al mapa táctico. Recordá que allí **podrás arrastrar tus composiciones directamente desde la barra de equipos** hacia el terreno de juego."
    }
  ],
  map: [
    {
      title: "1. El Tablero Táctico y tus Composiciones",
      description: "Ya ubicados en la Grieta del Invocador, este es el espacio donde tus estrategias cobran vida visual sobre el mapa."
    },
    {
      title: "2. Barra Lateral de Equipos",
      description: "Acá encontrás los campeones seleccionados previamente. Recordá que **podés arrastrarlos directamente desde esta barra** hacia cualquier sector del mapa."
    },
    {
      title: "3. Herramientas de Dibujo y Rutas",
      description: "Utilizá el lápiz y los selectores de trazo para marcar rotaciones de jungla, objetivos o líneas de visión de forma limpia y rápida."
    },
    {
      title: "4. ¡Todo Listo!",
      description: "Coordiná con tu equipo, planificá las jugadas maestras y dominá la Grieta con total precisión."
    }
  ],
  pool: [
    {
      title: "1. Banco y Filtros de Campeones",
      description: "Acá encontrás el banco general con todos los campeones disponibles, listos para filtrar por rol o buscar por nombre de forma rápida."
    },
    {
      title: "2. Asignación por Tier List Táctica",
      description: "Organizá el repertorio del jugador arrastrando los campeones hacia los tiers correspondientes (Tier S, A, B o C) según la prioridad estratégica."
    },
    {
      title: "3. Registro y Guardado del Roster",
      description: "Una vez clasificados los campeones, guardá la pool para que quede registrada en el sistema y disponible para todo el equipo técnico."
    },
    {
      title: "4. Edición y Actualización en Vivo",
      description: "Podés ingresar al detalle de cualquier pool guardada para modificarla, cambiar de línea o actualizar el roster frente a nuevos parches."
    },
    {
      title: "5. ¡Champion Pool al 100%!",
      description: "Mantené el repertorio de tu equipo perfectamente sincronizado y optimizado para el circuito competitivo."
    }
  ]
};

const MapTourModal = ({ tool = "home", onClose, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = toursData[tool] || toursData.home;
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onNavigate) {
        onNavigate(tool);
      } else {
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="tour-overlay" onClick={onClose}>
      <div className="tour-card" onClick={(e) => e.stopPropagation()}>
        <div className="tour-header">
          <span className="tour-counter">Paso {currentStep + 1} de {steps.length}</span>
          <button className="tour-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="tour-body">
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </div>

        <div className="tour-footer">
          <button 
            className="tour-btn secondary" 
            onClick={handlePrev} 
            disabled={currentStep === 0}
          >
            Anterior
          </button>
          
          <button className="tour-btn primary" onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Finalizar / Ir ➔" : "Siguiente ➔"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapTourModal;