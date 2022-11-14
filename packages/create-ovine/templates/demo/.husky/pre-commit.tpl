#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

{{{ npmClient }}} lint-staged --quiet
