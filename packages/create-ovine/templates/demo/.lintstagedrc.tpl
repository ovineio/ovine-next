{
  "*.{md,json}": [
    "prettier --cache --write"
  ],
  "*.{js,jsx}": [
    "ovine lint --fix --eslint-only",
    "prettier --cache --write"
  ],
  "*.{css,less}": [
    "ovine lint --fix --stylelint-only",
    "prettier --cache --write"
  ],
  "*.ts?(x)": [
    "ovine lint --fix --eslint-only",
    "prettier --cache --parser=typescript --write"
  ]
}
