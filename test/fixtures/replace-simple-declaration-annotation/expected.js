import { map as es5map, reduce as es5reduce } from "es5-collection-methods";
var arr: Array<Any> = getType1();
es5map(arr, el => el + 1);

var arr2: numbers[] = getType2();
es5reduce(arr2, (acc, el) => acc + el);
