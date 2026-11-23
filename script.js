// ---------- dados ----------

// lista de produtos da loja
var produtos = [
  { nome: "Accelo 1016", preco: 335086, imagem: "accelo.jpg" },
  { nome: "Delivery 11180", preco: 366541, imagem: "delivery.jpg" },
  { nome: "Fiorino Endurance", preco: 91332, imagem: "fiorino.jpg" }
];

// o carrinho começa vazio
var carrinho = [];

// desconto em porcentagem (0 = sem desconto)
var desconto = 0;

var cupomValido = "MOTOR10";
var cupomAplicado = false;

// ---------- pegando elementos do HTML ----------
var telaLoja = document.getElementById("tela-loja");
var telaFinalizacao = document.getElementById("tela-finalizacao");
var listaProdutos = document.getElementById("lista-produtos");
var itensCarrinho = document.getElementById("itens-carrinho");
var totalSpan = document.getElementById("total");
var mensagemCarrinho = document.getElementById("mensagem-carrinho");
var inputCupom = document.getElementById("cupom");
var msgCupom = document.getElementById("msg-cupom");
var msgContato = document.getElementById("msg-contato");
var itensFinalizacao = document.getElementById("itens-finalizacao");
var totalFinal = document.getElementById("total-final");
var linhaDesconto = document.getElementById("linha-desconto");
var selectPagamento = document.getElementById("pagamento");
var detalhesPagamento = document.getElementById("detalhes-pagamento");

// ---------- funções ----------

// deixa o preço no formato brasileiro (ex: 335.086,00)
function formatarPreco(valor) {
  // arredonda para 2 casas
  valor = Math.round(valor * 100) / 100;

  // separa a parte inteira dos centavos
  var inteiro = Math.floor(valor);
  var centavos = Math.round((valor - inteiro) * 100);

  // se os centavos forem menores que 10, coloca um zero na frente (ex: 05)
  var textoCentavos = "" + centavos;
  if (centavos < 10) {
    textoCentavos = "0" + centavos;
  }

  // percorre o numero de tras pra frente e coloca um ponto a cada 3 digitos
  var numero = "" + inteiro;
  var resultado = "";
  var contador = 0;

  for (var i = numero.length - 1; i >= 0; i--) {
    resultado = numero.charAt(i) + resultado;
    contador = contador + 1;

    if (contador === 3 && i > 0) {
      resultado = "." + resultado;
      contador = 0;
    }
  }

  return resultado + "," + textoCentavos;
}

// procura o produto no carrinho, se nao achar devolve -1
function acharNoCarrinho(nome) {
  for (var i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      return i;
    }
  }
  return -1;
}

// soma preco x quantidade de todos os itens
function calcularSubtotal() {
  var subtotal = 0;
  for (var i = 0; i < carrinho.length; i++) {
    subtotal = subtotal + carrinho[i].preco * carrinho[i].quantidade;
  }
  return subtotal;
}

// subtotal menos o desconto
function calcularTotal() {
  var subtotal = calcularSubtotal();
  var valorDesconto = subtotal * desconto / 100;
  return subtotal - valorDesconto;
}

// cria os cards dos produtos na tela
function mostrarProdutos() {
  listaProdutos.innerHTML = "";

  for (var i = 0; i < produtos.length; i++) {
    listaProdutos.innerHTML +=
      '<div class="card-produto">' +
      '<div class="caixa-imagem"><img src="' + produtos[i].imagem + '" alt="' + produtos[i].nome + '"></div>' +
      '<h3>' + produtos[i].nome + '</h3>' +
      '<p class="preco">R$ ' + formatarPreco(produtos[i].preco) + ' por unidade</p>' +
      '<button type="button" class="botao botao-add" onclick="adicionarAoCarrinho(' + i + ')">Adicionar ao carrinho</button>' +
      '</div>';
  }
}

// adiciona o produto, ou soma 1 se ele ja estiver no carrinho
function adicionarAoCarrinho(indice) {
  var produto = produtos[indice];
  var posicao = acharNoCarrinho(produto.nome);

  if (posicao === -1) {
    carrinho.push({ nome: produto.nome, preco: produto.preco, quantidade: 1 });
  } else {
    carrinho[posicao].quantidade = carrinho[posicao].quantidade + 1;
  }

  mensagemCarrinho.innerHTML = produto.nome + " foi adicionado ao carrinho.";
  atualizarCarrinho();
}

function aumentarQuantidade(indice) {
  carrinho[indice].quantidade = carrinho[indice].quantidade + 1;
  mensagemCarrinho.innerHTML = "Quantidade de " + carrinho[indice].nome + " aumentada.";
  atualizarCarrinho();
}

// diminui 1, e se so tiver 1 remove o item
function diminuirQuantidade(indice) {
  if (carrinho[indice].quantidade > 1) {
    carrinho[indice].quantidade = carrinho[indice].quantidade - 1;
    mensagemCarrinho.innerHTML = "Quantidade de " + carrinho[indice].nome + " diminuída.";
    atualizarCarrinho();
  } else {
    removerDoCarrinho(indice);
  }
}

