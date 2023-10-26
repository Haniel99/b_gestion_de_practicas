const formatDate = (date: Date): string => {

    const dateString = date.toString();
    const dateList = dateString.split("-");
    const reverseList = dateList.reverse();
    
    return reverseList.join("/");
}

export default formatDate;