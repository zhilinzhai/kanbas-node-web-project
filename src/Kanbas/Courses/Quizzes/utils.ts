const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" }); // 'Sep'
    const time = date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true, // for '1pm' format
      })
      .toLowerCase(); // convert AM/PM to am/pm

    return `${month} ${day} at ${time}`;
  };

const compareObjects = (obj1: any, obj2: any) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}


export { formatDate, compareObjects };