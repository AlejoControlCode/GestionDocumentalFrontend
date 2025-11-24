import { useState } from "react";
import GuardarDocumento from "./guardarDocumento.jsx";

function DashboardAdmin() {
  const [contenido, setContenido] = useState(<h4>Sistema de Documentos</h4>);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API}/api/loggin/auth/logout`,
        {
          method: "POST",
          //credentials: "include",
        }
      );

      if (res.ok) {
        localStorage.removeItem("usuario");
        alert("Sesión cerrada correctamente");
        window.location.href = "/";
      } else {
        alert("Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMenuClick = (opcion) => {
    switch (opcion) {
      case "GuardarDocumento":
        setContenido(<GuardarDocumento />);
        break;
      default:
        setContenido(<h4>Bienvenido al sistema de documentos</h4>);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Sidebar */}
        <div className="col-3 col-md-2 bg-dark text-white p-3">
          <h4 className="text-center mb-4 ">
            Documentos
            <rm /> CIAF
            <rm />
          </h4>
          <ul className="nav flex-column  position-fixed">
            <li className="nav-item mb-2">
              <button
                className="btn btn-outline-light w-100"
                onClick={() => handleMenuClick("GuardarDocumento")}>
                Cargar Documentos
              </button>
            </li>

            <li className="nav-item mb-2">
              <button onClick={handleLogout} className="btn btn-outline-light">
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>

        {/* Contenido principal */}
        <div className="col-9 col-md-10 p-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div>{contenido}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;
