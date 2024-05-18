const date = new Date(); 
const day = date.getDate();
const month = date.getMonth()+1;
const year = date.getFullYear();

console.log(`Hello ASL!`);
console.log(`${month}-${day}-${year}`);