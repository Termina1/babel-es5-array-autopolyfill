import { keys as es5keys, map as es5map } from 'es5-collection-methods';
var t = { t: 1 };
es5map(es5keys(t), el => el + '2');
