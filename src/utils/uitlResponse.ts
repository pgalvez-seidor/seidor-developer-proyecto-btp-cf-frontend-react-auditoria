export const success = (idtransaccion, message, results) => {
  return {
    code: 1,
    idtransaccion: idtransaccion,
    message: message,
    results: results,
  };
};
export const error = (idtransaccion, message, results) => {
  return {
    code: -1,
    idtransaccion: idtransaccion,
    message: message,
    results: results,
  };
};
export const errorNoAutorizado = (idtransaccion, message, results) => {
  return {
    code: -99,
    idtransaccion: idtransaccion,
    message: message,
    results: results,
  };
};

export const warn = (idtransaccion, message, results) => {
  return {
    code: 2,
    idtransaccion: idtransaccion,
    message: message,
    results: results,
  };
};

export const exception = (idtransaccion, message) => {
  return {
    code: -2,
    idtransaccion: idtransaccion,
    message: message,
  };
};

export const errorServicio = (er, oHeader) => {
  let obj: any = {};
  if (er.status == 401) {
    obj = {
      idtransaccion: null,
      code: -99,
      message: 'Su sesión ha terminado porfavor, iniciar sesión nuevamente.',
    };
  } else {
    obj = {
      idtransaccion: null,
      code: -1000,
      message:
        'Error al consultar el servicio (' +
        er.status +
        '), vuelva a intentarlo o comuníquese con el área de soporte.',
    };
  }
  return obj;
};
