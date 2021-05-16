const express = require("express"); 
const produtos = require("./controladores/produtos"); 
const carrinho = require("./controladores/carrinho"); 
const finalizar = require("./controladores/finalizar.js"); 

const roteador = express(); 

//PRODUTOS
roteador.get("/produtos", produtos.listarProdutos); 

//CARRINHO
roteador.get("/carrinho", carrinho.verificarCarrinho); 
roteador.post("/carrinho/produtos", carrinho.adicionarProduto); 
roteador.patch("/carrinho/produtos/:idProduto", carrinho.alterarProduto); 
roteador.delete("/carrinho/produtos/:idProduto", carrinho.deletarProduto); 
roteador.delete("/carrinho", carrinho.limparCarrinho); 

//FINALIZAR COMPRAS
roteador.post("/finalizar-compras", finalizar.verificarCarrinho); 

module.exports = roteador; 