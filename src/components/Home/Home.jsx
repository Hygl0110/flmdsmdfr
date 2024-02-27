//imports
import "./Home.module.css";
import React, { useState } from "react";
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

    //recepcion de datosf
    const { id, value } = e.target;

    //convertir los string numero a flotante
    const newDatoEntrada = datos.numerico.includes(id)
      ? parseFloat(value)
      : value;

    //datos nuevos ingresados
    entrada[id] = newDatoEntrada;

    //reset datos, descripcion y numero de fases, segun el tipo de circuito
    [personalizado, entrada.desc, entrada.fases] =
      id === "circuito"
        ? [
            newDatoEntrada === "Personalizado" ? true : false,
            newDatoEntrada !== "Personalizado" ? newDatoEntrada : entrada.desc,
            newDatoEntrada !== "Personalizado" ? 1 : entrada.fases,
          ]
        : [personalizado, entrada.desc, entrada.fases];

    //reset de factor si se escoge "VA"
    entrada.factor =
      id === "unidades"
        ? newDatoEntrada === "VA"
          ? 1
          : entrada.factor
        : entrada.factor;

    //reset de voltaje si cambia las fases
    entrada.voltaje =
      id === "fases" ? (newDatoEntrada === 1 ? 120 : 208) : entrada.voltaje;

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
    const { entrada } = data;

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

    //control si la corriente sobrepasa los 560A
    newRow[3] > 560
      ? alert(
          "la correinte supera 560A, no hay valores en la Tabla 310-16 de la NTC 2050 para corrientes superiores en diceño 60°C"
        )
      : newRow[7] === `${1} x ${undefined} ${"AWG"}` ||
        newRow[7] === `${1} x ${undefined} ${"kcmils"}`
      ? alert(
          "Al iterar la caida de tencion se supera el calibre 2000KCMIL, 310-16 de la NTC 2050 no contiene calibres mayores para que el circuito calculado cumpla por caida de tension"
        )
      : setDatos({
          ...datos,
          rows: [...datos.rows, newRow],
        });
  };

  //Objetos del DOM
  return (
    <div className="Home">
      <header>
        <h1>Electric-Power-Box</h1>
      </header>
      <main>
        <>
          <InputData
            onChange={handleForm}
            onSubmit={handleSubmit}
            //control tipo de circuito
            personalizado={datos.personalizado}
            //control de carga minima
            AG={datos.AG}
            minPotencia={
              ["AG", "PA", "LP"].includes(datos.entrada.desc) ? 1500.0 : 0.1
            }
            //control factor de potencia
            factor={
              ["W", "hp", "cv"].includes(datos.entrada.unidades) ? true : false
            }
            //control de voltajes segun numero de fases
            valueVoltaje={datos.entrada.voltaje}
            fasesVoltaje={datos.entrada.fases}
          />
        </>
        <>
          <Tabla trows={datos.rows} />
        </>
      </main>

      <>
        <footer>
          <h4>Developer:</h4>
          <p>
            <a
              href="https://github.com/Hygl0110"
              target="_blank"
              rel="noreferrer"
            >
              Daniel Hernney Cardona Jaramillo
            </a>
          </p>

          <h4>
            <a href="https://www.itm.edu.co/" target="_blank" rel="noreferrer">
              Instituto Tecnológico Metropolitano
            </a>
            <br />
            Facultad de Ingeniería y Electromecánica <br />
            Medellín <br />
          </h4>
          <br />
          <div className="logo">
            <img
              src="https://www.itm.edu.co/wp-content/themes/educationpack-child/img/itm-logo-2.svg"
              alt="ITM"
            />
          </div>
        </footer>
      </>
    </div>
  );
}

export default Home;
