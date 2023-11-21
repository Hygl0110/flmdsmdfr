//imports
import "./Home.module.css";
import React, { useEffect, useState } from "react";
import InputData from "../InputData/InputData";
import Tabla from "../Tabla/Tabla";
import { row } from "../../scripts/row";
import { data } from "../../scripts/datos";

//reactFunctionalComponent
function Home() {
  //estado datosgeneral
  const [datos, setDatos] = useState(data);

  //Manejo de datos
  const handleForm = (e) => {
    //destructuring datos entrada para calculo
    let { entrada, personalizado } = datos;

    //recepcion de datos
    const { id, value } = e.target;

    //convertir los string numero a flotante
    const newDatoEntrada = datos.numerico.includes(id)
      ? parseFloat(value)
      : value;

    //datos nuevos ingresados
    entrada[id] = newDatoEntrada;

    //reset datos segun el tipo de circuito
    if (id === "circuito") {
      personalizado = newDatoEntrada === "Personalizado" ? true : false;
      entrada.desc =
        newDatoEntrada !== "Personalizado" ? newDatoEntrada : entrada.desc;
    }

    //reset de factor si se escoge "VA"
    if (id === "unidades") {
      entrada.factor = newDatoEntrada === "VA" ? 1 : entrada.factor;
    }

    //reset de voltaje si cambia las fases
    if (id === "fases") {
      entrada.voltaje = newDatoEntrada === 1 ? 120 : 208;
    }

    //objeto de datos nuevo
    const newDatos = {
      ...datos,
      entrada: entrada,
      personalizado: personalizado,
    };

    //set de los datos con los datos ingresados
    setDatos(newDatos);
  };

  //manejo de envio de los datos y calculo de filas
  const handleSubmit = (e) => {
    //prevenir acciones default
    e.preventDefault();

    //destructuring datos para calculo y filas previas
    let { entrada } = data;

    //calcular fila para la tabla o resumen del circuito
    const newRow = row(
      entrada.desc,
      entrada.potencia,
      entrada.unidades,
      entrada.factor,
      entrada.fases,
      entrada.voltaje,
      entrada.distancia
    );

    console.log(newRow);

    //control si la corriente sobrepasa los 560A
    if (newRow[3] > 560) {
      alert(
        "la correinte supera 560A, no hay valores en la Tabla 310-16 de la NTC 2050 para corrientes superiores en diceño 60°C"
      );
    } else if (newRow[7] === undefined) {
      alert(
        "Al iterar la caida de tencion se supera el calibre 2000KCMIL, 310-16 de la NTC 2050 no contiene calibres mayores para que el circuito calculado cumpla por caida de tension"
      );
    } else {
      //objeto de datos nuevo
      const newDatos = {
        ...datos,
        rows: [...datos.rows, newRow],
      };

      setDatos(newDatos);
    }
  };

  useEffect(() => {
    console.log(datos.entrada);
  }, [datos]);

  //Objetos del DOM
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
            //control tipo de circuito
            personalizado={datos.personalizado}
            //control factor de potencia
            factor={datos.entrada.unidades === "VA" ? false : true}
            //control de voltajes segun numero de fases
            valueVoltaje={datos.entrada.voltaje}
            fasesVoltaje={datos.entrada.fases}
          />
        </>
        <>
          <Tabla trows={datos.rows} />
        </>
      </main>
      <footer></footer>
    </div>
  );
}

export default Home;
