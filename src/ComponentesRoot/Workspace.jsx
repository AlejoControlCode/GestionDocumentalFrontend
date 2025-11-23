const Workspace = ({ data }) => {
  const handleDownload = async (id, nombreDocumento) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/documentos/ruoutesDocumentos/DescargarDocumento/${id}`
      );

      if (!response.ok) {
        throw new Error("Error al descargar el documento");
      }

      // Convertir la respuesta a blob
      const blob = await response.blob();

      // Crear un enlace temporal para descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = nombreDocumento || `documento_${id}.pdf`; // Usa el nombre del documento
      document.body.appendChild(link);
      link.click();

      // Limpiar
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al descargar el documento");
    }
  };

  return (
    <div className="bg-white border rounded p-4" style={{ minHeight: "400px" }}>
      <h5 className="text-muted mb-3">Documentos</h5>

      {!data || data.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <p>Selecciona una opción y presiona "Buscar" para comenzar</p>
        </div>
      ) : (
        <div>
          <p className="text-muted mb-3">
            Se encontraron {data.length} documento(s)
          </p>
          <ul className="list-group">
            {data.map((item) => (
              <li key={item.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>{item.NombreDocumento}</strong>
                    <br />
                    <span className="text-muted">Labels: {item.Labels}</span>
                    <br />
                    <span className="badge bg-secondary mt-2">
                      {item.categoria}
                    </span>
                    <br />
                    <small className="text-muted">
                      Autor: {item.Autor} | Fecha:{" "}
                      {new Date(item.FechaDocumento).toLocaleDateString()}
                    </small>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() =>
                      handleDownload(item.id, item.NombreDocumento)
                    }>
                    Descargar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Workspace;
