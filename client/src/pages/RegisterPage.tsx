import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/api";
import { useFormWithValidation } from "../hooks/useFormWithValidation";

export default function RegisterPage() {
  // estado para errores de la API
  const [submitError, setSubmitError] = useState("");
  // Inicializa los hooks
  const { values, errors, isValid, handleChange } = useFormWithValidation();
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    try {
      await registerUser(values.email, values.password);
      navigate("/login");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Algo salió mal");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="form">
      <h1 className="form__title">Registrarse</h1>

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
        Registrarse
      </button>

      {/* Error de la API */}
      {submitError && <p className="form__error">{submitError}</p>}
    </form>
  );
}