const formatRut = (rut: string): string => {

    const rut1 = rut.substring(0, 2);
    const rut2 = rut.substring(2, 5);
    const rut3 = rut.substring(5);
    
    return `${rut1}.${rut2}.${rut3}`;
}

export default formatRut;