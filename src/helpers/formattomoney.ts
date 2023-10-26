function formatMoney(numero: number) {
    const money = numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return money;
  }

export default formatMoney;