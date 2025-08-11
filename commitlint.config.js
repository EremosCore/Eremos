export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // bug fix
        'chore', // build process / tooling
        'docs', // documentation
        'style', // formatting / missing semi-colons etc
        'refactor', // code change without feature/bugfix
        'test', // adding/updating tests
      ],
    ],
    'subject-case': [0], // allow any casing for short description
    'header-max-length': [2, 'always', 72], // keep commit short
  },
};
