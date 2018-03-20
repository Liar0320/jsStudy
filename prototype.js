///一切（引用类型）都是对象，对象是属性的集合
///对象都是通过函数来创建的
/// this 指向调用该方法的对象 

var myObject = function(){};
(()=>{
    var privateVariable = 1;
    function privateFunction(a){
        console.log('privateFunction',a)
        return false;
    }
 
    myObject.prototype.publickMethod = ()=>{
        return privateFunction(privateVariable);
    }
})();
new myObject().publickMethod();
//------------------------------------------
var Person;
(()=>{
    var name = '';
    Person =function (value){
            name = value;
            this.puper = '22222';
    }
    Person.prototype.getName = ()=>{
        return name;
    }
    Person.prototype.setName = (value)=>{
        name = value;
    }
})()
var person1 = new Person('lch');
console.log(person1.getName());
person1.setName('sun');
console.log(person1.getName());
for(let item in person1){
    console.log('person1',item);
    if(person1.hasOwnProperty(item)){
        console.log('person1.hasOwnproperty',item);
    }
}

//--------------------------------

function Keith(name) {
    var age;
    function setAge(n) {
    age = n;
    }
    function getAge() {
    return age;
    }
    return {
    name: name,
    setAge: setAge,
    getAge: getAge
    };
}
    var person = Keith('keith');
    person.setAge(21);
    console.log(person.name); // 'keith'
    console.log(person.getAge()); //21