const fs = require("fs/promises");

async function listarProdutos(req, res) {
    const categoria = req.query.categoria;
    const precoInicial = req.query.precoInicial;
    const precoFinal = req.query.precoFinal;

    const lista = JSON.parse(await fs.readFile("./dados/estoque.json"));

    if (categoria && precoInicial && precoFinal) {
        const filtroCategoriaEFaixa = lista.produtos.filter(produto => produto.categoria === categoria &&
            produto.preco >= precoInicial && produto.preco <= precoFinal &&
            produto.estoque > 0);
        res.json(filtroCategoriaEFaixa);
    }
    else if (categoria) {
        const categoriaFiltrada = lista.produtos.filter(produto => produto.categoria === categoria &&
            produto.estoque > 0);
        res.json(categoriaFiltrada);
    }
    else if (precoInicial && precoFinal) {
        const faixaDePreco = lista.produtos.filter(produto =>
            produto.preco >= precoInicial && produto.preco <= precoFinal &&
            produto.estoque > 0);
        res.json(faixaDePreco);
    }
    else {
        res.json(lista);
    }
}

module.exports = {
    listarProdutos
}