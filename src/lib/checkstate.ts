import assert from "assert";

export const checkState = (state: any, exp: any) => {
  assert.deepEqual(JSON.parse(JSON.stringify(state)), exp);
};

export default checkState;
