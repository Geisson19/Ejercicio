// Import de http
const http = require("http");
// Import de axios
const axios = require("axios");
// import del file system
const fs = require("fs");

/*
  Funciones asincrónicas para obtener las promesas de los links de proveedores y clientes
*/
async function getProveedores() {
  const resp = await axios.get(
    "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json"
  );

  return resp.data;
}

async function getClientes() {
  const resp = await axios.get(
    "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json"
  );
  return resp.data;
}

/* Escribiendo en los html base*/
const escribirProveedor = (id, compania, contacto) => {
  fs.appendFile(
    "proveedores.html",
    `<tr>
      <th scope="row">${id}</th>
      <td>${compania}</td>
      <td>${contacto}</td>
     </tr>`,
    "utf-8",
    (err) => {
      if (err) console.log("Error writing file");
    }
  );
};

const escribirCliente = (id, nombre, contacto) => {
  fs.appendFile(
    "clientes.html",
    `<tr>
      <th scope="row">${id}</th>
      <td>${nombre}</td>
      <td>${contacto}</td>
     </tr>`,
    "utf-8",
    (err) => {
      if (err) console.log("Error writing file");
    }
  );
};

const abrirHTML = (provclientes) => {
  fs.writeFile(
    `${provclientes.toLowerCase()}.html`,
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, shrink-to-fit=no"
    />

    <!-- Bootstrap CSS -->
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
      crossorigin="anonymous"
    />

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script
      src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
      integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
      integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
      integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
      crossorigin="anonymous"
    ></script>

    <title>${provclientes}</title>
  </head>
  <body>
    <h2>Listado de ${provclientes}</h2>

    <table class="table">
      <thead class="thead-dark">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Nombre</th>
          <th scope="col">Contacto</th>
        </tr>
      </thead>
      <tbody>`,
    "utf-8",
    (err) => {
      if (err) console.log("Error writing file");
    }
  );
};

const cerrarHTML = (provclientes) => {
  fs.appendFile(
    `${provclientes.toLowerCase()}.html`,
    `</tbody>
        </table>
      </body>
    </html>`,
    "utf-8",
    (err) => {
      if (err) console.log("Error writing file");
    }
  );
};

// Instancia del servidor.
http
  .createServer(async function (req, res) {
    //head
    res.writeHead(200, { "Content-Type": "text/html" });

    // get de los datos de los proveedores
    const proveedoresData = await getProveedores();

    // get de los datos de los clientes
    const clientesData = await getClientes();

    //Creamos los dos html base
    abrirHTML("Proveedores");
    abrirHTML("Clientes");

    //Llenamos los datos
    for (let proveedor of proveedoresData) {
      escribirProveedor(
        proveedor.idproveedor,
        proveedor.nombrecompania,
        proveedor.nombrecontacto
      );
    }

    for (let cliente of clientesData) {
      escribirCliente(
        cliente.idCliente,
        cliente.NombreCompania,
        cliente.NombreContacto
      );
    }

    //Cerreando los htmls
    cerrarHTML("Proveedores");
    cerrarHTML("Clientes");

    console.log("url", req.url);

    // Imprimimos el html final en el servidor dependiendo la url
    if (req.url === "/api/proveedores") {
      fs.readFile(`proveedores.html`, "utf8", function (err, data) {
        if (err) {
          return console.log(err);
        }
        res.end(data);
      });
    } else if (req.url === "/api/clientes") {
      fs.readFile(`clientes.html`, "utf8", function (err, data) {
        if (err) {
          return console.log(err);
        }
        res.end(data);
      });
    }
  })
  .listen(8081);
