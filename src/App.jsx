import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sistema_captura_datos_v1";

const tiposPregunta = [
  { value: "texto_corto", label: "Texto corto" },
  { value: "texto_largo", label: "Texto largo" },
  { value: "numero", label: "Número" },
  { value: "porcentaje", label: "Porcentaje" },
  { value: "fecha", label: "Fecha" },
  { value: "seleccion_unica", label: "Selección única" },
  { value: "seleccion_multiple", label: "Selección múltiple" },
  { value: "lista", label: "Lista desplegable" },
  { value: "escala", label: "Escala" },
  { value: "si_no", label: "Sí / No" },
  { value: "verdadero_falso", label: "Verdadero / Falso" },
  { value: "calificacion", label: "Calificación numérica" },
];

const estadoInicial = {
  instrumentos: [],
  ejes: [],
  preguntas: [],
  registros: [],
};

function crearId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function fechaActual() {
  return new Date().toISOString();
}

function formatearFecha(fecha) {
  if (!fecha) return "-";

  return new Date(fecha).toLocaleString("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function App() {
  const [datos, setDatos] = useState(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY);
      return guardados ? JSON.parse(guardados) : estadoInicial;
    } catch {
      return estadoInicial;
    }
  });

  const [vista, setVista] = useState("inicio");
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
  }, [datos]);

  const cambiarVista = (nuevaVista) => {
    setVista(nuevaVista);
    setMenuAbierto(false);
  };

  return (
    <>
      <style>{estilos}</style>

      <div className="app">
        <header className="topbar">
          <button
            className="menu-mobile"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
          </button>

          <div>
            <h1>Sistema de Captura y Análisis</h1>
            <p>Gestión dinámica de instrumentos e información</p>
          </div>

          <div className="topbar-badge">React</div>
        </header>

        <aside className={`sidebar ${menuAbierto ? "abierto" : ""}`}>
          <div className="logo-area">
            <div className="logo">DA</div>
            <div>
              <strong>DataApp</strong>
              <span>Gestión de información</span>
            </div>
          </div>

          <nav>
            <BotonMenu
              icono="⌂"
              texto="Inicio"
              activo={vista === "inicio"}
              onClick={() => cambiarVista("inicio")}
            />

            <BotonMenu
              icono="▣"
              texto="Instrumentos"
              activo={vista === "instrumentos"}
              onClick={() => cambiarVista("instrumentos")}
            />

            <BotonMenu
              icono="◫"
              texto="Ejes temáticos"
              activo={vista === "ejes"}
              onClick={() => cambiarVista("ejes")}
            />

            <BotonMenu
              icono="?"
              texto="Preguntas"
              activo={vista === "preguntas"}
              onClick={() => cambiarVista("preguntas")}
            />

            <BotonMenu
              icono="✎"
              texto="Capturar datos"
              activo={vista === "captura"}
              onClick={() => cambiarVista("captura")}
            />

            <BotonMenu
              icono="☷"
              texto="Registros"
              activo={vista === "registros"}
              onClick={() => cambiarVista("registros")}
            />

            <BotonMenu
              icono="▥"
              texto="Análisis"
              activo={vista === "analisis"}
              onClick={() => cambiarVista("analisis")}
            />
          </nav>

          <div className="sidebar-footer">
            Datos almacenados localmente
          </div>
        </aside>

        <main className="contenido">
          {vista === "inicio" && (
            <Inicio datos={datos} cambiarVista={cambiarVista} />
          )}

          {vista === "instrumentos" && (
            <Instrumentos datos={datos} setDatos={setDatos} />
          )}

          {vista === "ejes" && (
            <Ejes datos={datos} setDatos={setDatos} />
          )}

          {vista === "preguntas" && (
            <Preguntas datos={datos} setDatos={setDatos} />
          )}

          {vista === "captura" && (
            <Captura datos={datos} setDatos={setDatos} />
          )}

          {vista === "registros" && (
            <Registros datos={datos} setDatos={setDatos} />
          )}

          {vista === "analisis" && <Analisis datos={datos} />}
        </main>
      </div>
    </>
  );
}

function BotonMenu({ icono, texto, activo, onClick }) {
  return (
    <button
      className={`menu-item ${activo ? "activo" : ""}`}
      onClick={onClick}
    >
      <span className="menu-icono">{icono}</span>
      <span>{texto}</span>
    </button>
  );
}

