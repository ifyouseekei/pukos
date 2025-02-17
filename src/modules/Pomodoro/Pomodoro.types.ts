/**
 * pre-focus: The state before focus, this is usually shown initially before starting focus mode, or after break is finished and auto play is off
 * focus: focus mode, countdown will be ticking down
 * pre-break: focus just finished and auto-play is off
 * break: break mode, countdown will be ticking down
 */
export type PomodoroStates = 'pre-focus' | 'focus' | 'pre-break' | 'break';