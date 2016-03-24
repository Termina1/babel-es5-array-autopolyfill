var arr = [1, 2, 3];
arr.map(el => el + 1).filter(el => el > 2).reduce((acc, el) => acc + el).filter(el => el);
