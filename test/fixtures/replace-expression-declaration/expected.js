import { filter as es5filter, map as es5map, reduce as es5reduce } from "es5-collection-methods";
es5map(getType(), el => el + 1);
es5reduce(getType2(), (acc, el) => acc + el);
es5filter(ev.attachments, el => el);
