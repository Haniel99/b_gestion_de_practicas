function formatPhone(phone: any) {
    if (phone != null && phone != undefined) {
        //Formatear numero de celular
        let phoneFormatted = phone.replace(/\D/g, ''); //Eliminar espacios en blanco y caracteres
        phoneFormatted = '9' + phoneFormatted.slice(-8); //Obtener los ultimos 8 numeros y agregar un 9 al principio
        
        return phoneFormatted;
    }

    return '';
  }

export default formatPhone;