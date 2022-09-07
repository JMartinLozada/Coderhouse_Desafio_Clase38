

module.exports = {
    info: (req,res)=> {
        res.json({
            argEntrada: process.argv,
            os: process.platform, 
            nodeVs: process.version, 
            memoryUsage: process.memoryUsage(), 
            excPath: process.execPath, 
            processID: process.pid, 
            folder: process.cwd(),
            numCPUS: require('os').cpus().length
        });
    }
};