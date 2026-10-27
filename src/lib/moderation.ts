export const REPORT_REASONS = [
  'Desnudos o contenido sexual',
  'Acoso o amenazas',
  'Perfil falso o spam',
  'Menor de edad',
  'Otro'
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];
