import { useEffect, useState } from "react";
import ModalDocumento from "./modalAgregarDocumento.jsx";

function GuardarDocumento() {
  const [documentos, setDocumentos] = useState([]);

  const fetchDocumentos = () => {
    fetch(
      `${
        import.meta.env.VITE_API
      }/api/documentos/ruoutesDocumentos/ListarTodoslosDocumentos`
    )
      .then((res) => res.json())
      .then((data) => setDocumentos(data))
      .catch((err) => console.error("Error cargando documentos:", err));
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const handleDocumentoCreado = (exito, mensaje) => {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", "mt-3");
    alertDiv.setAttribute("role", "alert");

    if (exito) {
      alertDiv.classList.add("alert-success");
      alertDiv.textContent = ` ${mensaje}`;
      fetchDocumentos();
    } else {
      alertDiv.classList.add("alert-danger");
      alertDiv.textContent = ` ${mensaje}`;
    }

    document.getElementById("alertContainer").appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 4000);
  };

  const eliminarDocumento = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este documento?")) return;

    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API
        }/api/documentos/ruoutesDocumentos/eliminarDocumento/${id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        const alertDiv = document.createElement("div");
        alertDiv.classList.add("alert", "alert-success", "mt-3");
        alertDiv.setAttribute("role", "alert");
        alertDiv.textContent = " Documento eliminado exitosamente";
        document.getElementById("alertContainer").appendChild(alertDiv);

        fetchDocumentos();

        setTimeout(() => alertDiv.remove(), 3000);
      } else {
        alert("❌ Error al eliminar documento");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const descargarDocumento = async (id, nombreDocumento) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API
        }/api/documentos/ruoutesDocumentos/descargarDocumento/${id}`
      );

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = nombreDocumento || `documento_${id}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert(" Error al descargar documento");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(" Error al descargar documento");
    }
  };

  return (
    <div className="d-flex">
      <div className="flex-grow-1 p-3">
        <h2 className="mb-4">Gestión de Documentos</h2>

        <div id="alertContainer"></div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#documentoModal">
            Subir Documento
          </button>
        </div>

        <div>
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Labels</th>
                <th>Categoría</th>
                <th>Autor</th>
                <th>Fecha</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {documentos.length > 0 ? (
                documentos.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.id}</td>
                    <td>{doc.NombreDocumento}</td>
                    <td>{doc.Labels}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {doc.Categoria}
                      </span>
                    </td>
                    <td>{doc.Autor}</td>
                    <td>{new Date(doc.FechaDocumento).toLocaleDateString()}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() =>
                          descargarDocumento(doc.id, doc.NombreDocumento)
                        }>
                        Descargar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarDocumento(doc.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No hay documentos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ModalDocumento onDocumentoCreado={handleDocumentoCreado} />
      </div>
    </div>
  );
}

export default GuardarDocumento;
