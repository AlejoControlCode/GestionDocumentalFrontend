import { useState } from "react";

function ModalDocumento({ onDocumentoCreado }) {
  const [formData, setFormData] = useState({
    NombreDocumento: "",
    Labels: "",
    categoria: "",
    Autor: "",
    FechaDocumento: "",
    Documento: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 10 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Máximo 10MB.");
      e.target.value = "";
      return;
    }

    setFormData({
      ...formData,
      Documento: file,
    });
  };

  const resetForm = () => {
    setFormData({
      NombreDocumento: "",
      Labels: "",
      categoria: "",
      Autor: "",
      FechaDocumento: "",
      Documento: null,
    });

    const fileInput = document.getElementById("Documento");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.Documento) {
      alert("Por favor selecciona un archivo");
      setIsLoading(false);
      return;
    }

    const data = new FormData();
    data.append("NombreDocumento", formData.NombreDocumento);
    data.append("Labels", formData.Labels);
    data.append("Categoria", formData.categoria);
    data.append("Autor", formData.Autor);
    data.append("FechaDocumento", formData.FechaDocumento);
    data.append("file", formData.Documento);
    try {
      const res = await fetch(
        "http://localhost:3000/api/documentos/ruoutesDocumentos/GuardarDocumentos",
        {
          method: "POST",
          body: data,
        }
      );

      if (res.ok) {
        const result = await res.json();
        console.log("Documento creado:", result);

        resetForm();

        const modalElement = document.getElementById("documentoModal");
        if (modalElement) {
          if (window.bootstrap && window.bootstrap.Modal) {
            const modalInstance =
              window.bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          } else {
            if (window.$ && window.$.fn && window.$.fn.modal) {
              window.$(modalElement).modal("hide");
            } else {
              modalElement.classList.remove("show");
              modalElement.style.display = "none";
              document.body.classList.remove("modal-open");
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) {
                backdrop.remove();
              }
            }
          }
        }

        onDocumentoCreado(
          true,
          result.message || "Documento guardado exitosamente"
        );
      } else {
        const errorData = await res.json();
        console.error("Error del servidor:", errorData);

        onDocumentoCreado(
          false,
          errorData.error || "Error al guardar el documento"
        );
      }
    } catch (error) {
      console.error("Error de red:", error);
      onDocumentoCreado(false, "Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
    }
  };

  return (
    <div
      className="modal fade"
      id="documentoModal"
      tabIndex="-1"
      aria-labelledby="documentoModalLabel"
      aria-hidden="true"
      data-bs-backdrop="static"
      data-bs-keyboard="false">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="documentoModalLabel">
              Subir Documento
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
              disabled={isLoading}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} id="documentoForm">
              <div className="mb-3">
                <label htmlFor="NombreDocumento" className="form-label">
                  Nombre del Documento <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="NombreDocumento"
                  name="NombreDocumento"
                  value={formData.NombreDocumento}
                  onChange={handleInputChange}
                  placeholder="Ej: Contrato de servicios 2024"
                  required
                  disabled={isLoading}
                  maxLength="255"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="Labels" className="form-label">
                  Etiquetas
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Labels"
                  name="Labels"
                  value={formData.Labels}
                  onChange={handleInputChange}
                  placeholder="Ej: legal, contrato, importante"
                  disabled={isLoading}
                />
                <small className="text-muted">
                  Separa las etiquetas con comas
                </small>
              </div>

              <div className="mb-3">
                <label htmlFor="categoria" className="form-label">
                  Categoría <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}>
                  <option value="">Seleccionar categoría</option>
                  <option value="Legal">Legal</option>
                  <option value="Financiero">Financiero</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Otro">Software</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="Autor" className="form-label">
                  Autor <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="Autor"
                  name="Autor"
                  value={formData.Autor}
                  onChange={handleInputChange}
                  placeholder="Nombre del autor"
                  required
                  disabled={isLoading}
                  maxLength="100"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="FechaDocumento" className="form-label">
                  Fecha del Documento <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="FechaDocumento"
                  name="FechaDocumento"
                  value={formData.FechaDocumento}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="Documento" className="form-label">
                  Archivo <span className="text-danger">*</span>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="Documento"
                  name="Documento"
                  onChange={handleFileChange}
                  required
                  disabled={isLoading}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                />
                <small className="text-muted">
                  Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG.
                  Máximo 10MB
                </small>
              </div>

              {formData.Documento && (
                <div className="alert alert-info">
                  <strong>Archivo seleccionado:</strong>{" "}
                  {formData.Documento.name}(
                  {(formData.Documento.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleClose}
              disabled={isLoading}>
              Cancelar
            </button>
            <button
              type="submit"
              form="documentoForm"
              className="btn btn-primary"
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"></span>
                  Guardando...
                </>
              ) : (
                <>Guardar Documento</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalDocumento;
