import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export type Language = 'en' | 'es';

const translations = {
  en: {
    welcome: 'WELCOME TO BOXIT', hero: 'Make space for\nwhat matters.', intro: 'A calm, focused way to time-box your day and build momentum.',
    namePlaceholder: 'What should we call you?', start: "Let's get started", yourDay: 'Your day,\none box at a time.',
    planTitle: 'Plan with intention', planBody: 'Create focused time-boxes and see your whole day at a glance.',
    streakTitle: 'Build your momentum', streakBody: 'Complete your important boxes and watch your momentum grow.',
    buildDay: 'Build my first day', todayScore: "TODAY'S SCORE", currentStreak: 'MOMENTUM', daysInRow: 'days in a row',
    goodMorning: 'Good morning, {name}.', day: 'Your day', addBox: '+ Add box', today: 'TODAY', makeRoom: 'Make room for something new',
    backDay: '← Your day', timeBox: 'TIME-BOX', newBox: 'NEW BOX', history: 'HISTORY', settings: 'SETTINGS', profile: 'YOUR BOXIT',
    close: 'Close', cancel: 'Cancel', edit: 'Edit', saveChanges: 'Save changes', addToDay: 'Add to my day',
    makeRoomTitle: 'Make room for something new.', what: 'WHAT ARE YOU MAKING TIME FOR?', description: 'DESCRIPTION',
    descriptionPlaceholder: 'What will you focus on?', time: 'TIME', date: 'DATE (YYYY-MM-DD)', importance: 'IMPORTANCE',
    repeat: 'REPEAT ON (OPTIONAL)', reminders: 'REMINDERS', beforeStart: '5 minutes before start', atEnd: 'When the box ends',
    low: 'Low', focus: 'Focus', high: 'High', critical: 'Critical', validTime: 'Enter a valid 24-hour range. End time must be after start.',
    lockedEdit: 'This time-box has started and cannot be edited.', completed: 'BOX COMPLETED', timeRemaining: 'TIME REMAINING',
    startsIn: 'STARTS IN', ended: 'TIME-BOX ENDED', niceWork: 'Nice work. You made room for what matters.',
    stayWith: 'Stay with this box until the timer ends.', canComplete: 'You can now mark this box as completed.',
    beginsAt: 'Your box begins at {time}.', editBox: 'Edit time-box', editLocked: 'Editing is locked while a box is active',
    importantWarning: 'This is an important box. Skipping it will reset your current {streak}-day momentum.',
    safeWarning: 'Your momentum is safe, but this day will not count as a perfect day.',
    beforeSkip: 'Before you skip this box', keepBox: 'Keep box', skipIt: 'Skip it', skipBox: 'I’m not doing this box',
    completedStatus: 'COMPLETED', skippedStatus: 'SKIPPED', plannedStatus: 'PLANNED', descriptionDefault: 'A new time-box for your day.',
    notifications: 'Notifications', notificationStatus: 'Reminder permission status', enabled: 'Enabled', notEnabled: 'Not enabled',
    unavailable: 'Unavailable', checking: 'Checking…', resetData: 'Reset local data', settingsDescription: 'Keep BOXIT working the way you need it.',
    resetTitle: 'Reset BOXIT?', resetBody: 'This deletes tasks, history, and your profile from this device.', reset: 'Reset',
    historyTitle: 'Your progress.', historyDescription: 'Every box you make time for becomes part of your momentum.',
    viewHistory: 'View your history →', settingsLink: 'Settings →', yourProfile: '← Your profile',
    replayTutorial: 'Replay tutorial',
    tutorialSkip: 'Skip tutorial', tutorialNext: 'Next', tutorialDone: 'Got it',
    tutorial1Title: 'Build your momentum', tutorial1Body: 'Complete your boxes to build Momentum. Your score shows how much of today you have completed.',
    tutorial2Title: 'Priorities shape Momentum', tutorial2Body: 'Low and Focus boxes can pause your Momentum. Missing a High or Critical box resets it.',
    tutorial3Title: 'Choose your day', tutorial3Body: 'Swipe through the week to preview and plan upcoming boxes.',
    tutorial4Title: 'Tap any box', tutorial4Body: 'Open a dedicated focus screen with the live countdown and actions.',
    tutorial5Title: 'Add a new box', tutorial5Body: 'Use + Add box whenever you want to make room for something that matters.',
    overlapTitle: 'Time-box overlaps', overlapBody: 'Choose a time that does not overlap another box on this day.',
  },
  es: {
    welcome: 'BIENVENIDO A BOXIT', hero: 'Haz espacio para\nlo que importa.', intro: 'Una forma tranquila y enfocada de organizar tu día en bloques de tiempo.',
    namePlaceholder: '¿Cómo te llamamos?', start: 'Comenzar', yourDay: 'Tu día,\nun bloque a la vez.',
    planTitle: 'Planifica con intención', planBody: 'Crea bloques enfocados y mira todo tu día de un vistazo.',
    streakTitle: 'Construye tu Momentum', streakBody: 'Completa tus bloques importantes y observa crecer tu Momentum.',
    buildDay: 'Crear mi primer día', todayScore: 'PUNTUACIÓN DE HOY', currentStreak: 'MOMENTUM', daysInRow: 'días seguidos',
    goodMorning: 'Buenos días, {name}.', day: 'Tu día', addBox: '+ Añadir bloque', today: 'HOY', makeRoom: 'Haz espacio para algo nuevo',
    backDay: '← Tu día', timeBox: 'BLOQUE', newBox: 'NUEVO BLOQUE', history: 'HISTORIAL', settings: 'AJUSTES', profile: 'TU BOXIT',
    close: 'Cerrar', cancel: 'Cancelar', edit: 'Editar', saveChanges: 'Guardar cambios', addToDay: 'Añadir a mi día',
    makeRoomTitle: 'Haz espacio para algo nuevo.', what: '¿PARA QUÉ HARÁS TIEMPO?', description: 'DESCRIPCIÓN',
    descriptionPlaceholder: '¿En qué te enfocarás?', time: 'HORA', date: 'FECHA (AAAA-MM-DD)', importance: 'IMPORTANCIA',
    repeat: 'REPETIR (OPCIONAL)', reminders: 'RECORDATORIOS', beforeStart: '5 minutos antes de comenzar', atEnd: 'Al terminar el bloque',
    low: 'Baja', focus: 'Enfoque', high: 'Alta', critical: 'Crítica', validTime: 'Introduce un horario válido de 24 horas. El final debe ser posterior al inicio.',
    lockedEdit: 'Este bloque ya comenzó y no se puede editar.', completed: 'BLOQUE COMPLETADO', timeRemaining: 'TIEMPO RESTANTE',
    startsIn: 'COMIENZA EN', ended: 'BLOQUE TERMINADO', niceWork: 'Buen trabajo. Hiciste espacio para lo que importa.',
    stayWith: 'Mantente en este bloque hasta que termine el temporizador.', canComplete: 'Ya puedes marcar este bloque como completado.',
    beginsAt: 'Tu bloque comienza a las {time}.', editBox: 'Editar bloque', editLocked: 'La edición está bloqueada mientras el bloque está activo',
    importantWarning: 'Este es un bloque importante. Saltarlo reiniciará tu Momentum actual de {streak} días.',
    safeWarning: 'Tu racha está a salvo, pero este día no contará como día perfecto.',
    beforeSkip: 'Antes de saltar este bloque', keepBox: 'Conservar', skipIt: 'Saltar', skipBox: 'No haré este bloque',
    completedStatus: 'COMPLETADO', skippedStatus: 'SALTADO', plannedStatus: 'PLANIFICADO', descriptionDefault: 'Un nuevo bloque para tu día.',
    notifications: 'Notificaciones', notificationStatus: 'Estado de permisos', enabled: 'Activadas', notEnabled: 'No activadas',
    unavailable: 'No disponibles', checking: 'Comprobando…', resetData: 'Borrar datos locales', settingsDescription: 'Configura BOXIT como lo necesitas.',
    resetTitle: '¿Borrar BOXIT?', resetBody: 'Esto elimina tareas, historial y tu perfil de este dispositivo.', reset: 'Borrar',
    historyTitle: 'Tu progreso.', historyDescription: 'Cada bloque al que haces espacio se convierte en parte de tu impulso.',
    viewHistory: 'Ver historial →', settingsLink: 'Ajustes →', yourProfile: '← Tu perfil',
    replayTutorial: 'Repetir tutorial',
    tutorialSkip: 'Saltar tutorial', tutorialNext: 'Siguiente', tutorialDone: 'Entendido',
    tutorial1Title: 'Construye tu Momentum', tutorial1Body: 'Completa tus bloques para construir Momentum. Tu puntuación muestra cuánto has completado hoy.',
    tutorial2Title: 'Las prioridades dan forma al Momentum', tutorial2Body: 'Los bloques de prioridad Baja y Enfoque pueden pausar tu Momentum. No completar uno Alto o Crítico lo reinicia.',
    tutorial3Title: 'Elige tu día', tutorial3Body: 'Desliza la semana para ver y planificar próximos bloques.',
    tutorial4Title: 'Toca cualquier bloque', tutorial4Body: 'Abre una pantalla enfocada con cuenta regresiva y acciones.',
    tutorial5Title: 'Añade un bloque', tutorial5Body: 'Usa + Añadir bloque para hacer espacio a lo que importa.',
    overlapTitle: 'Bloques superpuestos', overlapBody: 'Elige un horario que no se solape con otro bloque de este día.',
  },
} as const;

type TranslationKey = keyof typeof translations.en;
type LanguageContextValue = { language: Language; setLanguage: (language: Language) => void; t: (key: TranslationKey, values?: Record<string, string | number>) => string };
const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ initialLanguage = 'en', children }: { initialLanguage?: Language; children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key: TranslationKey, values?: Record<string, string | number>) => {
      let result = translations[language][key] as string;
      Object.entries(values || {}).forEach(([name, value]) => { result = result.replace(`{${name}}`, String(value)); });
      return result;
    },
  }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}
