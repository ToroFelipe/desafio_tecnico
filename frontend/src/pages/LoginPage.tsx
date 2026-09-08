import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import { useAuth } from '../auth/AuthContext';
import { toUiMessage } from '../utils/errorMessages';

export function LoginPage() {
  const { isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ReturnType<typeof toUiMessage> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/consulta" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/consulta', { replace: true });
    } catch (caught) {
      setError(toUiMessage(caught));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: '380px', margin: '60px auto', padding: '0 16px' }}>
      <h1>Consulta de riesgo financiero</h1>
      {error ? <Alert title={error.title} description={error.description} /> : null}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '6px' }}>Email</label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '6px' }}>Contraseña</label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #d1d5db', boxSizing: 'border-box' }} required />
        </div>
        <button type="submit" disabled={isSubmitting}
          style={{ width: '100%', padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}>
          {isSubmitting ? 'Verificando...' : 'Iniciar sesión'}
        </button>
      </form>
      <div style={{ marginTop: '24px', padding: '16px', border: '1px dashed #d1d5db', borderRadius: '6px', fontSize: '13px', color: '#6b7280' }}>
        <strong style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>Cuentas de prueba</strong>
        <div>Admin: usr_001@test.cl / admin123</div>
        <div>Usuario: usr_002@test.cl / user123</div>
      </div>
    </div>
  );
}