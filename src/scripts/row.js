import { T240_6, T250_95, T310_16, T4_EMT, T4_PVC, T5, T8 } from "./tablas";

//buscar valor numerico siguiente
function locateByNum(tabla, valueIn, columnIn, columnOut) {
  let index = 0;
  for (let element of tabla[columnIn]) {
    if (element < valueIn) {
      index++;
    } else {
      break;
    }
  }
  return [tabla[columnOut][index], index];
}

//Buscar valor texto exacto
function locateByText(tabla, valueIn, columnIn, columnOut) {
  let index = 0;
  for (let element of tabla[columnIn]) {
    if (element !== valueIn) {
      index++;
    } else {
      break;
    }
  }
  return [tabla[columnOut][index], index];
}

//Calcular fila en cuadro de potencias
//
//
//
export function row(desc, powerIn, unit, pf, phase, voltageIn, DT) {
  //raiz cuadrada de tres
  const sr3 = Math.sqrt(3);

  //calcular potencia aparente en VA
  const powerUnits = { VA: 1, W: 1, hp: 745.699872, cv: 735.49875 };
  const power = (powerIn * powerUnits[unit]) / pf;

  //Voltaje de linea
  const voltages = { 120: 208, 123.5: 214, 127: 220 };
  const voltage = [120, 123.5, 127].includes(voltageIn)
    ? voltages[voltageIn]
    : voltageIn;

  //calcular la correinte en A
  const current =
    phase === 1
      ? (power * sr3) / voltage
      : phase === 2
      ? power / voltage
      : phase === 3
      ? power / (voltage * sr3)
      : undefined;

  //PTM
  let [PTM, PTMup, PTMdown, PTMindex] = [0, 0, 0, 0];
  for (let valor of T240_6.PTM) {
    if (valor < current) {
      PTMindex++;
    } else {
      PTMup = T240_6.PTM[PTMindex];
      PTMdown = T240_6.PTM[PTMindex - 1];
      break;
    }
  }

  //comparasion de la corriente con las protecciones y seleccion de la mas cercana
  PTM = (PTMup - PTMdown) / 2 > PTMup - current ? PTMup : PTMdown;
  PTM = PTM === undefined ? 15 : PTM;

  //RC inicial
  let [phaseCaliber] = locateByNum(T310_16, current, "corriente", "calibre");
  let phaseUnit = "AWG";
  let [RC, rcIndex] = locateByText(T8, phaseCaliber, "calibre", "RC");
  let caida = 100;

  //Caida de tension
  while (caida >= 3) {
    //monofasico
    caida =
      //monofasico
      phase === 1
        ? ((2 * DT * RC * current) / (1000 * (voltage / sr3))) * 100
        : //bifasico
        phase === 2
        ? ((2 * DT * RC * current) / (1000 * voltage)) * 100
        : //trifasico
        phase === 3
        ? ((sr3 * DT * RC * current) / (1000 * voltage)) * 100
        : undefined;

    rcIndex = caida >= 3 ? rcIndex + 1 : rcIndex;
    RC = T8.RC[rcIndex];
    phaseCaliber = T310_16.calibre[rcIndex];
    phaseUnit = rcIndex <= 12 ? "AWG" : "kcmils";
  }

  //Calibre del Neutro
  const nCaliber = phaseCaliber;

  //Calibre a tierra
  const [gCaliber, gIndex] = locateByNum(
    T250_95,
    current,
    "corriente",
    "calibre"
  );
  const gunit = gIndex <= 13 ? "AWG" : "kcmils";

  //Area total
  const [phaseArea] = locateByText(T5, phaseCaliber, "calibre", "area");
  const totalArea = phaseArea * phase + 2;

  //Conduit PVC
  const [PVC] = locateByNum(T4_PVC, totalArea, "area", "ich");

  //Conduit EMT
  const [EMT] = locateByNum(T4_EMT, totalArea, "area", "ich");

  //Hilos
  const NC = phase + 2;

  return [
    desc,
    parseFloat(power.toFixed(2)),
    voltageIn,
    parseFloat(current.toFixed(2)),
    `${phase} x ${PTM}`,
    DT,
    `${phase} x ${phaseCaliber} ${phaseUnit}`,
    `${1} x ${nCaliber} ${phaseUnit}`,
    `${1} x ${gCaliber} ${gunit}`,
    parseFloat(caida.toFixed(2)),
    PVC,
    EMT,
    NC,
  ];
}
