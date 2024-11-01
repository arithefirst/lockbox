import generate from "short-uuid";

function makeId() {
  return generate().new();
}

export default makeId;
