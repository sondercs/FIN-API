const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

//  Middleware
function verifyIfExistsAccontCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(404).json({ error: "Customer not found!" });
  }

  request.customer = customer;

  return next();
}

app.post("/accont", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customers) => customers.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists! " });
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return response.status(201).send();
});

app.get("/statement", verifyIfExistsAccontCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer.statement);
});

app.listen(3333);
//  http://localhost:3333
