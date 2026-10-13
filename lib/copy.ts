const es = {
  skip: "Saltar al contenido",
  langLabel: "Idioma",
  nav: {
    problem: "Problema",
    method: "Método",
    deliverable: "Entregable",
    model: "Modelo 3D",
    sample: "Ejemplo",
    faq: "FAQ",
    brief: "Enviar brief",
    menu: "Menú",
  },
  schedule: {
    label: "Agendar llamada",
    unavailable: "La agenda todavía no está publicada.",
  },
  hero: {
    eyebrow: "Layouts conceptuales GMP · España y Latinoamérica",
    title: "Layout conceptual GMP en 5 días",
    lead: "Tres variantes, zonificación ISO 14644 y Anexo 1, flujos de personal y material, modelo 3D interactivo, revisado por un experto.",
    body: "Para laboratorios farmacéuticos y biotecnológicos, CDMO y equipos de cosmética o suplementos que están ordenando una planta GMP. La IA propone variantes a partir del brief. {owner} las revisa antes de entregarlas.",
    primary: "Enviar brief",
    tertiary: "Ver el modelo de ejemplo",
    cardTitle: "Qué incluye este encargo",
    cardItems: [
      "3 variantes conceptuales",
      "Zonificación ISO 14644 / Anexo 1",
      "Flujos de personal y de material",
      "Plantas 2D y modelo 3D interactivo",
      "Revisión de {owner}",
    ],
    priceNote: "El importe todavía no está cerrado. Depende del área y del proceso.",
    audience: "No es un proyecto ejecutivo ni un software con sesión de usuario.",
  },
  problem: {
    eyebrow: "El problema",
    title: "El concepto de la planta se decide con poca visibilidad",
    body: "Antes del proyecto de detalle hace falta un dibujo común. Estas son las tensiones que este encargo aborda, sin cifras de mercado inventadas.",
    items: [
      {
        title: "La zonificación se cierra tarde",
        body: "Clases, esclusas y el sentido de la cascada se discuten cuando mover un tabique ya cuesta tiempo y obra.",
      },
      {
        title: "Los flujos se cruzan sin verse",
        body: "Personal, material y producto se explican en una reunión, pero un plano suelto no deja ver el cruce.",
      },
      {
        title: "Falta un concepto compartido",
        body: "Calidad, ingeniería y dirección necesitan el mismo dibujo antes de encargar el proyecto ejecutivo.",
      },
    ],
  },
  method: {
    eyebrow: "Cómo trabaja",
    title: "Del brief a un concepto revisado",
    body: "Cuatro pasos. La IA acelera las variantes. La entrega no sale sin revisión.",
    steps: [
      {
        title: "Brief",
        body: "Proceso, área, clases objetivo, plazo y las restricciones que ya conozca. Si hay un plano, se adjunta.",
      },
      {
        title: "Variantes con IA",
        body: "A partir del brief se preparan tres layouts conceptuales. Son alternativas para decidir, no un diseño cerrado.",
      },
      {
        title: "Revisión experta",
        body: "{owner} revisa zonificación, esclusas y flujos, y corrige o descarta lo que no se sostiene.",
      },
      {
        title: "Entrega 2D y 3D",
        body: "Plantas de las tres variantes y un modelo 3D interactivo de la variante recomendada.",
      },
    ],
    note: "El plazo de 5 días cuenta desde un brief completo y cubre este alcance conceptual. No incluye ingeniería de detalle, HVAC, cualificación ni dossier regulatorio. Si el caso se sale de ese alcance, se dice antes de empezar.",
  },
  deliverable: {
    eyebrow: "Qué recibe",
    title: "Un concepto para decidir, no un paquete de obra",
    body: "El encargo entrega material para alinear al equipo. Lo que no está en la lista, no está incluido.",
    items: [
      {
        title: "Tres variantes en planta",
        body: "Tres organizaciones conceptuales del mismo brief, para comparar recorridos y zonificación.",
      },
      {
        title: "Zonificación ISO 14644 y Anexo 1",
        body: "Clases y esclusas planteadas en clave conceptual. No es un informe de cumplimiento.",
      },
      {
        title: "Flujos de personal y de material",
        body: "El sentido de entrada, el recorrido de proceso y la salida, dibujados sobre la planta.",
      },
      {
        title: "Planos 2D",
        body: "La planta de cada variante, con salas, clases y flujos.",
      },
      {
        title: "Modelo 3D interactivo",
        body: "La variante recomendada, para orbitar la zonificación. Es un modelo conceptual, sin techos ni instalaciones.",
      },
      {
        title: "Notas de revisión",
        body: "Comentarios de {owner} sobre lo que sostiene y lo que habría que cambiar en el proyecto de detalle.",
      },
    ],
    excludedTitle: "Qué no incluye",
    excluded: [
      "Ingeniería de detalle o proyecto ejecutivo",
      "Cálculo o diseño de HVAC",
      "P&ID, piping o utilities",
      "Exportación BIM",
      "API o una plataforma de software",
      "Cualificación o validación (DQ, IQ, OQ, PQ)",
      "Firma de responsable de ingeniería",
      "Aprobación regulatoria o preparación de una inspección",
    ],
    priceCaption: "Precio del encargo descrito",
  },
  demo: {
    eyebrow: "Modelo 3D",
    title: "Así se recorre una zonificación",
    body: "Ejemplo inventado de una suite de llenado, de 30 m × 12 m. No es la planta de un cliente. Sirve para ver salas por clase ISO, el pasillo, las esclusas y las flechas de flujo.",
    badge: "Ejemplo",
    aria: "Modelo 3D de ejemplo de una suite de llenado. Se puede orbitar con el ratón o el dedo. El mismo ejemplo está dibujado en planta más abajo.",
    drag: "Arrastre para orbitar. La rueda o el gesto de pinza hacen zoom.",
    top: "Vista superior",
    orbit: "Vista 3D",
    personnel: "Flujo de personal",
    material: "Flujo de material",
    fallback: "WebGL no está disponible en este navegador. El plano 2D del mismo ejemplo está en la sección siguiente.",
    loading: "Cargando el modelo de ejemplo…",
    size: "30 m × 12 m",
    assumption:
      "Las puertas y las flechas son ilustrativas. En un encargo real, la revisión mira precisamente los cruces de flujo. Este ejemplo no los resuelve todos.",
  },
  sample: {
    eyebrow: "Entregable de ejemplo",
    title: "La misma suite, en planta",
    body: "El dibujo es el mismo caso didáctico del visor 3D. El índice describe cómo se organiza un entregable real; el plano no es un documento de un proyecto.",
    badge: "Ejemplo",
    planAria: "Planta de ejemplo de una suite de llenado, con clases ISO y flechas de personal y material.",
    indexTitle: "Índice orientativo del entregable",
    index: [
      "Nota de supuestos y de alcance",
      "Tres variantes conceptuales en planta",
      "Zonificación con clases ISO 14644 y criterio de Anexo 1",
      "Flujos de personal y de material",
      "Modelo 3D interactivo de la variante recomendada",
      "Comentarios de la revisión experta",
    ],
    assumption:
      "Supuesto didáctico: suite de llenado. Las clases, las puertas y las flechas no corresponden a una planta existente.",
    roomList: "Salas del ejemplo",
  },
  faq: {
    eyebrow: "Preguntas",
    title: "Alcance, plazo y precio",
    items: [
      {
        q: "¿Esto reemplaza al proyecto ejecutivo?",
        a: "No. Es un layout conceptual para alinear calidad, ingeniería y dirección. No sustituye al ingeniero o arquitecto responsable, y no alcanza por sí solo para construir ni para una inspección.",
      },
      {
        q: "¿Qué normas se tienen en cuenta?",
        a: "La zonificación se plantea con ISO 14644 y con el Anexo 1 de las GMP europeas, en clave conceptual: clases, esclusas y flujos. No es un informe de cumplimiento ni una evaluación regulatoria.",
      },
      {
        q: "¿Quién revisa las variantes?",
        a: "{owner}, como revisión de ingeniería farmacéutica. La IA prepara las variantes a partir del brief. La entrega no sale sin esa revisión, y puede corregir o descartar lo que la IA proponga.",
      },
      {
        q: "¿Para quién es?",
        a: "Laboratorios farmacéuticos y biotecnológicos, CDMO, y compañías de cosmética o suplementos que están pasando a requisitos GMP. El servicio se ofrece para España y Latinoamérica.",
      },
      {
        q: "¿Cuánto tarda?",
        a: "El encargo descrito está planteado en 5 días desde un brief completo. Si el proceso, el área o las restricciones se salen de ese alcance, se acuerda antes de empezar.",
      },
      {
        q: "¿Cuál es el precio?",
        a: "En esta página el precio es un marcador: {price}. El importe final no está cerrado.",
      },
      {
        q: "¿El modelo 3D de la web es un proyecto real?",
        a: "No. Está etiquetado como ejemplo. Es una suite de llenado inventada para mostrar el tipo de entrega. El modelo de un encargo se prepara a partir del brief.",
      },
      {
        q: "¿Puedo adjuntar un plano?",
        a: "Sí. PDF, PNG, JPG o WEBP de hasta 5 MB, o un enlace. No adjunte datos de pacientes ni archivos que no quiera almacenar para responder el brief.",
      },
    ],
  },
  cta: {
    eyebrow: "Brief",
    title: "Cuéntenos el proceso",
    body: "Si un dato no está decidido, escríbalo en las notas. Si el envío no se guarda, verá el error en el formulario: no mostramos una confirmación falsa.",
  },
  form: {
    company: "Empresa",
    contact: "Persona de contacto",
    email: "Email",
    country: "País",
    countryOther: "¿Qué país?",
    product: "Tipo de producto o proceso",
    productHint: "Por ejemplo: llenado aséptico de viales, sólidos orales, cosmético estéril.",
    area: "Área aproximada (m²)",
    areaHint: "Puede ser una estimación.",
    iso: "Clases ISO objetivo",
    timeline: "Plazo del proyecto",
    timelinePlaceholder: "Seleccione",
    notes: "Notas",
    file: "Plano u otro archivo",
    fileHint: "Opcional. PDF, PNG, JPG o WEBP. Máximo 5 MB.",
    link: "O un enlace al material",
    linkHint: "Opcional. Debe empezar por https://",
    warning: "No adjunte datos de pacientes ni información que no quiera guardar para responder este brief.",
    consentBefore: "He leído la",
    consentLink: "información de privacidad",
    consentAfter: "y envío estos datos para que respondan a este brief.",
    submit: "Enviar brief",
    sending: "Enviando…",
    successTitle: "Brief registrado",
    successBody: "Quedó guardado con la referencia {id}. Se usa solo para responder esta solicitud.",
    reference: "Referencia",
    another: "Enviar otro brief",
    required: "obligatorio",
    network: "No hubo respuesta del servidor. El brief no se ha guardado.",
    invalid: "La respuesta del servidor no se pudo leer. No asuma que el brief se guardó.",
  },
  footer: {
    blurb: "{brand} prepara layouts conceptuales GMP, con variantes asistidas por IA y revisión de {owner}.",
    privacy: "Privacidad",
    scope: "España y Latinoamérica",
  },
  privacy: {
    eyebrow: "Privacidad",
    title: "Datos del brief",
    updated: "Texto de esta página: octubre de 2026.",
    intro:
      "{brand} recoge solo lo que usted envía para pedir un layout conceptual. El responsable es {owner}. Esta página no es un certificado de cumplimiento.",
    sections: [
      {
        title: "Qué datos",
        body: "Empresa, nombre de contacto, email, país, tipo de producto o proceso, área, clases ISO objetivo, plazo, notas, y el archivo o enlace si lo adjunta. También se guarda el idioma de la página, la hora del envío y que aceptó esta información.",
      },
      {
        title: "Para qué",
        body: "Responder al brief y, si usted lo pide, preparar una llamada. No se usan para publicidad ni se venden.",
      },
      {
        title: "Dónde se guardan",
        body: "El envío se almacena en una base Postgres o se entrega por email mediante Resend, según cómo esté configurado el sitio. Esos proveedores tratan el mensaje para poder guardarlo o entregarlo. Si el almacenamiento falla, el formulario muestra el error y no confirma el envío.",
      },
      {
        title: "Analítica",
        body: "Si el sitio se publica en Vercel, usa Vercel Web Analytics. No instala cookies de seguimiento. Mide visitas de página de forma agregada. En local esa analítica no se activa.",
      },
      {
        title: "Cuánto tiempo",
        body: "El tiempo necesario para responder y, si hay encargo, para llevarlo. Puede pedir el borrado antes.",
      },
    ],
    rightsTitle: "Sus derechos",
    rightsWithEmail:
      "Para acceder, rectificar o suprimir sus datos, escriba a {email} o indíquelo en el formulario.",
    rightsNoEmail:
      "No hay un correo de privacidad publicado. Use el formulario de brief e indique que quiere acceder, rectificar o suprimir sus datos.",
    home: "Volver al inicio",
  },
};

