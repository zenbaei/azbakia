rm -r /tmp/metro* 
rm -r /tmp/haste*
watchman watch-del-all 
watchman watch-project .
npm start --reset-cache

