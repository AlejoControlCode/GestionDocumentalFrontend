import { useState } from "react";

const LoginModal = ({ show, onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/api/loggin/auth/login`, // Ajusta la ruta según tu backend
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            NombreUsuario: username,
            Contrasena: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Login exitoso
      console.log("Login exitoso:", data);

      // Guardar el token en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir al dashboard
      window.location.href = data.redirec;

      // Cerrar modal
      onClose();
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Iniciar Sesión</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}>
                Cerrar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
