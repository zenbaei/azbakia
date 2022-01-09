DIR="./dist"
tsc
cp ./package.json $DIR
cd $DIR
git add .
git commit -m "generate lib"
git push
rm package.json
