const fs = require("fs/promises");

function atualizarValores(carrinho) {
    let produtoSubTotal = 0;
    for (let produto of carrinho.produtos) {
        produtoSubTotal += (produto.quantidade * produto.preco);
    }
    carrinho.subTotal = produtoSubTotal;

    let dataDoPedido = new Date();
    dataDoPedido.setDate(dataDoPedido.getDate() + 15);

    carrinho.dataDeEntrega = dataDoPedido;

    let entrega = 0;
    if (produtoSubTotal <= 20000) {
        entrega = 5000;
    }

    carrinho.valorDoFrete = entrega;

    carrinho.totalAPagar = (produtoSubTotal + entrega);
}

async function verificarCarrinho(req, res) {

    const carrinho = JSON.parse(await fs.readFile('./dados/carrinho.json'));
    res.json(carrinho);

}

async function adicionarProduto(req, res) {
    const idProduto = Number(req.body.id);
    const quantidadeProduto = Number(req.body.quantidade);

    if (quantidadeProduto > 0) {

        const estoque = await fs.readFile('./dados/estoque.json');
        const produtoEstoque = JSON.parse(estoque);

        const produtoEncontrado = produtoEstoque.produtos.find(produto =>
            produto.id === idProduto);

        //validação se o produto existe 
        if (!produtoEncontrado) {
            return res.status(404).json({ mensagem: "Produto não encontrado!" });
        } else {

            if (quantidadeProduto <= produtoEncontrado.estoque) {

                const verCarrinho = await fs.readFile("./dados/carrinho.json");
                const buscarCarrinho = JSON.parse(verCarrinho);

                const produtoDoCarrinho = buscarCarrinho.produtos.find(p =>
                    p.id === idProduto);

                if (produtoDoCarrinho) {

                    const indexCarrinho = buscarCarrinho.produtos.findIndex(p =>
                        p.id === idProduto);

                    buscarCarrinho.produtos[indexCarrinho].quantidade += quantidadeProduto;

                } else {

                    const produtoCarrinho = {
                        id: produtoEncontrado.id,
                        quantidade: quantidadeProduto,
                        nome: produtoEncontrado.nome,
                        preco: produtoEncontrado.preco,
                        categoria: produtoEncontrado.categoria
                    };

                    buscarCarrinho.produtos.push(produtoCarrinho);

                }

                atualizarValores(buscarCarrinho);

                fs.writeFile("./dados/carrinho.json", JSON.stringify(buscarCarrinho, null, 2));

                res.status(201).json(buscarCarrinho);


            } else {
                return res.status(404).json({
                    mensagem:
                        "A quantidade do produto que deseja é maior que a que há em nosso estoque!"
                });
            }
        }
    } else {
        return res.status(404).json({ mensagem: "A quantidade do produto deve ser um número positivo!" });
    }


}

async function alterarProduto(req, res) {
    const idProduto = Number(req.params.idProduto);
    const quantidadeProduto = Number(req.body.quantidade);

    const verCarrinho = await fs.readFile("./dados/carrinho.json");
    const buscarCarrinho = JSON.parse(verCarrinho);

    const produtoDoCarrinho = buscarCarrinho.produtos.find(p =>
        p.id === idProduto);

    const quantidadeNoCarrinho = produtoDoCarrinho.quantidade;

    if (produtoDoCarrinho) {

        const estoque = await fs.readFile('./dados/estoque.json');
        const produtoEstoque = JSON.parse(estoque);

        const produtoEncontrado = produtoEstoque.produtos.find(produto =>
            produto.id === idProduto);

        const quantidadeDeCompra = quantidadeNoCarrinho + (quantidadeProduto);

        if (produtoEncontrado.estoque < quantidadeDeCompra) {
            return res.status(404).json({
                mensagem:
                    "A quantidade desejada ultrapassa o nosso estoque!"
            });
        } else {
            produtoDoCarrinho.quantidade += quantidadeProduto;

            atualizarValores(buscarCarrinho);

            fs.writeFile("./dados/carrinho.json", JSON.stringify(buscarCarrinho, null, 2));
            res.json(buscarCarrinho);
        }

    } else {
        return res.status(404).json({
            mensagem:
                "O ID informado não foi encontrado. Verifique se o ID é válido!"
        });

    }

}

async function deletarProduto(req, res) {
    const idProduto = Number(req.params.idProduto);

    const verCarrinho = await fs.readFile("./dados/carrinho.json");
    const buscarCarrinho = JSON.parse(verCarrinho);

    const produtoDoCarrinho = buscarCarrinho.produtos.find(p =>
        p.id === idProduto);

    if (produtoDoCarrinho) {

        const indexCarrinho = buscarCarrinho.produtos.findIndex(p =>
            p.id === idProduto);

        buscarCarrinho.produtos.splice(indexCarrinho, 1);

        atualizarValores(buscarCarrinho);

        fs.writeFile("./dados/carrinho.json", JSON.stringify(buscarCarrinho, null, 2));

        res.json(buscarCarrinho);

    } else {
        return res.status(404).json({ mensagem: "O ID informado não está associado a nenhum produto!" });
    }
}

async function deletandoProdutos() {

    fs.writeFile("./dados/carrinho.json", JSON.stringify({
        "subTotal": 0,
        "dataDeEntrega": null,
        "valorDoFrete": 0,
        "totalAPagar": 0,
        "produtos": []
    }, null, 2));

}

async function limparCarrinho(req, res) {
    await deletandoProdutos()
    return res.json({ mensagem: "Operação realizada com Sucesso!" });
}

module.exports = {
    verificarCarrinho,
    adicionarProduto,
    alterarProduto,
    deletarProduto,
    limparCarrinho,
    deletarProduto
}