const { buildPathHtmlClientes } = require("./paths");
const dataClientes = require("./clientes.json");
const dataProveedores = require("./proveedores.json");
const { buildPathHtmlProveedores } = require("./paths");
const axios = require("axios");
const fs = require("fs");
const http = require("http");

http
  .createServer((req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });
    if (req.url === "/api/proveedores") {
      const url =
        "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
      axios.get(url).then((response) => {
        fs.writeFile(
          "./proveedores.json",
          JSON.stringify(response.data),
          "utf-8",
          (err) => {
            if (err) console.log(err);
          }
        );
        createTableProveedor();
        fs.readFile("./proveedores.html", null, (err, data) => {
          if (err) {
            console.log(err);
            res.writeHead(404);
            res.writeHead("Not Found!");
          } else {
            res.write(data);
          }
          res.end();
        });
      });
    } else if (req.url === "/api/clientes") {
      const url =
        "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";
      axios
        .get(url)
        .then((response) => {
          fs.writeFile(
            "./clientes.json",
            JSON.stringify(response.data),
            "utf-8",
            (err) => {
              if (err) console.log(err);
            }
          );
          createTableClientes();
          fs.readFile("./clientes.html", null, (err, data) => {
            if (err) {
              console.log(err);
              res.writeHead(404);
              res.writeHead("Not Found!");
            } else {
              res.write(data);
            }
            res.end();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  })
  .listen(8081);

//Tabla Clientes

const createRowCliente = (item) => `
    <tbody>
        <tr>
            <td>${item.idCliente}</td>
            <td>${item.NombreCompania}</td>
            <td>${item.NombreContacto}</td>
        </tr>
    </tbody>
`;
const createTableCliente = (rows) => `
  <table class="table table-striped">
    <thead>
        <tr>
            <th>Id Cliente</th>
            <th>Nombre Compañía</th>
            <th>Nombre Contacto</th>
        </tr>
    </thead>
    ${rows}
  </table>
`;

const createHtmlCliente = (table) => `
  <html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    </head>
    <body>
    <h1 style="text-align:center">Listado de clientes</h1>
      ${table}
    </body>
  </html>
`;

const doesFileExist = (filePath) => {
  try {
    fs.statSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

function createTableClientes() {
  console.log("Entra a funcion");
  try {
    if (doesFileExist(buildPathHtmlClientes)) {
      console.log("Deleting old build file");
      fs.unlinkSync(buildPathHtmlClientes);
    }
    const rows = dataClientes.map(createRowCliente).join("");
    const table = createTableCliente(rows);
    const html = createHtmlCliente(table);
    fs.writeFileSync(buildPathHtmlClientes, html);
    console.log("Se ha creado la tabla de clientes");
  } catch (error) {
    console.log("Error generating table", error);
  }
}

//Table Proveedores

const createRowProveedores = (item) => `
    <tbody>
        <tr>
            <td>${item.idproveedor}</td>
            <td>${item.nombrecompania}</td>
            <td>${item.nombrecontacto}</td>
        </tr>
    </tbody>
`;
const createTableProveedores = (rows) => `
  <table class="table table-striped">
        <thead>
            <tr>
                <th>Id Proveedor</th>
                <th>Nombre Compañía</th>
                <th>Nombre Contacto</th>
            </tr>
        </thead>
    ${rows}
  </table>
`;

const createHtmlProveedores = (table) => `
  <html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" crossorigin="anonymous">
    </head>
    <body>
        <h1 style="text-align:center">Listado de proveedores</h1>
      ${table}
    </body>
  </html>
`;

function createTableProveedor() {
  try {
    if (doesFileExist(buildPathHtmlProveedores)) {
      console.log("Deleting old build file");
      fs.unlinkSync(buildPathHtmlProveedores);
    }
    const rows = dataProveedores.map(createRowProveedores).join("");
    const table = createTableProveedores(rows);
    const html = createHtmlProveedores(table);
    fs.writeFileSync(buildPathHtmlProveedores, html);
    console.log("Se ha creado la tabla de proveedorees");
  } catch (error) {
    console.log("Error generating table", error);
  }
}