function Inicio({ datos, cambiarVista }) {
  const activos = datos.preguntas.filter((p) => p.activa).length;

  return (
    <div>
      <EncabezadoPagina
        titulo="Panel general"
        descripcion="Resumen del sistema de captura, organización y análisis."
      />

      <div className="tarjetas">
        <TarjetaDato
          titulo="Instrumentos"
          valor={datos.instrumentos.length}
          icono="▣"
        />

        <TarjetaDato
          titulo="Ejes temáticos"
          valor={datos.ejes.length}
          icono="◫"
        />

        <TarjetaDato titulo="Preguntas activas" valor={activos} icono="?" />

        <TarjetaDato
          titulo="Registros"
          valor={datos.registros.length}
          icono="☷"
        />
      </div>

      <div className="grid-2">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Acciones rápidas</h2>
              <p>Configura y empieza a utilizar tu aplicación.</p>
            </div>
          </div>

          <div className="acciones">
            <button
              className="accion"
              onClick={() => cambiarVista("instrumentos")}
            >
              <strong>1</strong>
              <span>
                <b>Crear instrumento</b>
                Define el formulario o instrumento de captura.
              </span>
            </button>

            <button className="accion" onClick={() => cambiarVista("ejes")}>
              <strong>2</strong>
              <span>
                <b>Crear ejes</b>
                Organiza la información por temas o categorías.
              </span>
            </button>

            <button
              className="accion"
              onClick={() => cambiarVista("preguntas")}
            >
              <strong>3</strong>
              <span>
                <b>Crear preguntas</b>
                Agrega preguntas dinámicamente.
              </span>
            </button>

            <button
              className="accion"
              onClick={() => cambiarVista("captura")}
            >
              <strong>4</strong>
              <span>
                <b>Capturar información</b>
                Diligencia los instrumentos creados.
              </span>
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Estado del sistema</h2>
              <p>Información almacenada en este dispositivo.</p>
            </div>
          </div>

          <div className="estado-lista">
            <Estado
              titulo="Instrumentos activos"
              valor={
                datos.instrumentos.filter((item) => item.activo).length
              }
            />
            <Estado
              titulo="Ejes activos"
              valor={datos.ejes.filter((item) => item.activo).length}
            />
            <Estado
              titulo="Total de preguntas"
              valor={datos.preguntas.length}
            />
            <Estado
              titulo="Respuestas almacenadas"
              valor={datos.registros.length}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function TarjetaDato({ titulo, valor, icono }) {
  return (
    <div className="tarjeta-dato">
      <div className="tarjeta-icono">{icono}</div>
      <div>
        <span>{titulo}</span>
        <strong>{valor}</strong>
      </div>
    </div>
  );
}

function Estado({ titulo, valor }) {
  return (
    <div className="estado">
      <span>{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}

function EncabezadoPagina({ titulo, descripcion }) {
  return (
    <div className="encabezado-pagina">
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
    </div>
  );
}

function Instrumentos({ datos, setDatos }) {
  const formularioVacio = {
    id: "",
    nombre: "",
    descripcion: "",
    activo: true,
  };

  const [form, setForm] = useState(formularioVacio);

  const guardar = (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      alert("Escribe el nombre del instrumento.");
      return;
    }

    if (form.id) {
      setDatos((anterior) => ({
        ...anterior,
        instrumentos: anterior.instrumentos.map((item) =>
          item.id === form.id
            ? {
                ...item,
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                activo: form.activo,
                modificado: fechaActual(),
              }
            : item
        ),
      }));
    } else {
      const nuevo = {
        id: crearId(),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        activo: form.activo,
        creado: fechaActual(),
        modificado: fechaActual(),
      };

      setDatos((anterior) => ({
        ...anterior,
        instrumentos: [...anterior.instrumentos, nuevo],
      }));
    }

    setForm(formularioVacio);
  };

  const editar = (item) => {
    setForm({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion || "",
      activo: item.activo,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = (id) => {
    const tieneEjes = datos.ejes.some((e) => e.instrumentoId === id);
    const tienePreguntas = datos.preguntas.some(
      (p) => p.instrumentoId === id
    );
    const tieneRegistros = datos.registros.some(
      (r) => r.instrumentoId === id
    );

    if (tieneEjes || tienePreguntas || tieneRegistros) {
      alert(
        "No puedes eliminar este instrumento porque tiene ejes, preguntas o registros asociados."
      );
      return;
    }

    if (!confirm("¿Deseas eliminar este instrumento?")) return;

    setDatos((anterior) => ({
      ...anterior,
      instrumentos: anterior.instrumentos.filter((i) => i.id !== id),
    }));
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Instrumentos"
        descripcion="Crea y administra los instrumentos de captura de información."
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{form.id ? "Editar instrumento" : "Nuevo instrumento"}</h2>
            <p>Define el formulario que será utilizado para capturar datos.</p>
          </div>
        </div>

        <form onSubmit={guardar}>
          <div className="form-grid">
            <Campo label="Nombre del instrumento" requerido>
              <input
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
                placeholder="Ej. Encuesta de caracterización"
              />
            </Campo>

            <Campo label="Estado">
              <select
                value={form.activo ? "activo" : "inactivo"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    activo: e.target.value === "activo",
                  })
                }
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </Campo>

            <Campo label="Descripción" clase="span-2">
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  setForm({ ...form, descripcion: e.target.value })
                }
                placeholder="Describe el propósito del instrumento"
              />
            </Campo>
          </div>

          <div className="botones-form">
            {form.id && (
              <button
                type="button"
                className="btn secundario"
                onClick={() => setForm(formularioVacio)}
              >
                Cancelar
              </button>
            )}

            <button className="btn primario">
              {form.id ? "Guardar cambios" : "Crear instrumento"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Instrumentos creados</h2>
            <p>{datos.instrumentos.length} instrumento(s) registrado(s).</p>
          </div>
        </div>

        {datos.instrumentos.length === 0 ? (
          <Vacio texto="Todavía no has creado instrumentos." />
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {datos.instrumentos.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.nombre}</strong>
                    </td>
                    <td>{item.descripcion || "-"}</td>
                    <td>
                      <Badge activo={item.activo} />
                    </td>
                    <td>{formatearFecha(item.creado)}</td>
                    <td>
                      <div className="acciones-tabla">
                        <button
                          className="btn mini secundario"
                          onClick={() => editar(item)}
                        >
                          Editar
                        </button>

                        <button
                          className="btn mini peligro"
                          onClick={() => eliminar(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Ejes({ datos, setDatos }) {
  const formularioVacio = {
    id: "",
    instrumentoId: "",
    nombre: "",
    descripcion: "",
    orden: 1,
    activo: true,
  };

  const [form, setForm] = useState(formularioVacio);

  const guardar = (e) => {
    e.preventDefault();

    if (!form.instrumentoId || !form.nombre.trim()) {
      alert("Selecciona un instrumento y escribe el nombre del eje.");
      return;
    }

    if (form.id) {
      setDatos((anterior) => ({
        ...anterior,
        ejes: anterior.ejes.map((item) =>
          item.id === form.id
            ? {
                ...item,
                instrumentoId: form.instrumentoId,
                nombre: form.nombre.trim(),
                descripcion: form.descripcion.trim(),
                orden: Number(form.orden) || 1,
                activo: form.activo,
                modificado: fechaActual(),
              }
            : item
        ),
      }));
    } else {
      const nuevo = {
        id: crearId(),
        instrumentoId: form.instrumentoId,
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        orden: Number(form.orden) || 1,
        activo: form.activo,
        creado: fechaActual(),
        modificado: fechaActual(),
      };

      setDatos((anterior) => ({
        ...anterior,
        ejes: [...anterior.ejes, nuevo],
      }));
    }

    setForm(formularioVacio);
  };

  const editar = (item) => {
    setForm({
      id: item.id,
      instrumentoId: item.instrumentoId,
      nombre: item.nombre,
      descripcion: item.descripcion || "",
      orden: item.orden || 1,
      activo: item.activo,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = (id) => {
    const asociado = datos.preguntas.some((p) =>
      (p.ejesIds || []).includes(id)
    );

    if (asociado) {
      alert(
        "No puedes eliminar este eje porque tiene preguntas asociadas."
      );
      return;
    }

    if (!confirm("¿Deseas eliminar este eje temático?")) return;

    setDatos((anterior) => ({
      ...anterior,
      ejes: anterior.ejes.filter((e) => e.id !== id),
    }));
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Ejes temáticos"
        descripcion="Organiza las preguntas por áreas, dimensiones o categorías."
      />

      {datos.instrumentos.length === 0 && (
        <Mensaje>
          Primero debes crear al menos un instrumento en el módulo
          Instrumentos.
        </Mensaje>
      )}

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{form.id ? "Editar eje" : "Nuevo eje temático"}</h2>
            <p>Los ejes permiten organizar las preguntas del instrumento.</p>
          </div>
        </div>

        <form onSubmit={guardar}>
          <div className="form-grid">
            <Campo label="Instrumento" requerido>
              <select
                value={form.instrumentoId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    instrumentoId: e.target.value,
                  })
                }
              >
                <option value="">Seleccionar...</option>

                {datos.instrumentos.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nombre}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Nombre del eje" requerido>
              <input
                value={form.nombre}
                onChange={(e) =>
                  setForm({ ...form, nombre: e.target.value })
                }
                placeholder="Ej. Gestión institucional"
              />
            </Campo>

            <Campo label="Orden">
              <input
                type="number"
                min="1"
                value={form.orden}
                onChange={(e) =>
                  setForm({ ...form, orden: e.target.value })
                }
              />
            </Campo>

            <Campo label="Estado">
              <select
                value={form.activo ? "activo" : "inactivo"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    activo: e.target.value === "activo",
                  })
                }
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </Campo>

            <Campo label="Descripción" clase="span-2">
              <textarea
                value={form.descripcion}
                onChange={(e) =>
                  setForm({
                    ...form,
                    descripcion: e.target.value,
                  })
                }
                placeholder="Describe este eje temático"
              />
            </Campo>
          </div>

          <div className="botones-form">
            {form.id && (
              <button
                type="button"
                className="btn secundario"
                onClick={() => setForm(formularioVacio)}
              >
                Cancelar
              </button>
            )}

            <button className="btn primario">
              {form.id ? "Guardar cambios" : "Crear eje"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Ejes creados</h2>
            <p>{datos.ejes.length} eje(s) registrado(s).</p>
          </div>
        </div>

        {datos.ejes.length === 0 ? (
          <Vacio texto="Todavía no existen ejes temáticos." />
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Eje</th>
                  <th>Instrumento</th>
                  <th>Preguntas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {[...datos.ejes]
                  .sort((a, b) => a.orden - b.orden)
                  .map((item) => {
                    const instrumento = datos.instrumentos.find(
                      (i) => i.id === item.instrumentoId
                    );

                    const cantidad = datos.preguntas.filter((p) =>
                      (p.ejesIds || []).includes(item.id)
                    ).length;

                    return (
                      <tr key={item.id}>
                        <td>{item.orden}</td>
                        <td>
                          <strong>{item.nombre}</strong>
                          <div className="texto-pequeno">
                            {item.descripcion}
                          </div>
                        </td>
                        <td>{instrumento?.nombre || "-"}</td>
                        <td>{cantidad}</td>
                        <td>
                          <Badge activo={item.activo} />
                        </td>
                        <td>
                          <div className="acciones-tabla">
                            <button
                              className="btn mini secundario"
                              onClick={() => editar(item)}
                            >
                              Editar
                            </button>

                            <button
                              className="btn mini peligro"
                              onClick={() => eliminar(item.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Preguntas({ datos, setDatos }) {
  const formularioVacio = {
    id: "",
    instrumentoId: "",
    codigo: "",
    texto: "",
    ejesIds: [],
    subeje: "",
    tipo: "texto_corto",
    ayuda: "",
    obligatoria: false,
    opcionesTexto: "",
    orden: 1,
    activa: true,
  };

  const [form, setForm] = useState(formularioVacio);
  const [filtroInstrumento, setFiltroInstrumento] = useState("");

  const ejesDisponibles = datos.ejes
    .filter((e) => e.instrumentoId === form.instrumentoId)
    .sort((a, b) => a.orden - b.orden);

  const necesitaOpciones = [
    "seleccion_unica",
    "seleccion_multiple",
    "lista",
  ].includes(form.tipo);

  const guardar = (e) => {
    e.preventDefault();

    if (
      !form.instrumentoId ||
      !form.codigo.trim() ||
      !form.texto.trim()
    ) {
      alert(
        "Selecciona el instrumento y completa código y texto de la pregunta."
      );
      return;
    }

    if (form.ejesIds.length === 0) {
      alert("Asigna la pregunta al menos a un eje temático.");
      return;
    }

    const codigoRepetido = datos.preguntas.some(
      (p) =>
        p.codigo.trim().toLowerCase() ===
          form.codigo.trim().toLowerCase() &&
        p.instrumentoId === form.instrumentoId &&
        p.id !== form.id
    );

    if (codigoRepetido) {
      alert("Ya existe una pregunta con ese código en este instrumento.");
      return;
    }

    const opciones = form.opcionesTexto
      .split("\n")
      .map((o) => o.trim())
      .filter(Boolean);

    if (necesitaOpciones && opciones.length < 2) {
      alert("Agrega al menos dos opciones de respuesta.");
      return;
    }

    const informacion = {
      instrumentoId: form.instrumentoId,
      codigo: form.codigo.trim(),
      texto: form.texto.trim(),
      ejesIds: form.ejesIds,
      subeje: form.subeje.trim(),
      tipo: form.tipo,
      ayuda: form.ayuda.trim(),
      obligatoria: form.obligatoria,
      opciones,
      orden: Number(form.orden) || 1,
      activa: form.activa,
      modificado: fechaActual(),
    };

    if (form.id) {
      setDatos((anterior) => ({
        ...anterior,
        preguntas: anterior.preguntas.map((p) =>
          p.id === form.id ? { ...p, ...informacion } : p
        ),
      }));
    } else {
      setDatos((anterior) => ({
        ...anterior,
        preguntas: [
          ...anterior.preguntas,
          {
            id: crearId(),
            ...informacion,
            creado: fechaActual(),
          },
        ],
      }));
    }

    setForm(formularioVacio);
  };

  const cambiarEje = (id, seleccionado) => {
    if (seleccionado) {
      setForm({
        ...form,
        ejesIds: [...new Set([...form.ejesIds, id])],
      });
    } else {
      setForm({
        ...form,
        ejesIds: form.ejesIds.filter((ejeId) => ejeId !== id),
      });
    }
  };

  const editar = (p) => {
    setForm({
      id: p.id,
      instrumentoId: p.instrumentoId,
      codigo: p.codigo,
      texto: p.texto,
      ejesIds: p.ejesIds || [],
      subeje: p.subeje || "",
      tipo: p.tipo,
      ayuda: p.ayuda || "",
      obligatoria: p.obligatoria,
      opcionesTexto: (p.opciones || []).join("\n"),
      orden: p.orden || 1,
      activa: p.activa,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = (id) => {
    const usada = datos.registros.some(
      (r) =>
        r.respuestas &&
        Object.prototype.hasOwnProperty.call(r.respuestas, id)
    );

    if (usada) {
      alert(
        "Esta pregunta ya tiene respuestas registradas. Puedes desactivarla en lugar de eliminarla."
      );
      return;
    }

    if (!confirm("¿Deseas eliminar esta pregunta?")) return;

    setDatos((anterior) => ({
      ...anterior,
      preguntas: anterior.preguntas.filter((p) => p.id !== id),
    }));
  };

  const preguntasFiltradas = [...datos.preguntas]
    .filter(
      (p) =>
        !filtroInstrumento ||
        p.instrumentoId === filtroInstrumento
    )
    .sort((a, b) => a.orden - b.orden);

  return (
    <div>
      <EncabezadoPagina
        titulo="Preguntas"
        descripcion="Crea, edita, elimina y organiza las preguntas dinámicamente."
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{form.id ? "Editar pregunta" : "Nueva pregunta"}</h2>
            <p>
              El tipo seleccionado determinará automáticamente el campo que
              verá el usuario.
            </p>
          </div>
        </div>

        <form onSubmit={guardar}>
          <div className="form-grid">
            <Campo label="Instrumento" requerido>
              <select
                value={form.instrumentoId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    instrumentoId: e.target.value,
                    ejesIds: [],
                  })
                }
              >
                <option value="">Seleccionar...</option>

                {datos.instrumentos.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.nombre}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Código de pregunta" requerido>
              <input
                value={form.codigo}
                onChange={(e) =>
                  setForm({ ...form, codigo: e.target.value })
                }
                placeholder="Ej. P01"
              />
            </Campo>

            <Campo label="Texto de la pregunta" requerido clase="span-2">
              <textarea
                value={form.texto}
                onChange={(e) =>
                  setForm({ ...form, texto: e.target.value })
                }
                placeholder="Escribe la pregunta"
              />
            </Campo>

            <Campo label="Tipo de pregunta">
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm({ ...form, tipo: e.target.value })
                }
              >
                {tiposPregunta.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </Campo>

            <Campo label="Subeje o categoría">
              <input
                value={form.subeje}
                onChange={(e) =>
                  setForm({ ...form, subeje: e.target.value })
                }
                placeholder="Opcional"
              />
            </Campo>

            <Campo label="Orden">
              <input
                type="number"
                min="1"
                value={form.orden}
                onChange={(e) =>
                  setForm({ ...form, orden: e.target.value })
                }
              />
            </Campo>

            <Campo label="Estado">
              <select
                value={form.activa ? "activa" : "inactiva"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    activa: e.target.value === "activa",
                  })
                }
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </select>
            </Campo>

            <Campo label="Descripción o ayuda" clase="span-2">
              <textarea
                value={form.ayuda}
                onChange={(e) =>
                  setForm({ ...form, ayuda: e.target.value })
                }
                placeholder="Texto de ayuda para quien diligencia"
              />
            </Campo>

            <Campo label="Ejes temáticos" requerido clase="span-2">
              {form.instrumentoId ? (
                ejesDisponibles.length > 0 ? (
                  <div className="checks">
                    {ejesDisponibles.map((eje) => (
                      <label className="check-item" key={eje.id}>
                        <input
                          type="checkbox"
                          checked={form.ejesIds.includes(eje.id)}
                          onChange={(e) =>
                            cambiarEje(eje.id, e.target.checked)
                          }
                        />
                        {eje.nombre}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="texto-ayuda">
                    Este instrumento todavía no tiene ejes temáticos.
                  </p>
                )
              ) : (
                <p className="texto-ayuda">
                  Selecciona primero un instrumento.
                </p>
              )}
            </Campo>

            {necesitaOpciones && (
              <Campo
                label="Opciones de respuesta"
                clase="span-2"
                requerido
              >
                <textarea
                  value={form.opcionesTexto}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      opcionesTexto: e.target.value,
                    })
                  }
                  placeholder={
                    "Escribe una opción por línea.\nEjemplo:\nOpción 1\nOpción 2\nOpción 3"
                  }
                />
              </Campo>
            )}

            <Campo label="Configuración" clase="span-2">
              <label className="check-item destacado">
                <input
                  type="checkbox"
                  checked={form.obligatoria}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      obligatoria: e.target.checked,
                    })
                  }
                />
                Esta pregunta es obligatoria
              </label>
            </Campo>
          </div>

          <div className="botones-form">
            {form.id && (
              <button
                type="button"
                className="btn secundario"
                onClick={() => setForm(formularioVacio)}
              >
                Cancelar
              </button>
            )}

            <button className="btn primario">
              {form.id ? "Guardar cambios" : "Crear pregunta"}
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Banco de preguntas</h2>
            <p>{preguntasFiltradas.length} pregunta(s).</p>
          </div>

          <select
            className="filtro"
            value={filtroInstrumento}
            onChange={(e) => setFiltroInstrumento(e.target.value)}
          >
            <option value="">Todos los instrumentos</option>

            {datos.instrumentos.map((i) => (
              <option value={i.id} key={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        </div>

        {preguntasFiltradas.length === 0 ? (
          <Vacio texto="Todavía no existen preguntas." />
        ) : (
          <div className="lista-preguntas">
            {preguntasFiltradas.map((p) => {
              const instrumento = datos.instrumentos.find(
                (i) => i.id === p.instrumentoId
              );

              const ejesPregunta = datos.ejes.filter((e) =>
                (p.ejesIds || []).includes(e.id)
              );

              return (
                <article className="pregunta-card" key={p.id}>
                  <div className="pregunta-cabecera">
                    <div>
                      <span className="codigo">{p.codigo}</span>
                      <span className="tipo">
                        {tiposPregunta.find(
                          (tipo) => tipo.value === p.tipo
                        )?.label || p.tipo}
                      </span>
                    </div>

                    <Badge activo={p.activa} />
                  </div>

                  <h3>{p.texto}</h3>

                  <p className="texto-pequeno">
                    <b>Instrumento:</b> {instrumento?.nombre || "-"}
                  </p>

                  <div className="chips">
                    {ejesPregunta.map((e) => (
                      <span className="chip" key={e.id}>
                        {e.nombre}
                      </span>
                    ))}
                  </div>

                  {p.obligatoria && (
                    <div className="obligatoria">Obligatoria</div>
                  )}

                  <div className="acciones-tabla">
                    <button
                      className="btn mini secundario"
                      onClick={() => editar(p)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn mini peligro"
                      onClick={() => eliminar(p.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function Captura({ datos, setDatos }) {
  const [instrumentoId, setInstrumentoId] = useState("");
  const [identificador, setIdentificador] = useState("");
  const [respuestas, setRespuestas] = useState({});

  const preguntas = useMemo(
    () =>
      datos.preguntas
        .filter(
          (p) => p.instrumentoId === instrumentoId && p.activa
        )
        .sort((a, b) => a.orden - b.orden),
    [datos.preguntas, instrumentoId]
  );

  const instrumento = datos.instrumentos.find(
    (i) => i.id === instrumentoId
  );

  const actualizarRespuesta = (preguntaId, valor) => {
    setRespuestas((anterior) => ({
      ...anterior,
      [preguntaId]: valor,
    }));
  };

  const enviar = (e) => {
    e.preventDefault();

    if (!instrumentoId) {
      alert("Selecciona un instrumento.");
      return;
    }

    if (preguntas.length === 0) {
      alert("Este instrumento no tiene preguntas activas.");
      return;
    }

    const faltantes = preguntas.filter((p) => {
      if (!p.obligatoria) return false;

      const valor = respuestas[p.id];

      return (
        valor === undefined ||
        valor === null ||
        valor === "" ||
        (Array.isArray(valor) && valor.length === 0)
      );
    });

    if (faltantes.length > 0) {
      alert(
        `Debes responder las preguntas obligatorias: ${faltantes
          .map((p) => p.codigo)
          .join(", ")}`
      );
      return;
    }

    const nuevoRegistro = {
      id: crearId(),
      instrumentoId,
      identificador:
        identificador.trim() ||
        `Registro ${datos.registros.length + 1}`,
      respuestas,
      fecha: fechaActual(),
    };

    setDatos((anterior) => ({
      ...anterior,
      registros: [...anterior.registros, nuevoRegistro],
    }));

    setIdentificador("");
    setRespuestas({});

    alert("Información guardada correctamente.");
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Capturar información"
        descripcion="Diligencia los instrumentos configurados en el sistema."
      />

      <section className="panel">
        <Campo label="Seleccionar instrumento">
          <select
            value={instrumentoId}
            onChange={(e) => {
              setInstrumentoId(e.target.value);
              setRespuestas({});
            }}
          >
            <option value="">Seleccionar...</option>

            {datos.instrumentos
              .filter((i) => i.activo)
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre}
                </option>
              ))}
          </select>
        </Campo>
      </section>

      {instrumentoId && (
        <form onSubmit={enviar}>
          <section className="panel formulario-captura">
            <div className="cabecera-formulario">
              <span>Instrumento</span>
              <h2>{instrumento?.nombre}</h2>
              <p>{instrumento?.descripcion}</p>
            </div>

            <Campo label="Identificación del registro">
              <input
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
                placeholder="Ej. Entidad 001, Persona 25..."
              />
            </Campo>

            {preguntas.length === 0 ? (
              <Vacio texto="Este instrumento no tiene preguntas activas." />
            ) : (
              preguntas.map((pregunta, indice) => (
                <div className="campo-pregunta" key={pregunta.id}>
                  <div className="numero-pregunta">{indice + 1}</div>

                  <div className="contenido-pregunta">
                    <label>
                      <span className="codigo-inline">
                        {pregunta.codigo}
                      </span>

                      {pregunta.texto}

                      {pregunta.obligatoria && (
                        <span className="asterisco">*</span>
                      )}
                    </label>

                    {pregunta.ayuda && (
                      <p className="ayuda-pregunta">
                        {pregunta.ayuda}
                      </p>
                    )}

                    <CampoRespuesta
                      pregunta={pregunta}
                      valor={respuestas[pregunta.id]}
                      onChange={(valor) =>
                        actualizarRespuesta(pregunta.id, valor)
                      }
                    />
                  </div>
                </div>
              ))
            )}

            {preguntas.length > 0 && (
              <div className="botones-form">
                <button className="btn primario grande">
                  Guardar respuestas
                </button>
              </div>
            )}
          </section>
        </form>
      )}
    </div>
  );
}

function CampoRespuesta({ pregunta, valor, onChange }) {
  switch (pregunta.tipo) {
    case "texto_largo":
      return (
        <textarea
          value={valor || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu respuesta"
        />
      );

    case "numero":
      return (
        <input
          type="number"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
        />
      );

    case "porcentaje":
      return (
        <div className="input-sufijo">
          <input
            type="number"
            min="0"
            max="100"
            value={valor ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <span>%</span>
        </div>
      );

    case "fecha":
      return (
        <input
          type="date"
          value={valor || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "seleccion_unica":
      return (
        <div className="opciones">
          {(pregunta.opciones || []).map((opcion) => (
            <label className="opcion" key={opcion}>
              <input
                type="radio"
                name={pregunta.id}
                checked={valor === opcion}
                onChange={() => onChange(opcion)}
              />
              {opcion}
            </label>
          ))}
        </div>
      );

    case "seleccion_multiple":
      return (
        <div className="opciones">
          {(pregunta.opciones || []).map((opcion) => {
            const seleccionadas = Array.isArray(valor) ? valor : [];
            const marcado = seleccionadas.includes(opcion);

            return (
              <label className="opcion" key={opcion}>
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...seleccionadas, opcion]);
                    } else {
                      onChange(
                        seleccionadas.filter((o) => o !== opcion)
                      );
                    }
                  }}
                />
                {opcion}
              </label>
            );
          })}
        </div>
      );

    case "lista":
      return (
        <select
          value={valor || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Seleccionar...</option>

          {(pregunta.opciones || []).map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      );

    case "escala":
      return (
        <div className="escala">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              className={String(valor) === String(n) ? "seleccionado" : ""}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      );

    case "si_no":
      return (
        <div className="opciones horizontal">
          {["Sí", "No"].map((opcion) => (
            <label className="opcion" key={opcion}>
              <input
                type="radio"
                name={pregunta.id}
                checked={valor === opcion}
                onChange={() => onChange(opcion)}
              />
              {opcion}
            </label>
          ))}
        </div>
      );

    case "verdadero_falso":
      return (
        <div className="opciones horizontal">
          {["Verdadero", "Falso"].map((opcion) => (
            <label className="opcion" key={opcion}>
              <input
                type="radio"
                name={pregunta.id}
                checked={valor === opcion}
                onChange={() => onChange(opcion)}
              />
              {opcion}
            </label>
          ))}
        </div>
      );

    case "calificacion":
      return (
        <div className="escala escala-10">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              type="button"
              key={n}
              className={String(valor) === String(n) ? "seleccionado" : ""}
              onClick={() => onChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      );

    default:
      return (
        <input
          value={valor || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu respuesta"
        />
      );
  }
}

function Registros({ datos, setDatos }) {
  const [instrumentoId, setInstrumentoId] = useState("");

  const registros = datos.registros
    .filter(
      (r) => !instrumentoId || r.instrumentoId === instrumentoId
    )
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  const eliminar = (id) => {
    if (!confirm("¿Deseas eliminar este registro?")) return;

    setDatos((anterior) => ({
      ...anterior,
      registros: anterior.registros.filter((r) => r.id !== id),
    }));
  };

  const exportarCSV = () => {
    if (registros.length === 0) {
      alert("No existen registros para exportar.");
      return;
    }

    const preguntas = datos.preguntas.filter(
      (p) =>
        !instrumentoId || p.instrumentoId === instrumentoId
    );

    const encabezado = [
      "Registro",
      "Instrumento",
      "Fecha",
      ...preguntas.map((p) => `${p.codigo} - ${p.texto}`),
    ];

    const filas = registros.map((registro) => {
      const instrumento = datos.instrumentos.find(
        (i) => i.id === registro.instrumentoId
      );

      return [
        registro.identificador,
        instrumento?.nombre || "",
        formatearFecha(registro.fecha),
        ...preguntas.map((p) => {
          const valor = registro.respuestas?.[p.id];

          if (Array.isArray(valor)) return valor.join(" | ");

          return valor ?? "";
        }),
      ];
    });

    const escapar = (valor) =>
      `"${String(valor).replaceAll('"', '""')}"`;

    const csv = [encabezado, ...filas]
      .map((fila) => fila.map(escapar).join(";"))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "registros.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <EncabezadoPagina
        titulo="Registros"
        descripcion="Consulta y administra la información capturada."
      />

      <section className="panel">
        <div className="barra-filtros">
          <Campo label="Filtrar por instrumento">
            <select
              value={instrumentoId}
              onChange={(e) => setInstrumentoId(e.target.value)}
            >
              <option value="">Todos</option>

              {datos.instrumentos.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.nombre}
                </option>
              ))}
            </select>
          </Campo>

          <button className="btn primario" onClick={exportarCSV}>
            Exportar CSV
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Información registrada</h2>
            <p>{registros.length} registro(s) encontrado(s).</p>
          </div>
        </div>

        {registros.length === 0 ? (
          <Vacio texto="Todavía no se han almacenado respuestas." />
        ) : (
          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Registro</th>
                  <th>Instrumento</th>
                  <th>Fecha</th>
                  <th>Respuestas</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {registros.map((r) => {
                  const instrumento = datos.instrumentos.find(
                    (i) => i.id === r.instrumentoId
                  );

                  return (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.identificador}</strong>
                      </td>
                      <td>{instrumento?.nombre || "-"}</td>
                      <td>{formatearFecha(r.fecha)}</td>
                      <td>{Object.keys(r.respuestas || {}).length}</td>
                      <td>
                        <button
                          className="btn mini peligro"
                          onClick={() => eliminar(r.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Analisis({ datos }) {
  const [instrumentoId, setInstrumentoId] = useState("");

  const preguntas = datos.preguntas.filter(
    (p) => p.instrumentoId === instrumentoId && p.activa
  );

  const registros = datos.registros.filter(
    (r) => r.instrumentoId === instrumentoId
  );

  const ejes = datos.ejes
    .filter((e) => e.instrumentoId === instrumentoId)
    .sort((a, b) => a.orden - b.orden);

  const totalPosibles = preguntas.length * registros.length;

  const totalRespondidas = registros.reduce((total, registro) => {
    return (
      total +
      preguntas.filter((p) => {
        const valor = registro.respuestas?.[p.id];

        return (
          valor !== undefined &&
          valor !== null &&
          valor !== "" &&
          (!Array.isArray(valor) || valor.length > 0)
        );
      }).length
    );
  }, 0);

  const completitud =
    totalPosibles > 0
      ? Math.round((totalRespondidas / totalPosibles) * 100)
      : 0;

  return (
    <div>
      <EncabezadoPagina
        titulo="Análisis y dashboard"
        descripcion="Consulta indicadores generales y resultados por eje temático."
      />

      <section className="panel">
        <Campo label="Seleccionar instrumento">
          <select
            value={instrumentoId}
            onChange={(e) => setInstrumentoId(e.target.value)}
          >
            <option value="">Seleccionar...</option>

            {datos.instrumentos.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        </Campo>
      </section>

      {instrumentoId && (
        <>
          <div className="tarjetas">
            <TarjetaDato
              titulo="Registros"
              valor={registros.length}
              icono="☷"
            />

            <TarjetaDato
              titulo="Preguntas"
              valor={preguntas.length}
              icono="?"
            />

            <TarjetaDato
              titulo="Ejes"
              valor={ejes.length}
              icono="◫"
            />

            <TarjetaDato
              titulo="Completitud"
              valor={`${completitud}%`}
              icono="%"
            />
          </div>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Resultados por eje temático</h2>
                <p>
                  Porcentaje de respuestas diligenciadas respecto al total
                  esperado.
                </p>
              </div>
            </div>

            {ejes.length === 0 ? (
              <Vacio texto="No existen ejes para este instrumento." />
            ) : (
              <div className="grafico-lista">
                {ejes.map((eje) => {
                  const preguntasEje = preguntas.filter((p) =>
                    (p.ejesIds || []).includes(eje.id)
                  );

                  const posibles =
                    preguntasEje.length * registros.length;

                  let respondidas = 0;

                  registros.forEach((registro) => {
                    preguntasEje.forEach((p) => {
                      const valor = registro.respuestas?.[p.id];

                      if (
                        valor !== undefined &&
                        valor !== null &&
                        valor !== "" &&
                        (!Array.isArray(valor) || valor.length > 0)
                      ) {
                        respondidas++;
                      }
                    });
                  });

                  const porcentaje =
                    posibles > 0
                      ? Math.round((respondidas / posibles) * 100)
                      : 0;

                  return (
                    <div className="grafico-item" key={eje.id}>
                      <div className="grafico-titulo">
                        <span>{eje.nombre}</span>
                        <strong>{porcentaje}%</strong>
                      </div>

                      <div className="barra">
                        <div
                          className="barra-valor"
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>

                      <div className="texto-pequeno">
                        {preguntasEje.length} pregunta(s)
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Campo({ label, children, requerido = false, clase = "" }) {
  return (
    <div className={`campo ${clase}`}>
      <label>
        {label}
        {requerido && <span className="asterisco"> *</span>}
      </label>

      {children}
    </div>
  );
}

function Badge({ activo }) {
  return (
    <span className={`badge ${activo ? "verde" : "gris"}`}>
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

function Vacio({ texto }) {
  return (
    <div className="vacio">
      <div>◇</div>
      <strong>Sin información</strong>
      <span>{texto}</span>
    </div>
  );
}

function Mensaje({ children }) {
  return <div className="mensaje">{children}</div>;
}

const estilos = `
* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color: #172033;
  background: #f4f7fb;
  font-synthesis: none;
}

body {
  margin: 0;
  min-width: 320px;
  background: #f4f7fb;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app {
  min-height: 100vh;
}

.topbar {
  height: 76px;
  position: fixed;
  left: 250px;
  right: 0;
  top: 0;
  z-index: 30;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #e7ebf1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  backdrop-filter: blur(12px);
}

.topbar h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 750;
}

.topbar p {
  margin: 3px 0 0;
  color: #7a8598;
  font-size: 12px;
}

.topbar-badge {
  background: #eef4ff;
  color: #315fba;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.menu-mobile {
  display: none;
  border: 0;
  background: #f0f3f8;
  width: 42px;
  height: 42px;
  border-radius: 10px;
}

.sidebar {
  width: 250px;
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 40;
  background: #17233b;
  color: white;
  display: flex;
  flex-direction: column;
}

.logo-area {
  height: 76px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.logo {
  width: 41px;
  height: 41px;
  border-radius: 12px;
  background: linear-gradient(135deg, #5f82ff, #32a7d6);
  display: grid;
  place-items: center;
  font-weight: 800;
}

.logo-area strong {
  display: block;
  font-size: 15px;
}

.logo-area span {
  color: #9eabc0;
  font-size: 10px;
}

.sidebar nav {
  padding: 18px 12px;
  flex: 1;
}

.menu-item {
  border: 0;
  width: 100%;
  color: #b9c3d4;
  background: transparent;
  padding: 12px 14px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  margin-bottom: 4px;
  transition: 0.2s;
}

.menu-item:hover {
  background: rgba(255,255,255,.06);
  color: white;
}

.menu-item.activo {
  background: #315fba;
  color: white;
}

.menu-icono {
  width: 22px;
  text-align: center;
  font-weight: 800;
}

.sidebar-footer {
  padding: 16px 20px;
  color: #8794a9;
  font-size: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.contenido {
  padding: 105px 28px 50px;
  margin-left: 250px;
  max-width: 1700px;
}

.encabezado-pagina {
  margin-bottom: 24px;
}

.encabezado-pagina h2 {
  margin: 0;
  font-size: 26px;
}

.encabezado-pagina p {
  margin: 6px 0 0;
  color: #778196;
  font-size: 14px;
}

.tarjetas {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.tarjeta-dato {
  background: white;
  border: 1px solid #e7ebf1;
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 18px rgba(35, 48, 76, 0.04);
}

.tarjeta-icono {
  width: 45px;
  height: 45px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: #edf3ff;
  color: #315fba;
  font-weight: 800;
  font-size: 20px;
}

.tarjeta-dato span {
  color: #778196;
  font-size: 12px;
  display: block;
}

.tarjeta-dato strong {
  display: block;
  margin-top: 2px;
  font-size: 24px;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.panel {
  background: white;
  border: 1px solid #e5eaf1;
  border-radius: 14px;
  padding: 22px;
  margin-bottom: 20px;
  box-shadow: 0 5px 22px rgba(30, 46, 75, 0.04);
}

.panel-header {
  display: flex;
  gap: 15px;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.panel-header h2 {
  margin: 0;
  font-size: 17px;
}

.panel-header p {
  margin: 5px 0 0;
  color: #7c879a;
  font-size: 12px;
}

.acciones {
  display: grid;
  gap: 10px;
}

.accion {
  width: 100%;
  border: 1px solid #e7ebf1;
  background: #fafbfd;
  padding: 14px;
  border-radius: 11px;
  display: flex;
  gap: 14px;
  text-align: left;
  color: #28354a;
}

.accion:hover {
  background: #f4f7ff;
  border-color: #cad8f5;
}

.accion strong {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 50%;
  background: #315fba;
  color: white;
  display: grid;
  place-items: center;
}

.accion span {
  font-size: 12px;
  color: #738096;
}

.accion b {
  display: block;
  color: #26334a;
  font-size: 13px;
  margin-bottom: 2px;
}

.estado-lista {
  display: grid;
  gap: 8px;
}

.estado {
  display: flex;
  justify-content: space-between;
  padding: 13px 0;
  border-bottom: 1px solid #edf0f4;
  font-size: 13px;
}

.estado:last-child {
  border-bottom: 0;
}

.estado span {
  color: #727e92;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.span-2 {
  grid-column: span 2;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.campo > label {
  font-size: 12px;
  font-weight: 700;
  color: #455066;
}

input,
textarea,
select {
  width: 100%;
  background: white;
  border: 1px solid #dfe4ec;
  color: #26334a;
  border-radius: 9px;
  padding: 11px 12px;
  outline: none;
  transition: 0.2s;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #5f82d8;
  box-shadow: 0 0 0 3px rgba(49, 95, 186, 0.09);
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.botones-form {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  border: 0;
  padding: 10px 15px;
  border-radius: 9px;
  font-weight: 700;
  font-size: 12px;
}

.btn.primario {
  color: white;
  background: #315fba;
}

.btn.primario:hover {
  background: #274f9d;
}

.btn.secundario {
  background: #edf1f6;
  color: #455168;
}

.btn.peligro {
  background: #fff0f0;
  color: #c34848;
}

.btn.mini {
  padding: 7px 10px;
  font-size: 11px;
}

.btn.grande {
  padding: 12px 22px;
  font-size: 13px;
}

.tabla-contenedor {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
}

th {
  background: #f8fafc;
  color: #667187;
  padding: 11px 12px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: left;
}

td {
  padding: 13px 12px;
  border-bottom: 1px solid #edf0f4;
  font-size: 12px;
  vertical-align: top;
}

.acciones-tabla {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  padding: 5px 9px;
  font-size: 10px;
  border-radius: 999px;
  font-weight: 700;
}

.badge.verde {
  background: #e9f8f0;
  color: #27875b;
}

.badge.gris {
  background: #eef0f3;
  color: #778094;
}

.texto-pequeno {
  color: #7c8799;
  font-size: 11px;
  margin-top: 4px;
}

.texto-ayuda {
  margin: 0;
  font-size: 12px;
  color: #7d889a;
}

.checks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.check-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 11px;
  background: #f7f9fc;
  border: 1px solid #e6eaf0;
  border-radius: 8px;
  font-size: 12px;
}

.check-item input,
.opcion input {
  width: auto;
}

.check-item.destacado {
  background: #eef4ff;
}

.lista-preguntas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.pregunta-card {
  border: 1px solid #e5eaf1;
  border-radius: 12px;
  padding: 17px;
}

.pregunta-card h3 {
  font-size: 14px;
  line-height: 1.45;
  margin: 12px 0;
}

.pregunta-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.codigo,
.tipo {
  display: inline-flex;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 9px;
  font-weight: 800;
}

.codigo {
  color: #315fba;
  background: #edf3ff;
  margin-right: 5px;
}

.tipo {
  color: #766026;
  background: #fff8de;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
}

.chip {
  font-size: 9px;
  border-radius: 999px;
  background: #f0f2f6;
  padding: 5px 8px;
  color: #566177;
}

.obligatoria {
  color: #b95656;
  font-size: 10px;
  font-weight: 700;
  margin: 8px 0;
}

.filtro {
  width: auto;
  min-width: 210px;
}

.mensaje {
  background: #fff8df;
  color: #755e20;
  border: 1px solid #f2df9c;
  border-radius: 10px;
  padding: 13px 15px;
  font-size: 12px;
  margin-bottom: 17px;
}

.vacio {
  padding: 35px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #8a95a6;
}

.vacio div {
  font-size: 32px;
}

.vacio strong {
  color: #566176;
  font-size: 13px;
}

.vacio span {
  font-size: 11px;
}

.cabecera-formulario {
  border-bottom: 1px solid #e8ecf2;
  margin-bottom: 20px;
  padding-bottom: 18px;
}

.cabecera-formulario > span {
  color: #315fba;
  text-transform: uppercase;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .08em;
}

.cabecera-formulario h2 {
  margin: 5px 0;
  font-size: 21px;
}

.cabecera-formulario p {
  color: #788397;
  font-size: 12px;
  margin: 0;
}

.campo-pregunta {
  display: flex;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid #edf0f4;
}

.numero-pregunta {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eef4ff;
  color: #315fba;
  flex: none;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
}

.contenido-pregunta {
  flex: 1;
  min-width: 0;
}

.contenido-pregunta > label {
  display: block;
  font-weight: 700;
  font-size: 13px;
  margin: 6px 0 6px;
}

.codigo-inline {
  color: #315fba;
  margin-right: 7px;
  font-size: 10px;
}

.asterisco {
  color: #d14f4f;
}

.ayuda-pregunta {
  font-size: 11px;
  color: #808b9e;
  margin: 0 0 11px;
}

.opciones {
  display: grid;
  gap: 7px;
}

.opciones.horizontal {
  display: flex;
  flex-wrap: wrap;
}

.opcion {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fafbfc;
  border: 1px solid #e6eaf0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 12px;
}

.escala {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.escala button {
  border: 1px solid #dde3ec;
  background: white;
  width: 40px;
  height: 40px;
  border-radius: 9px;
  color: #58647a;
}

.escala button.seleccionado {
  background: #315fba;
  color: white;
  border-color: #315fba;
}

.input-sufijo {
  display: flex;
  align-items: center;
}

.input-sufijo input {
  border-radius: 9px 0 0 9px;
}

.input-sufijo span {
  padding: 11px 14px;
  border: 1px solid #dfe4ec;
  border-left: 0;
  background: #f5f7fa;
  border-radius: 0 9px 9px 0;
}

.barra-filtros {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  justify-content: space-between;
}

.barra-filtros .campo {
  width: min(400px, 100%);
}

.grafico-lista {
  display: grid;
  gap: 21px;
}

.grafico-titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 7px;
}

.barra {
  height: 12px;
  width: 100%;
  background: #edf0f5;
  border-radius: 999px;
  overflow: hidden;
}

.barra-valor {
  height: 100%;
  background: linear-gradient(90deg, #315fba, #5598da);
  border-radius: inherit;
  transition: width .4s;
}

@media (max-width: 1050px) {
  .tarjetas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }

  .lista-preguntas {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .topbar {
    left: 0;
    height: 68px;
    padding: 0 14px;
    gap: 10px;
  }

  .topbar h1 {
    font-size: 14px;
  }

  .topbar p,
  .topbar-badge {
    display: none;
  }

  .menu-mobile {
    display: block;
    flex: none;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: .25s ease;
    width: 260px;
    box-shadow: 10px 0 30px rgba(0,0,0,.15);
  }

  .sidebar.abierto {
    transform: translateX(0);
  }

  .contenido {
    margin-left: 0;
    padding: 91px 14px 35px;
  }

  .encabezado-pagina h2 {
    font-size: 21px;
  }

  .tarjetas {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .tarjeta-dato {
    padding: 13px;
    gap: 9px;
  }

  .tarjeta-icono {
    width: 38px;
    height: 38px;
    font-size: 16px;
  }

  .tarjeta-dato strong {
    font-size: 19px;
  }

  .tarjeta-dato span {
    font-size: 10px;
  }

  .panel {
    padding: 16px;
    border-radius: 12px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .span-2 {
    grid-column: span 1;
  }

  .panel-header {
    flex-direction: column;
  }

  .filtro {
    width: 100%;
  }

  .campo-pregunta {
    gap: 9px;
  }

  .numero-pregunta {
    width: 27px;
    height: 27px;
  }

  .barra-filtros {
    flex-direction: column;
    align-items: stretch;
  }

  .barra-filtros .campo {
    width: 100%;
  }
}

@media (max-width: 420px) {
  .tarjetas {
    grid-template-columns: 1fr;
  }
}
`;

export default App;