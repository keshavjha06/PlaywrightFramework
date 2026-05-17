// import { expect, type Locator, type Page } from '@playwright/test';
let message1 : string = "Hello";
message1 = "bye";
console.log(message1);
let age1:number = 20;
console.log(age1);
let isActive : boolean = false;

let numberArry : number[] = [1,2,3];

let data : any = "this could be anything";
data =42;
function add(a:number,b:number): number
{
    return a+b;
}

add(3,4);

let user: {name:string,age:number,location:string} = { name: "Bob",age:34,location:"delhi"};
user.location = "hyderabad";

// To run use -> tsc demo1.ts --> node demo1.js














