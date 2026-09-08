import { ApiError } from '../api/client';

interface UiMessage {
  title: string;
  description?: string;
  requiresSignOut?: boolean;
}

export function toUiMessage(error: unknown): UiMessage {
  if (!(error instanceof ApiError)) {
    return { title: 'No se pudo completar la consulta', description: 'Vuelve a intentarlo.' };
  }

  switch (error.code) {
    case 'INVALID_CREDENTIALS':
      return { title: 'Email o contraseña incorrectos', description: 'Revisa los datos e intentalo de nuevo.' };
    case 'RUT_FORBIDDEN':
      return { title: 'No puedes consultar este RUT', description: 'Tu cuenta solo tiene acceso al score de tu propio RUT.' };
    case 'INVALID_RUT':
      return { title: 'El RUT no es válido', description: 'Ejemplo: 12.345.678-5' };
    case 'TOKEN_EXPIRED':
      return { title: 'Tu sesión expiró', description: 'Inicia sesión nuevamente.', requiresSignOut: true };
    case 'MISSING_TOKEN':
    case 'INVALID_TOKEN':
      return { title: 'Tu sesión no es válida', description: 'Inicia sesión nuevamente.', requiresSignOut: true };
    case 'NETWORK_ERROR':
      return { title: 'Sin conexión con el servidor', description: 'Revisa que la API esté corriendo en el puerto configurado.' };
    default:
      return { title: 'No se pudo completar la consulta', description: error.message };
  }
}