interface AlertProps {
    title: string;
    description?: string;
  }
  
  export function Alert({ title, description }: AlertProps) {
    return (
      <div role="alert" style={{ padding: '12px 16px', marginBottom: '16px', border: '1px solid #f87171', borderRadius: '6px', background: '#fef2f2', color: '#991b1b' }}>
        <strong>{title}</strong>
        {description ? <p style={{ margin: '4px 0 0', fontSize: '14px' }}>{description}</p> : null}
      </div>
    );
  }