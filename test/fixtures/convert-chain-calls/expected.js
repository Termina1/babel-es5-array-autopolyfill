import { filter as es5filter, map as es5map, reduce as es5reduce } from "es5-collection-methods";
var arr = [1, 2, 3];
es5reduce(es5filter(es5map(arr, el => el + 1), el => el > 2), (acc, el) => acc + el).filter(el => el);
