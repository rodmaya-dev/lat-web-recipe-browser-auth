import { useFormWithValidation } from '../hooks/useFormWithValidation';

export default function LoginPage() {
  const { values, errors, isValid, handleChange } = useFormWithValidation();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    console.log('Formulario válido, valores:', values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      <h1 className="form__title">Iniciar sesión</h1>

      {/* Campo de email */}
      <div className="form__input-container">
        <label htmlFor="email" className="form__label">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={values.email ?? ''}
          onChange={handleChange}
          className="form__input"
        />
        {errors.email && (
          <p className="form__error">{errors.email}</p>
        )}
      </div>

      {/* Campo de contraseña */}
      <div className="form__input-container">
        <label htmlFor="password" className="form__label">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          value={values.password ?? ''}
          onChange={handleChange}
          className="form__input"
        />
        {errors.password && (
          <p className="form__error">{errors.password}</p>
        )}
      </div>

      {/* Botón de envío */}
      <button 
        type="submit" 
        disabled={!isValid}
        className="form__submit-btn"
      >
        Iniciar sesión
      </button>
    </form>
  );
}