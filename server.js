const http = require("http");
const { v4: uuidv4 } = require("uuid");

const port = process.env.PORT || 3005;

const respondHeaders = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
}

const todos = [];

function responseSuccessfully(res, data) {
    res.writeHead(200, respondHeaders)
    if (data !== null) {
        res.write(JSON.stringify({
            "status": "successful",
            "data": data
        }))
    }
    res.end(); 
}

function responseWithError(res, httpCode, message) {
    res.writeHead(httpCode, respondHeaders)
    res.write(JSON.stringify({
        "status": "failed",
        "message": message
    }))
    res.end();
}

function httpListener(req, res)
{
    let body = "";
    req.on("data", (chunck) => body += chunck);
  
    if (req.url === "/todos" && req.method === "GET") {        
        responseSuccessfully(res, todos);
    }
    else if (req.url === "/todos" && req.method === "POST") {
        req.on("end", () => {
            try {
                const title = JSON.parse(body).title;
                if (title === undefined) {
                    throw new Error('title 未填寫');
                }

                todos.push({
                    "id": uuidv4(),
                    "title": title
                });

                responseSuccessfully(res, todos)
            } catch (error) {
                responseWithError(res, 400, error.message)    
            }
        });
    }
    else if (req.url === "/todos" && req.method === "DELETE") {
        todos.length = 0;
        responseSuccessfully(res, todos)
    }
    else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
        const id = req.url.split("/").pop();
        const index = todos.findIndex((item) => (item.id === id));
        if (index !== -1) {
            todos.splice(index, 1);

            responseSuccessfully(res, todos)
        } else {
            responseWithError(res, 400, "找不到該 todo");
        }
    }
    else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
        req.on("end", () => {
            try {
                const title = JSON.parse(body).title;
                if (title === undefined) {
                    throw new Error("title 未填寫");
                }

                const id = req.url.split("/").pop();
                const index = todos.findIndex((item) => item.id === id);
                if (index === -1) {
                    throw new Error("找不到該 todo")
                }

                todos[index].title = title;

                responseSuccessfully(res, todos);
            } catch (error) {
                responseWithError(res, 400, error.message);
            }    
        });
    }
    else if (req.method === "OPTIONS") {
        responseSuccessfully(res, null);
    }
    else {
        responseWithError(res, 404, "無此路由");
    }
}

http.createServer(httpListener).listen(port);
