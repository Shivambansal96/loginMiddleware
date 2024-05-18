
const fs = require('node:fs')
const express = require('express');
// const morgan = require('morgan');

const app = express();

// morgan.token('method', (req, res) => {
//     return req.method;
// })
// 
// const result = app.use(morgan('\nMETHOD = :method \nReceived request at Url =  = :url \nSTATUS_CODE = :status \nContent_Length = :res[content-length] \nRESPONSE_TIME = :response-time ms'))
// app.use(morgan('combined'))


const LogInMiddleware = (req, res, next) => {
    // fs.appendFileSync('access.log', JSON.parse(result))
    const ip = req.ip;
    const method = req.method;
    const url = req.url;
    const statusCode = res.statusCode;
    const userAgent = req.get('User-Agent');

    // Format the log message
    const logMessage = `\n"DATE_AND_TIME" = [${new Date()}] \n"METHOD" = ${method} \n"IP_ADDRESS" = ${ip} \n"Received request at Url" = ${url} \n"STATUS_CODE" = ${statusCode} \n"USER_AGENT" = ${userAgent}\n`;

    // Append the log message to the access.log file
    fs.appendFile('access.log', logMessage, (err) => {
        if (err) {
            logMessage = 'ERROR_CAUGHT = ' + logMessage;
            console.error('Error appending to access.log:', err);
        }
        else {
            console.log(logMessage);
        }
    });

    // Call the next middleware
    next();
}

const errorMiddleware = (err, req, res, next) => {
    fs.appendFileSync('Errors.log', err.message)
    console.log('ErrorHandlingMiddleware Error = ', err);
    
    res.status(500).json({
        status: 'FAIL',
        msg: 'Middleware Error'
    })  
}

app.use(LogInMiddleware);
app.use(errorMiddleware)


app.get('/logIn', (req, res) => {


    try {
        res.json({
            status: 'success'
        })
        
    } catch (err) {
        next(err);
    }
})



app.listen(808, () => {
    console.log('Server is running at https"//localhost:8008/logIn');
})