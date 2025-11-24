import { useState } from "react";
import LoginModal from "./loginModal";
import Workspace from "./Workspace";

const Root = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = async () => {
    if (!selectedOption) {
      alert("Por favor selecciona una categoría");
      return;
    }

    try {
      console.log("Buscando:", selectedOption);

      const response = await fetch(
        `${
          import.meta.env.VITE_API
        }/api/documentos/ruoutesDocumentos/listarDocumentos/${selectedOption}`
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener los documentos");
      }

      const result = await response.json();
      console.log("Datos recibidos:", result);

      setData(result);

      if (result.length === 0) {
        alert(
          `No se encontraron documentos en la categoría: ${selectedOption}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  };

  return (
    <div
      className="d-flex justify-content-center bg-light"
      style={{ minHeight: "100vh" }}>
      <div className="container-fluid p-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div
              className="bg-white border rounded p-4 mb-4"
              style={{ maxWidth: "400px", margin: "0 auto" }}>
              <h2 className="text-center mb-3">Panel de Control</h2>

              <button
                className="btn btn-primary w-100 mb-3"
                onClick={() => setShowLoginModal(true)}>
                Iniciar Sesión
              </button>

              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  onChange={(e) => setSelectedOption(e.target.value)}>
                  <option value="">Seleccione una opción</option>
                  <option value="Legal">Legal</option>
                  <option value="Financiero">Financiero</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Otro">Software</option>
                </select>

                <button className="btn btn-success" onClick={handleSearch}>
                  Buscar
                </button>
              </div>
            </div>

            <Workspace data={data} />
          </div>
        </div>

        <LoginModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>
    </div>
  );
};

export default Root;
