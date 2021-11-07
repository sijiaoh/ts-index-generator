import {generate} from './generate';

describe(generate.name, () => {
  it('should generate index ts files.', () => {
    expect(generate('test/index.ts')).toMatchInlineSnapshot(`
      "// ts-index-generator
      /* eslint-disable */
      // prettier-ignore
      export * from './has-index';
      export * from './no-comment-index';
      "
    `);

    expect(generate('test/has-index/a.ts')).toMatchInlineSnapshot('undefined');

    expect(generate('test/has-index/index.ts')).toMatchInlineSnapshot(`
      "// ts-index-generator
      /* eslint-disable */
      // prettier-ignore
      export * from './B';
      export * from './a';
      "
    `);

    expect(generate('test/no-comment-index/index.ts')).toMatchInlineSnapshot(
      'undefined'
    );
  });
});
