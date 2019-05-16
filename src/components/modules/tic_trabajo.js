

export default function Tic_T(array, valTIC, TicUsuario) {

  let valorTalento = TicUsuario? TicUsuario: [];
 
  console.log(array);
  Object.keys(array).map((key, index) => {
    let valor = 0;
    let valTalent = 0;
    switch (array[key].value.substring(1, 2)) {
      case 'T':
        switch (array[key].value.substring(2, 3)) {
          case '1':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Talento.Trabajo.valor);
            valTalent = TicUsuario && TicUsuario.Talento ? TicUsuario.Talento : valor;
            valorTalento['talentoT'] = { valor, ['valorC']: ((valor +  valTalent.talentoT ? valTalent.talentoT.valorC : valTalent) / 2) }
            break;
          case '2':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Talento.Equipo.valor);
            valTalent = TicUsuario && TicUsuario.Talento ? TicUsuario.Talento : valor;
            valorTalento['talentoE'] = { valor, ['valorC']: ((valor +  valTalent.talentoE ? valTalent.talentoE.valorC : valTalent) / 2) }
            break;
          case '3':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Talento.Futuro.valor);
            valTalent = TicUsuario && TicUsuario.Talento ? TicUsuario.Talento : valor;
            valorTalento['talentoF'] = { valor, ['valorC']: ((valor +  valTalent.talentoF ? valTalent.talentoF.valorC : valTalent) / 2) }
            break;
          default:
            break;
        }
        break;
      case 'I':
        switch (array[key].value.substring(2, 3)) {
          case '1':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Impacto.Trabajo.valor);
            valTalent = TicUsuario && TicUsuario.Impacto ? TicUsuario.Impacto : valor;
            valorTalento['impactoT'] = { valor, ['valorC']: ((valor +  valTalent.impactoT ? valTalent.impactoT.valorC : valTalent) / 2) }
            break;
          case '2':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Impacto.Equipo.valor);
            valTalent = TicUsuario && TicUsuario.Impacto ? TicUsuario.Impacto : valor;
            valorTalento['impactoE'] = { valor, ['valorC']: ((valor +  valTalent.impactoE ? valTalent.impactoE.valorC : valTalent) / 2) }

            break;
          case '3':
            valor = parseInt(array[key].value.substring(3, 4))* (valTIC.Impacto.Futuro.valor);
            valTalent = TicUsuario && TicUsuario.Impacto ? TicUsuario.Impacto : valor;
            valorTalento['impactoF'] = { valor, ['valorC']: ((valor +  valTalent.impactoF ? valTalent.impactoF.valorC : valTalent) / 2) }

            break;
          default:
            break;
        }
        break;
      case 'C':
        switch (array[key].value.substring(2, 3)) {
          case '1':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Compromiso.Trabajo.valor);
            valTalent = TicUsuario && TicUsuario.Compromiso ? TicUsuario.Compromiso : valor;
            valorTalento['compromisoT'] = { valor, ['valorC']: ((valor + valTalent.compromisoT ? valTalent.compromisoT.valorC : valTalent) / 2) }
            break;
          case '2':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Compromiso.Equipo.valor);
            valTalent = TicUsuario && TicUsuario.Compromiso ? TicUsuario.Compromiso : valor;
            valorTalento['compromisoE'] = { valor, ['valorC']: ((valor +  valTalent.compromisoE ? valTalent.compromisoE.valorC : valTalent) / 2) }

            break;
          case '3':
            valor = parseInt(array[key].value.substring(3, 4)) * (valTIC.Compromiso.Futuro.valor);
            valTalent = TicUsuario && TicUsuario.Compromiso ? TicUsuario.Compromiso : valor;
            valorTalento['compromisoF'] = { valor, ['valorC']: ((valor +  valTalent.compromisoF ? valTalent.compromisoF.valorC : valTalent) / 2) }

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