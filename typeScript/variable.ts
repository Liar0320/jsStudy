import {sum} from "./lib";
let [a,b] = [1,2];
[b,a] = [a,b];

function bubleSort(list:Number[]):void{
    for (let j = 0; j < list.length; j++) {
        for (let i = 0; i < list.length; i++) {
            if(list[i]>list[i+1]){
                [list[i],list[i+1]] = [list[i+1],list[i]];
            }
        } 
    }
}
let list:Number[] = [1,3,4,7,4,2,5]; 
bubleSort(list); 
console.log(list);


function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}
  
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);

console.log(sum(3,5));
