import "./Home.module.css";
import React, { useEffect, useState } from "react";
import InputData from "../InputData/InputData";
import { initData } from "../../scripts/intialValues";
import { row } from "../../scripts/row";
import Tabla from "../Tabla/Tabla";

function Home() {
  const [voltageOp, setVoltageOp] = useState([]);
  const [datos, setDatos] = useState(initData);
  const [rows, setRows] = useState([]);

  const handleForm = (e) => {
    const { id, value } = e.target;
    const floatValue = [
      "potencia",
      "factor",
      "fases",
      "voltaje",
      "distancia",
    ].includes(id)
      ? parseFloat(value)
      : value;
    const newDatos = { ...datos, [id]: floatValue };
    setDatos(newDatos);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRow = row(
      datos.desc,
      datos.potencia,
      datos.unidades,
      datos.factor,
      datos.fases,
      datos.voltaje,
      datos.distancia
    );
    setRows([...rows, newRow]);
  };

  useEffect(() => {
    console.log(datos);
    const newVoltageOp =
      datos.fases === 1 ? [108, 123.5, 127] : [208, 214, 220];
    setVoltageOp(newVoltageOp);
  }, [datos]);

  return (
    <div className="Home">
      <header>
        <h1>Proytecto Final</h1>
      </header>
      <main>
        <>
          <InputData
            onChange={handleForm}
            onSubmit={handleSubmit}
            voltageOp={voltageOp}
          />
        </>
        <>
          <Tabla trows={rows} />
        </>
      </main>
      <footer></footer>
    </div>
  );
}

export default Home;