// monta um carrinho novo sem o item que foi removido
function removerDoCarrinho(indice) {
  var novoCarrinho = [];
  for (var i = 0; i < carrinho.length; i++) {
    if (i !== indice) {
      novoCarrinho.push(carrinho[i]);
    }
  }
  carrinho = novoCarrinho;
  mensagemCarrinho.innerHTML = "Item removido do carrinho.";
  atualizarCarrinho();
}

// redesenha a tabela do carrinho e o total
function atualizarCarrinho() {
  itensCarrinho.innerHTML = "";

  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = '<tr><td colspan="4">Seu carrinho está vazio.</td></tr>';
  }

  for (var i = 0; i < carrinho.length; i++) {
    itensCarrinho.innerHTML +=
      "<tr>" +
      "<td>" + carrinho[i].nome + "</td>" +
      "<td>R$ " + formatarPreco(carrinho[i].preco) + "</td>" +
      "<td>" + carrinho[i].quantidade + "</td>" +
      "<td>" +
      '<button type="button" class="botao botao-acao botao-diminuir" onclick="diminuirQuantidade(' + i + ')">- Diminuir</button>' +
      '<button type="button" class="botao botao-acao botao-aumentar" onclick="aumentarQuantidade(' + i + ')">+ Aumentar</button>' +
      '<button type="button" class="botao botao-acao botao-remover" onclick="removerDoCarrinho(' + i + ')">Remover</button>' +
      "</td>" +
      "</tr>";
  }

  totalSpan.innerHTML = formatarPreco(calcularTotal());
}

// confere o cupom digitado
function aplicarCupom() {
  var codigo = inputCupom.value;

  if (codigo === "") {
    msgCupom.innerHTML = "Digite um cupom.";
  } else if (codigo === cupomValido && cupomAplicado === false) {
    desconto = 10;
    cupomAplicado = true;
    msgCupom.innerHTML = "Cupom aplicado! Você ganhou 10% de desconto.";
  } else if (codigo === cupomValido && cupomAplicado === true) {
    msgCupom.innerHTML = "Esse cupom já foi aplicado.";
  } else {
    desconto = 0;
    cupomAplicado = false;
    msgCupom.innerHTML = "Cupom inválido.";
  }

  atualizarCarrinho();
}

// preenche a tela de finalização
function montarFinalizacao() {
  itensFinalizacao.innerHTML = "";

  for (var i = 0; i < carrinho.length; i++) {
    var subtotalItem = carrinho[i].preco * carrinho[i].quantidade;

    itensFinalizacao.innerHTML +=
      "<tr>" +
      "<td>" + carrinho[i].nome + "</td>" +
      "<td>" + carrinho[i].quantidade + "</td>" +
      "<td>R$ " + formatarPreco(carrinho[i].preco) + "</td>" +
      "<td>R$ " + formatarPreco(subtotalItem) + "</td>" +
      "</tr>";
  }

  if (desconto > 0) {
    linhaDesconto.innerHTML = "Desconto do cupom: " + desconto + "%";
  } else {
    linhaDesconto.innerHTML = "";
  }

  totalFinal.innerHTML = formatarPreco(calcularTotal());
  mostrarDetalhesPagamento();
}

// texto que muda conforme a forma de pagamento
function mostrarDetalhesPagamento() {
  var forma = selectPagamento.value;
  var total = calcularTotal();

  if (forma === "financiamento") {
    detalhesPagamento.innerHTML = "Financiamento próprio: as parcelas são combinadas com a loja, depois da análise de crédito.";
  } else if (forma === "cartao") {
    detalhesPagamento.innerHTML = "Cartão de crédito: em até 12x de R$ " + formatarPreco(total / 12) + " (valor aproximado, sem juros).";
  } else if (forma === "boleto") {
    detalhesPagamento.innerHTML = "Boleto bancário: vencimento em 3 dias úteis depois da confirmação da compra.";
  } else if (forma === "pix") {
    detalhesPagamento.innerHTML = "Pix: pagamento à vista, aprovação imediata.";
  }
}

// vai da loja para a tela de finalização
function irParaFinalizacao() {
  if (carrinho.length === 0) {
    mensagemCarrinho.innerHTML = "Adicione produtos antes de finalizar a compra.";
    return;
  }

  montarFinalizacao();
  telaLoja.style.display = "none";
  telaFinalizacao.style.display = "block";
}

function voltarParaLoja() {
  telaFinalizacao.style.display = "none";
  telaLoja.style.display = "block";
}

// confirma a compra e limpa tudo
function confirmarCompra() {
  carrinho = [];
  desconto = 0;
  cupomAplicado = false;
  inputCupom.value = "";
  msgCupom.innerHTML = "";

  atualizarCarrinho();
  voltarParaLoja();
  mensagemCarrinho.innerHTML = "Compra realizada com sucesso! Obrigado.";
}

// formulário de contato
function enviarContato() {
  var nome = document.getElementById("nome").value;
  var email = document.getElementById("email").value;

  if (nome === "" || email === "") {
    msgContato.innerHTML = "Preencha o nome e o e-mail.";
  } else if (email.indexOf("@") === -1) {
    msgContato.innerHTML = "Digite um e-mail válido.";
  } else {
    msgContato.innerHTML = "Obrigado, " + nome + "! Sua mensagem foi enviada.";
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
  }
}

// ---------- quando a pagina abre ----------
mostrarProdutos();
atualizarCarrinho();
