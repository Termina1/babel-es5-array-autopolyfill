arr.map(el => el + 1);
arr.map((el, i) => el + i);

arr.filter(el => !el);

arr.reduce((acc, el) => acc + el, {});

arr.forEach(el => t(el));
arr.forEach((el, i) => t(el, i));

obj.somMethid(1, 2, 3);
