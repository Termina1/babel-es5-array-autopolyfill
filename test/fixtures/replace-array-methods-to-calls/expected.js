import { filter as es5filter, forEach as es5forEach, map as es5map, reduce as es5reduce } from "es5-collection-methods";
es5map(arr, el => el + 1);
es5map(arr, (el, i) => el + i);

es5filter(arr, el => !el);

es5reduce(arr, (acc, el) => acc + el, {});

es5forEach(arr, el => t(el));
es5forEach(arr, (el, i) => t(el, i));

obj.somMethid(1, 2, 3);