const en: typeof es = {
  skip: "Skip to content",
  langLabel: "Language",
  nav: {
    problem: "Problem",
    method: "Method",
    deliverable: "Deliverable",
    model: "3D model",
    sample: "Example",
    faq: "FAQ",
    brief: "Send brief",
    menu: "Menu",
  },
  schedule: {
    label: "Book a call",
    unavailable: "Scheduling is not published yet.",
  },
  hero: {
    eyebrow: "Conceptual GMP layouts · Spain and Latin America",
    title: "Conceptual GMP layout in 5 days",
    lead: "Three options, ISO 14644 and Annex 1 zoning, personnel and material flows, an interactive 3D model, reviewed by an expert.",
    body: "For pharmaceutical and biotech labs, CDMOs, and cosmetics or supplement teams putting a plant under GMP. AI drafts options from the brief. {owner} reviews them before delivery.",
    primary: "Send a brief",
    tertiary: "View the example model",
    cardTitle: "What this engagement includes",
    cardItems: [
      "3 conceptual options",
      "ISO 14644 / Annex 1 zoning",
      "Personnel and material flows",
      "2D plans and an interactive 3D model",
      "Review by {owner}",
    ],
    priceNote: "The figure is not final. It depends on area and process.",
    audience: "This is not a detailed engineering package and not a logged-in software product.",
  },
  problem: {
    eyebrow: "The problem",
    title: "The plant concept is decided with too little to look at",
    body: "A shared drawing is needed before detailed design. These are the tensions this engagement addresses. No invented market figures.",
    items: [
      {
        title: "Zoning gets locked late",
        body: "Classes, airlocks, and the pressure cascade are still being argued when moving a partition already costs time and construction.",
      },
      {
        title: "Flows cross unseen",
        body: "People, materials, and product are explained in a meeting, but a loose plan does not show where they cross.",
      },
      {
        title: "There is no shared concept",
        body: "Quality, engineering, and leadership need the same drawing before commissioning detailed design.",
      },
    ],
  },
  method: {
    eyebrow: "How it works",
    title: "From brief to a reviewed concept",
    body: "Four steps. AI speeds up the options. Nothing is delivered without review.",
    steps: [
      {
        title: "Brief",
        body: "Process, area, target classes, timeline, and constraints you already know. An existing plan can be attached.",
      },
      {
        title: "AI options",
        body: "Three conceptual layouts are prepared from the brief. They are alternatives to decide with, not a frozen design.",
      },
      {
        title: "Expert review",
        body: "{owner} reviews zoning, airlocks, and flows, and corrects or discards what does not hold.",
      },
      {
        title: "2D and 3D delivery",
        body: "Plans of the three options and an interactive 3D model of the recommended one.",
      },
    ],
    note: "The 5-day window starts from a complete brief and covers this conceptual scope. It does not include detailed engineering, HVAC, qualification, or a regulatory dossier. If the case falls outside that scope, that is said before work starts.",
  },
  deliverable: {
    eyebrow: "What you get",
    title: "A concept for a decision, not a construction set",
    body: "The engagement produces material the team can align on. If it is not on the list, it is not included.",
    items: [
      {
        title: "Three floor-plan options",
        body: "Three conceptual organizations of the same brief, so routes and zoning can be compared.",
      },
      {
        title: "ISO 14644 and Annex 1 zoning",
        body: "Classes and airlocks set out conceptually. This is not a compliance report.",
      },
      {
        title: "Personnel and material flows",
        body: "Entry, process route, and exit, drawn on the plan.",
      },
      {
        title: "2D plans",
        body: "A plan of each option, with rooms, classes, and flows.",
      },
      {
        title: "Interactive 3D model",
        body: "The recommended option, so the zoning can be orbited. It is a conceptual model, without roofs or building services.",
      },
      {
        title: "Review notes",
        body: "Comments from {owner} on what holds and what detailed design would still need to change.",
      },
    ],
    excludedTitle: "Not included",
    excluded: [
      "Detailed engineering or a construction issue package",
      "HVAC calculation or design",
      "P&IDs, piping, or utilities",
      "BIM export",
      "An API or a software platform",
      "Qualification or validation (DQ, IQ, OQ, PQ)",
      "Sign-off by an engineer of record",
      "Regulatory approval or inspection preparation",
    ],
    priceCaption: "Price of the engagement described",
  },
  demo: {
    eyebrow: "3D model",
    title: "How a zoning reads in three dimensions",
    body: "An invented filling-suite example, 30 m × 12 m. It is not a client plant. It shows rooms by ISO class, the corridor, the airlocks, and flow arrows.",
    badge: "Ejemplo",
    aria: "Example 3D model of a filling suite. Drag to orbit. The same example is drawn as a plan further down the page.",
    drag: "Drag to orbit. Scroll or pinch to zoom.",
    top: "Top view",
    orbit: "3D view",
    personnel: "Personnel flow",
    material: "Material flow",
    fallback: "WebGL is not available in this browser. The 2D plan of the same example is in the next section.",
    loading: "Loading the example model…",
    size: "30 m × 12 m",
    assumption:
      "Doors and arrows are illustrative. In a real engagement, review looks exactly at flow crossings. This example does not resolve all of them.",
  },
  sample: {
    eyebrow: "Sample deliverable",
    title: "The same suite, in plan",
    body: "The drawing is the same didactic case as the 3D viewer. The index describes how a real deliverable is organized. The plan is not a project document.",
    badge: "Ejemplo",
    planAria: "Example plan of a filling suite, with ISO classes and personnel and material arrows.",
    indexTitle: "Indicative deliverable index",
    index: [
      "Assumptions and scope note",
      "Three conceptual plan options",
      "Zoning with ISO 14644 classes and an Annex 1 reading",
      "Personnel and material flows",
      "Interactive 3D model of the recommended option",
      "Expert review comments",
    ],
    assumption:
      "Didactic assumption: a filling suite. Classes, doors, and arrows do not correspond to an existing plant.",
    roomList: "Rooms in the example",
  },
  faq: {
    eyebrow: "Questions",
    title: "Scope, timing, and price",
    items: [
      {
        q: "Does this replace detailed design?",
        a: "No. It is a conceptual layout so quality, engineering, and leadership can align. It does not replace the engineer or architect of record, and it is not enough on its own to build or to face an inspection.",
      },
      {
        q: "Which standards are considered?",
        a: "Zoning is set out with ISO 14644 and EU GMP Annex 1, conceptually: classes, airlocks, and flows. It is not a compliance report or a regulatory assessment.",
      },
      {
        q: "Who reviews the options?",
        a: "{owner} reviews them as a senior pharmaceutical engineering review. AI prepares the options from the brief. Delivery does not go out without that review, which can correct or discard what the AI proposes.",
      },
      {
        q: "Who is it for?",
        a: "Pharmaceutical and biotech laboratories, CDMOs, and cosmetics or supplement companies moving under GMP requirements. The service is offered for Spain and Latin America.",
      },
      {
        q: "How long does it take?",
        a: "The engagement described is set up as 5 days from a complete brief. If the process, area, or constraints fall outside that scope, it is agreed before work starts.",
      },
      {
        q: "What does it cost?",
        a: "On this page the price is a placeholder: {price}. The final figure is not set.",
      },
      {
        q: "Is the 3D model on the site a real project?",
        a: "No. It is labeled as an example. It is an invented filling suite that shows the kind of delivery. A commissioned model is prepared from the brief.",
      },
      {
        q: "Can I attach a plan?",
        a: "Yes. PDF, PNG, JPG, or WEBP up to 5 MB, or a link. Do not attach patient data or files you do not want stored in order to answer the brief.",
      },
    ],
  },
  cta: {
    eyebrow: "Brief",
    title: "Tell us about the process",
    body: "If a fact is not decided, say so in the notes. If the submission is not stored, the form shows the error. It will not show a false confirmation.",
  },
  form: {
    company: "Company",
    contact: "Contact name",
    email: "Email",
    country: "Country",
    countryOther: "Which country?",
    product: "Product type or process",
    productHint: "For example: aseptic vial filling, oral solids, sterile cosmetic.",
    area: "Approximate area (m²)",
    areaHint: "An estimate is enough.",
    iso: "Target ISO classes",
    timeline: "Project timeline",
    timelinePlaceholder: "Select",
    notes: "Notes",
    file: "Plan or other file",
    fileHint: "Optional. PDF, PNG, JPG, or WEBP. 5 MB maximum.",
    link: "Or a link to the material",
    linkHint: "Optional. Must start with https://",
    warning: "Do not attach patient data or information you do not want stored in order to answer this brief.",
    consentBefore: "I have read the",
    consentLink: "privacy notice",
    consentAfter: "and I am sending this information so you can reply to this brief.",
    submit: "Send brief",
    sending: "Sending…",
    successTitle: "Brief stored",
    successBody: "It was saved with reference {id}. It is used only to reply to this request.",
    reference: "Reference",
    another: "Send another brief",
    required: "required",
    network: "The server did not respond. The brief was not saved.",
    invalid: "The server response could not be read. Do not assume the brief was saved.",
  },
  footer: {
    blurb: "{brand} prepares conceptual GMP layouts, with AI-assisted options and review by {owner}.",
    privacy: "Privacy",
    scope: "Spain and Latin America",
  },
  privacy: {
    eyebrow: "Privacy",
    title: "Brief data",
    updated: "Text of this page: October 2026.",
    intro:
      "{brand} collects only what you send to request a conceptual layout. The controller is {owner}. This page is not a compliance certificate.",
    sections: [
      {
        title: "Which data",
        body: "Company, contact name, email, country, product type or process, area, target ISO classes, timeline, notes, and the file or link if you attach one. The page language, the time of submission, and the fact that you accepted this notice are stored as well.",
      },
      {
        title: "Why",
        body: "To reply to the brief and, if you ask, to prepare a call. The data is not used for advertising and is not sold.",
      },
      {
        title: "Where it is stored",
        body: "The submission is stored in Postgres or delivered by email through Resend, depending on how the site is configured. Those providers process the message in order to store or deliver it. If storage fails, the form shows the error and does not confirm the submission.",
      },
      {
        title: "Analytics",
        body: "If the site is published on Vercel, it uses Vercel Web Analytics. It does not set tracking cookies. It measures page views in aggregate. Locally, that analytics hook does not run.",
      },
      {
        title: "How long",
        body: "As long as needed to reply and, if there is an engagement, to carry it out. You can ask for deletion earlier.",
      },
    ],
    rightsTitle: "Your rights",
    rightsWithEmail: "To access, correct, or delete your data, write to {email} or say so in the form.",
    rightsNoEmail:
      "No privacy email is published. Use the brief form and state that you want to access, correct, or delete your data.",
    home: "Back to the home page",
  },
};

export const copy = { es, en };
export type Copy = typeof es;
export type Locale = keyof typeof copy;
