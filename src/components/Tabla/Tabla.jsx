import "./Tabla.css";

function Tabla(props) {
  const headed = [
    "Descripcion",
    "Carga (VA)",
    "Voltaje (V)",
    "Corriente (A)",
    "PTM (A)",
    "DT (m)",
    "F",
    "N",
    "T",
    "CT (%)",
    `PVC (")`,
    `EMT (")`,
    "NC",
  ];

  return (
    <div className="tabla_container">
      <h3>Cuadro de cargas</h3>
      <table className="tabla">
        <thead>
          <tr>
            {headed.map((th, key) => (
              <th key={key}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.trows.map((tr, key) => (
            <tr key={key}>
              {tr.map((td, key) => (
                <td key={key}>{td}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Tabla;
