function test(t: numbers[]) {
  return t.concat([1])
    .slice(0, 1)
    .sort()
    .map(el => el + 1);
}
