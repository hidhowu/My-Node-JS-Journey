// CORE MODULES - Modules that are built into Node.js
const readline = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url');
const events = require('events');


// USER DEFINED MODULES - Modules that are created by the user
const replaceHtml = require('./Modules/replaceHtml');
const user = require('./Modules/user')

// THIRD PARTY MODULES - Modules that are created by other developers and can be installed using npm


// Lesson 4 Reading user Input

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter your first name \n', (answer) => {
    console.log("Your name is " + answer);

    rl.close();

});

rl.on('close', () => {
    console.log("Readline input closed");
    porcess.exit(0)

})*/


// Lesson 5 Reading and writing files

/*const readText = fs.readFileSync(__dirname + '/files/input.txt', 'utf-8');
console.log(readText);


const content = `This is the initial context of input file: ${readText}`
fs.writeFileSync(__dirname + "/files/output.txt", content);*/

// Lesson 7 Reading and writing files asynchronously

/*(async () => {

    const data = await new Promise((resolve) => {
        fs.readFile('./files/input.txt', 'utf-8', (err, data) => {
            console.log(data);
            // return data;
            resolve(data);
        })
    });

    fs.writeFile('./files/output.txt', data, (err, data) => {
        console.log('Data written successfully');

    });

})()*/

// LESSON 8 - 12: Creating a server

// Creating a server using http module
// const server = http.createServer();

// Creating a server using http module with request and response
const server = http.createServer((request, response) => {
    // response.writeHead(200, {
    //     "Content-Type": 'text/html'
    // });
    // console.log("Request received", request.url);

    // response.end('<h1>Hello World</h1>');
});


server.listen(8000, 'localhost', () => {
    console.log("Server is listening on port 8000");
})

// const html = fs.readFileSync('./index.html', 'utf-8');
// const userTable = fs.readFileSync('./userTable.html', 'utf-8');

// LESSON 13 - 14: Handling different routes in Node.js and sending HTML response
// server.on('request', (request, response) => {
//     const path = request.url.toLocaleLowerCase();
//     if (path === '/' || path === '/home') {
//         response.writeHead(200, {
//             "Content-Type": 'text/html'
//         });
//         // replacing the placeholder in the HTML file with the actual content
//         response.end(html.replace('{{PAGE_CONTENT}}', 'You are in Homepage'))
//     } else if (path === '/about') {
//         response.writeHead(200, {
//             "Content-Type": 'text/html'
//         });
//         response.end(html.replace('{{PAGE_CONTENT}}', 'You are in About Page'))
//     } else if (path === '/contact') {
//         response.writeHead(200, {
//             "Content-Type": 'text/html'
//         });
//         response.end(html.replace('{{PAGE_CONTENT}}', 'You are in Homepage'))
//     } else {
//         response.writeHead(404, {
//             "Content-Type": 'text/html'
//         });
//         response.end(html.replace('{{PAGE_CONTENT}}', 'Error 404: Page not Found'))
//     }
// })



// LESSON 15: Handling JSON data in Node.js
// server.on('request', (request, response) => {
//     const path = request.url.toLocaleLowerCase();
//     if (path === '/api/users') {
//         response.writeHead(200, {
//             "Content-Type": 'application/json'
//         });
//         const users = [
//             { name: 'John', age: 30 },
//             { name: 'Jane', age: 25 },
//             { name: 'Doe', age: 35 }
//         ];
//         response.end(JSON.stringify(users));
//     } else {
//         response.writeHead(404, {
//             "Content-Type": 'application/json'
//         });
//         const errorResponse = {
//             error: 'Page not Found',
//             status: 404
//         };
//         response.end(JSON.stringify(errorResponse));
//     }
// });



// LESSON 16 - 19: TRANSFORMING JSON DATA TO HTML IN NODE.JS USING PLACEHOLDERS | USING QUERY PARAMETERS | CREATING REUSABLE FUNCTION TO REPLACE HTML PLACEHOLDERS | USING USER DEFINED MODULES replaceHtml.js
// server.on('request', (request, response) => {
//     const { query, pathname: path } = url.parse(request.url, true);
//     // const path = request.url.toLocaleLowerCase();
//     if (path === '/users') {


//         let responseData = '';
//         const users = [
//             { id: 1, name: 'John', email: 'john@example.com', role: 'admin' },
//             { id: 2, name: 'Jane', email: 'jane@example.com', role: 'user' },
//             { id: 3, name: 'Doe', email: 'doe@example.com', role: 'editor' }
//         ];
//         if (!query.id) {
//             response.writeHead(200, {
//                 "Content-Type": 'text/html'
//             });
//             responseData = users.map(user => replaceHtml(userTable, user)).join('');


//         } else {

//             const user = users.find(user => user.id === parseInt(query.id));
//             if (!user) {
//                 response.writeHead(404, {
//                     "Content-Type": 'text/html'
//                 });
//                 responseData = '<tr><td colspan="4" style="text-align:center">User does not exist.</td></tr>';
//             } else {
//                 responseData = replaceHtml(userTable, user);

//             }
//         }
//         response.end(html.replace('{{USERS_DATA}}', responseData));

//     } else {


//         response.writeHead(404, {
//             "Content-Type": 'text/html'
//         });
//         response.end('<h1>Error 404: Page not Found</h1>');


//     }
// })




// LESSON 20-21 Custom Events in Node
// const myEmitter = new user();

// the event listener
// myEmitter.on('userRaceEnded', (name, distance, position) => {
//     console.log(`${name} has completed the ${distance} race in ${position} place`);

// })

// the event emitter
// myEmitter.emit('userRaceEnded', 'Joshua', '20km', '1st');


// Lesson 22 and 23 Streams in Node js
// Streams is used for reading and writing large files to avoid memory overhead


// const server = http.createServer();
// server.listen(8000, 'localhost');

// let a = 1;
// // server.on('request', (req, res) => {
// //     const fsStream = fs.createReadStream('./files/largefile.txt');

// //     res.writeHead(200, {
// //         "Content-Type": 'text/html'
// //     })
// //     fsStream.on('data', (chunkOfData) => {
// //         res.write(`<h1>${a}</h1>` + chunkOfData);
// //         a++;
// //     });

// //     fsStream.on('end', () => {
// //         res.end();

// //     });
// //     fsStream.on('error', () => {
// //         res.end(error);
// //     })

// // });


// // Lesson 24 Using Pipe Method
// server.on('request', (req, res) => {
//     res.writeHead(200, {
//         "Content-Type": 'text/html'
//     });
//     const fsStream = fs.createReadStream('./files/largefile.txt');


//     fsStream.pipe(res);
//     a++;


// });