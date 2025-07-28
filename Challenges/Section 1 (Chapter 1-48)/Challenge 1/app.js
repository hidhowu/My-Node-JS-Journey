const fs = require('fs');
const http = require('http');
const url = require('url');
const path = require('path');

const mime = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.json': 'application/json',
};

// We get the tasks ahead of time so that we wont be calling the file system every time we want to get the tasks
// this is a synchronous operation so it will block the event loop until the file is read
const tasks = JSON.parse(fs.readFileSync('./files/tasks.json', 'utf-8'));

const sendErrorResponse = (res, statusCode, message) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'fail', error: message }));
};

const sendSuccessResponse = (res, statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'success', data }));
};


// we are not going to use express for this challenge to familiarize us with the core Node.js modules and how they work together
const app = http.createServer();

app.on('request', (req, res) => {


    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    let contentType = '';
    if (ext) {
        contentType = mime[ext] || 'application/octet-stream';
    }


    // console.log(`Request received: ${req.method} ${req.url}`);
    const parsedUrl = url.parse(req.url, true);
    // console.log('Parsed URL:', parsedUrl);

    // if the request is a GET request
    if (req.method === 'GET') {
        // if request is a GET that we have two option either we are getting all tasks or a specific task

        // if there are no tasks or tasks is empty then we return a 404 error
        if (!tasks || tasks.length === 0) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return sendErrorResponse(res, 404, 'No tasks found');
        }

        // Geting all tasks
        if (parsedUrl.pathname === '/api/tasks') {

            // Read tasks from tasks.json
            // since we have read the file ahead of time then we can just send the tasks as a response
            // setting status code and headers

            // res.writeHead(200, { 'Content-Type': 'application/json' });
            // res.end(JSON.stringify(
            //     {
            //         status: 'success',
            //         data: {
            //             tasks
            //         }
            //     }
            // ));

            return sendSuccessResponse(res, 200, { tasks });
        }

        // Getting a specific task
        else if (parsedUrl.pathname.startsWith('/api/task/')) {

            // extracting the task id from the url
            const taskID = +(parsedUrl.pathname.split('/'))[3];

            // finding the task with the id
            const task = tasks.find(task => task.id === taskID);

            if (!task) {
                return sendErrorResponse(res, 404, 'Task not found');
            }

            // sending the task as a response
            return sendSuccessResponse(res, 200, { task });



        } else if (ext) {
            // if the request is for a static file then we read the file and send it as a response
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(err.code === 'ENOENT' ? 404 : 500);
                    res.end(err.code === 'ENOENT' ? 'File Not Found' : 'Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content);
                }
            });

        } else {
            // if the request is not for tasks or task then we return a 400 error
            return sendErrorResponse(res, 400, 'Invalid Request');
        }

        return;
    }

    else if (req.method === 'POST') {
        // if the request is a POST request then we are going to add a new task
        if (parsedUrl.pathname === '/api/tasks') {
            let body = '';

            // we are going to read the request body and parse it as JSON
            // console.log('Reading request body...');
            req.on('data', chunk => {
                body = JSON.parse(chunk.toString());
                console.log(body);
                // verify body has title and description
                if (!body.title || !body.description || typeof body.completed !== 'boolean') {
                    return sendErrorResponse(res, 400, 'Invalid Request Body');
                }

                // creating an id for the new task and merging it with the body

                body = Object.assign({ id: tasks[tasks.length - 1].id + 1 }, body);


                tasks.push(body);
                // writing the new tasks to the tasks.json file

                fs.writeFile('./files/tasks.json', JSON.stringify(tasks), (err) => {
                    if (err) {
                        console.error('Error writing to file:', err);
                        // if there is an error writing to the file then we return a 500 error
                        return sendErrorResponse(res, 500, 'Internal Server Error');
                    }

                    return sendSuccessResponse(res, 201, { task: body });
                });
            });
        }
    }

    // if the request is not a GET or POST request then we return a 405 error
    else {
        return sendErrorResponse(res, 405, 'Method Not Allowed');
    }
})


module.exports = app;