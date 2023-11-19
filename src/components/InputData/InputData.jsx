import "./InputData.css";

function InputData(props) {
  return (
    <div className="input_data" onChange={props.onChange}>
      <h3>formulario</h3>
      <form className="form" onSubmit={props.onSubmit}>
        <label htmlFor="desc">Descripcion: </label>
        <input
          type="text"
          id="desc"
          placeholder="Ingrese descripcion"
          maxlength="20"
          required
        />

        <label htmlFor="potencia">Potencia: </label>
        <input
          type="number"
          id="potencia"
          placeholder="Ingrese potencia"
          required
        />

        <label htmlFor="unidades">Unidades: </label>
        <select id="unidades">
          <option>{"VA"}</option>
          <option>{"W"}</option>
          <option>{"hp"}</option>
          <option>{"cv"}</option>
        </select>

        <label htmlFor="factor">Factor de potencia: </label>
        <input
          type="number"
          id="factor"
          placeholder="Ingrese factor de potencia"
          step={0.01}
          min={0.01}
          max={1}
          required
        />

        <label htmlFor="fases">Numero de fases: </label>
        <select id="fases">
          <option>{1}</option>
          <option>{2}</option>
          <option>{3}</option>
        </select>

        <label htmlFor="voltaje">Voltaje: </label>
        <select id="voltaje">
          {props.voltageOp.map((op, key) => (
            <option key={key}>{op}</option>
          ))}
        </select>

        <label htmlFor="distancia">Distnacia al tablero: </label>
        <input
          type="number"
          id="distancia"
          placeholder="Ingrese distancia al tablero"
          required
        />
        <button type="submit">Calcular</button>
      </form>
    </div>
  );
}

export default InputData;
