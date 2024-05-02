# HexTodolistKata-03

### 練習步驟

1. 初始設定
    + `npm init`, install `uuid`
    + add `"engines": {"node": "<node-version>"},` in `package.json`
    + create GitHub repo & `.gitignore`
2. set up HTTP server
    + `http.createServer(httpListener).listen(httpListenPort)`
    + implement functions `responseOk(...)` & `responseError(...)`
    + handle request body in `httpListener()`
3. create Postman collection for testing local API server
4. implement "GET", "OPTIONS", and "404" routes
5. implement "POST" route
5. implement "DELETE" routes (delete all todos, delete single todo)
6. implement "PATCH" route
7. final test using Postman
8. launch a Render service, connecting it to the GitHub repo
9. create Postman collection for testing the API server on Render
10. (optional) remove the Render service
