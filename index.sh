#!/bin/bash
#dirs=$(find exps/ -mindepth 1 -maxdepth 1 -type d )
#echo $dirs;

find exps/ -mindepth 1 -maxdepth 1 -type d \
    | xargs -I% echo "* [%](/d3-sandbox/%)" \
    > docs/exps.md

sed -i 's/\[exps\//[/' docs/exps.md
cat docs/constant.md docs/exps.md > README.md
