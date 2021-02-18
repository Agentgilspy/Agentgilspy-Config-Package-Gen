const { exec } = require('child_process')

let moduledir = require.main.path.split("\\")
moduledir.pop()

moduledir = moduledir.join('\\')
 
exec(`start ${moduledir}`);
