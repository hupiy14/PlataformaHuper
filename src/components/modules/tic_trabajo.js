

export default function Tic_T(array, valTIC, TicUsuario) {

  let valorTalento = TicUsuario ? TicUsuario : [];

  Object.keys(array).map((key, index) => {
    let valor = 0;
    let valTalent = 0;
    let valorAnt = 0;
    switch (array[key].value.substring(1, 2)) {
      case 'T':
        switch (array[key].value.substring(2, 3)) {
          case '1':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Talento.Trabajo.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.talentoT)
              valorAnt = TicUsuario.talentoT.valorC;
            valorTalento['talentoT'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }
            break;
          case '2':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Talento.Equipo.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.talentoE)
              valorAnt = TicUsuario.talentoE.valorC;
            valorTalento['talentoE'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }
            break;
          case '3':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Talento.Futuro.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.talentoF)
            valorAnt = TicUsuario.talentoF.valorC;
            valorTalento['talentoF'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }
            break;
          default:
            break;
        }
        break;
      case 'I':
        switch (array[key].value.substring(2, 3)) {
          case '1':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Impacto.Trabajo.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.impactoT)
            valorAnt = TicUsuario.impactoT.valorC;
            valorTalento['impactoT'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }
            break;
          case '2':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Impacto.Equipo.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.impactoE)
            valorAnt = TicUsuario.impactoE.valorC;
            valorTalento['impactoE'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }

            break;
          case '3':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Impacto.Futuro.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.impactoF)
            valorAnt = TicUsuario.impactoF.valorC;
            valorTalento['impactoF'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }

            break;
          default:
            break;
        }
        break;
      case 'C':
        switch (array[key].value.substring(2, 3)) {
          case '1':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Compromiso.Trabajo.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.compromisoT)
            valorAnt = TicUsuario.compromisoT.valorC;
            valorTalento['compromisoT'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }
            break;
          case '2':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Compromiso.Equipo.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.compromisoE)
            valorAnt = TicUsuario.compromisoE.valorC;
            
            valorTalento['compromisoE'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }

            break;
          case '3':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Compromiso.Futuro.valor);
            valorAnt = valor;
            if (TicUsuario && TicUsuario.compromisoF)
            valorAnt = TicUsuario.compromisoF.valorC;
            
            valorTalento['compromisoF'] = { valor, ['valorC']: ((valor + valorAnt) / 2) }

            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  });
  return valorTalento;
}