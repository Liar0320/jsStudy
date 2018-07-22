let [a,b] = [1,2];
console.log(a,b);
[b,a] = [a,b];
console.log(a,b);   


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

console.log(list);
bubleSort(list); 
console.log(list);
