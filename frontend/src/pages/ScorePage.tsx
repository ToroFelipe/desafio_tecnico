import { useEffect, useState, type FormEvent } from 'react';
import { fetchScore } from '../api/client';
import { Alert } from '../components/Alert';
import { useAuth } from '../auth/AuthContext';
import type { ScoreReport } from '../types';
import { formatRut, hasValidRutFormat } from '../utils/rut';
import { toUiMessage } from '../utils/errorMessages';

export function ScorePage() {
  const { user, token, signOut } = useAuth();
  const isOwnRutOnly = user?.role === 'user';

  const [rut, setRut] = useState(() => (user?.rut ? formatRut(user.rut) : ''));
  const [report, setReport] = useState<ScoreReport | null>(null);
  const [error, setError] = useState<ReturnType<typeof toUiMessage> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!error?.requiresSignOut) return;
    const timer = window.setTimeout(signOut, 2500);
    return () => window.clearTimeout(timer);
  }, [error, signOut]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    if (!hasValidRutFormat(rut)) {
      setError({ title: 'El RUT no es válido', description: 'Ejemplo: 12.345.678-5' });
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      setReport(await fetchScore(rut, token));
    } catch (caught) {
      setReport(null);
      setError(toUiMessage(caught));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Consultar score</h1>
        <button onClick={signOut} style={{ padding: '6px 14px', border: '1px solid #d1d5db', borderRadius: '4px', background: 'white', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      <p style={{ color: '#6b7280', marginTop: 0 }}>
        {isOwnRutOnly ? 'Tu cuenta tiene acceso al score de tu propio RUT.' : 'Como administrador puedes consultar cualquier RUT.'}
      </p>

      {error ? <Alert title={error.title} description={error.description} /> : null}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="rut" style={{ display: 'block', marginBottom: '6px' }}>RUT</label>
          <input id="rut" value={rut} onChange={e => setRut(formatRut(e.target.value))}
            placeholder="12.345.678-5" disabled={isOwnRutOnly}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} />
          {isOwnRutOnly ? <small style={{ color: '#6b7280' }}>Este es el RUT asociado a tu cuenta.</small> : null}
        </div>
        <button type="submit" disabled={isLoading}
          style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          {isLoading ? 'Consultando...' : 'Consultar score'}
        </button>
      </form>

      {report ? (
        <div style={{ marginTop: '24px', padding: '24px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>RUT consultado</div>
          <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{report.rut}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Score financiero</div>
          <div style={{ fontSize: '64px', fontWeight: 700, lineHeight: 1,
            color: report.score >= 70 ? '#16a34a' : report.score >= 40 ? '#d97706' : '#dc2626' }}>
            {report.score}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
            {report.score >= 70 ? 'Riesgo bajo' : report.score >= 40 ? 'Riesgo medio' : 'Riesgo alto'}
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '12px' }}>
            Consultado: {new Date(report.fecha).toLocaleString('es-CL')}
          </div>
        </div>
      ) : null}
    </div>
  );
}