import { map as es5map } from "es5-collection-methods";
function test(t) {
  return es5map(t.concat([1]).slice(0, 1).sort(), el => el + 1);
}
