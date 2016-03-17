map(arr, el => el + 1);
map(arr, (el, i) => el + i);

filter(arr, el => !el);

reduce(arr, (acc, el) => acc + el, {});

forEach(arr, el => t(el));
forEach(arr, (el, i) => t(el, i));

obj.somMethid(1, 2, 3);
