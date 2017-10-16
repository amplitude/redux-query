import * as path from 'path';
import * as tt from 'typescript-definition-tester';

const options = {
  jsx: 'react'
};

describe('typescript definitions', () => {
  it('should compile', done => {
    tt.compile(path.resolve(__dirname, 'definitions.tsx'), options, done);
  }).timeout(3000);
});