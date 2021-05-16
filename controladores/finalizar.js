const fs = require("fs/promises");

async function validarCliente(dados) {

    if (dados.country.lenght !== 2) {
        return "O campo 'Country' deve ter 2 dígitos";
    }

    if (dados.type !== "individual") {
        return "O campo 'type' deve ser preenchido com 'individual'";
    }

    if (!dados.name.includes(" ")) {
        return  "O campo 'nome' deve ter nome e sobrenome";
    }

    if (dados.documents[0].number.lenght || isNaN(dados.documents[0].number)) {
        return  "O campo 'documents', 'cpf' deve ser númerico e ter 11 dígitos";
    }

}

async function verificarCarrinho(req, res) {

    const dadosCliente = req.body;

    
    const error = validarCliente(dadosCliente);
    

    if (error) {
        res.status(400);
        return res.json({ mensagem: error });
    } else {
        const estoque = JSON.parse(await fs.readFile('./dados/estoque.json'));
        const carrinho = JSON.parse(await fs.readFile('./dados/carrinho.json'));


        //VERFICANDO SE O CARRINHO ESTÁ VAZIO
        const carrinhoVazio = carrinho.produtos.length;

        if (carrinhoVazio <= 0) {
            return res.status(404).json({ mensagem: "O carrinho está vazio!" });
        } else {
            return res.status(404).json({ mensagem: "IMPLEMENTANDO: CARRINHO ESTÁ COM PRODUTOS!" });
            const idProduto = carrinho.produtos[0].id;
            const produtoDoCarrinho = carrinho.produtos.find(produto =>
                produto.id === idProduto);
        }
   }


}


module.exports = {
    verificarCarrinho
}