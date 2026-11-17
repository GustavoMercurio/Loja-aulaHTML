// ===== DADOS =====
// Lista de produtos (array de objetos)
var produtos = [
  { nome: "Accelo 1016", preco: 335086.0, imagem: "accelo.jpg" },
  { nome: "Delivery 11180", preco: 366541.0, imagem: "delivery.jpg" },
  { nome: "Fiorino Endurance", preco: 91332.0, imagem: "fiorino.jpg" }
];

// Carrinho começa vazio. Cada item tem nome, preço e quantidade
var carrinho = [];

// Desconto atual em porcentagem (0 = sem desconto)
var desconto = 0;

// Cupom válido
var cupomValido = "MOTOR10";

// ===== PEGANDO ELEMENTOS DA PÁGINA (DOM) =====
// Telas
var telaLoja = document.getElementById("tela-loja");
var telaFinalizacao = document.getElementById("tela-finalizacao");

// Loja
var listaProdutos = document.getElementById("lista-produtos");
var itensCarrinho = document.getElementById("itens-carrinho");
var totalSpan = document.getElementById("total");
var mensagemCarrinho = document.getElementById("mensagem-carrinho");
var formCupom = document.getElementById("form-cupom");
var inputCupom = document.getElementById("cupom");
var msgCupom = document.getElementById("msg-cupom");
var botaoFinalizar = document.getElementById("botao-finalizar");
var formContato = document.getElementById("form-contato");
var msgContato = document.getElementById("msg-contato");

// Finalização
var itensFinalizacao = document.getElementById("itens-finalizacao");
var totalFinal = document.getElementById("total-final");
var selectPagamento = document.getElementById("pagamento");
var detalhesPagamento = document.getElementById("detalhes-pagamento");
var botaoVoltar = document.getElementById("botao-voltar");
var botaoConfirmar = document.getElementById("botao-confirmar");

// ===== FUNÇÕES =====

// Deixa o preço no formato brasileiro (ex: 335.086,00)
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Procura se o produto já está no carrinho. Retorna a posição ou -1
function acharNoCarrinho(nome) {
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].nome === nome) {
      return i;
    }
  }
  return -1;
}

// Calcula o subtotal (sem desconto) somando preço x quantidade
function calcularSubtotal() {
  let subtotal = 0;
  for (let i = 0; i < carrinho.length; i++) {
    subtotal = subtotal + carrinho[i].preco * carrinho[i].quantidade;
  }
  return subtotal;
}

// Calcula o total já com o desconto
function calcularTotal() {
  let subtotal = calcularSubtotal();
  let valorDesconto = subtotal * desconto / 100;
  return subtotal - valorDesconto;
}

// Mostra os produtos na tela
function mostrarProdutos() {
  listaProdutos.innerHTML = "";

  // Repetição: cria um card para cada produto
  for (let i = 0; i < produtos.length; i++) {
    let produto = produtos[i];

    let card = document.createElement("div");
    card.className = "card-produto";
    card.innerHTML =
      '<img src="' + produto.imagem + '" alt="' + produto.nome + '">' +
      "<h3>" + produto.nome + "</h3>" +
      '<p class="preco">R$ ' + formatarPreco(produto.preco) + " por unidade</p>" +
      '<button class="botao botao-add">Adicionar ao carrinho</button>';

    listaProdutos.appendChild(card);

    // Evento de clique no botão do produto
    let botao = card.querySelector(".botao-add");
    botao.addEventListener("click", function () {
      adicionarAoCarrinho(produto);
    });
  }
}

// Adiciona um produto no carrinho (ou soma 1 se ele já estiver lá)
function adicionarAoCarrinho(produto) {
  let posicao = acharNoCarrinho(produto.nome);

  // Condicional: já existe no carrinho ou não
  if (posicao === -1) {
    carrinho.push({ nome: produto.nome, preco: produto.preco, quantidade: 1 });
  } else {
    carrinho[posicao].quantidade = carrinho[posicao].quantidade + 1;
  }

  mensagemCarrinho.textContent = produto.nome + " foi adicionado ao carrinho.";
  atualizarCarrinho();
}

// Aumenta a quantidade de um item pelo índice
function aumentarQuantidade(indice) {
  carrinho[indice].quantidade = carrinho[indice].quantidade + 1;
  mensagemCarrinho.textContent = "Quantidade de " + carrinho[indice].nome + " aumentada.";
  atualizarCarrinho();
}

// Diminui a quantidade de um item pelo índice.
// Se chegar a zero, o item é removido do carrinho
function diminuirQuantidade(indice) {
  // Condicional: quantidade maior que 1 ou não
  if (carrinho[indice].quantidade > 1) {
    carrinho[indice].quantidade = carrinho[indice].quantidade - 1;
    mensagemCarrinho.textContent = "Quantidade de " + carrinho[indice].nome + " diminuída.";
  } else {
    carrinho.splice(indice, 1);
    mensagemCarrinho.textContent = "Item removido do carrinho.";
  }
  atualizarCarrinho();
}

// Remove um item pelo índice (posição na lista)
function removerDoCarrinho(indice) {
  carrinho.splice(indice, 1);
  mensagemCarrinho.textContent = "Item removido.";
  atualizarCarrinho();
}

// Atualiza a tabela da loja e o total
function atualizarCarrinho() {
  itensCarrinho.innerHTML = "";

  // Condicional: carrinho vazio ou não
  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = '<tr><td colspan="4">Seu carrinho está vazio.</td></tr>';
  }

  // Repetição: monta uma linha da tabela para cada item
  for (let i = 0; i < carrinho.length; i++) {
    let item = carrinho[i];

    itensCarrinho.innerHTML +=
      "<tr>" +
      "<td>" + item.nome + "</td>" +
      "<td>R$ " + formatarPreco(item.preco) + "</td>" +
      "<td>" + item.quantidade + "</td>" +
      "<td>" +
        '<button class="botao botao-acao botao-diminuir" data-indice="' + i + '">− Diminuir</button>' +
        '<button class="botao botao-acao botao-aumentar" data-indice="' + i + '">+ Aumentar</button>' +
        '<button class="botao botao-acao botao-remover" data-indice="' + i + '">Remover</button>' +
      "</td>" +
      "</tr>";
  }

  // Mostra o total com o desconto
  totalSpan.textContent = formatarPreco(calcularTotal());

  // Evento de clique em cada botão "− Diminuir"
  let botoesDiminuir = document.querySelectorAll(".botao-diminuir");
  for (let i = 0; i < botoesDiminuir.length; i++) {
    botoesDiminuir[i].addEventListener("click", function () {
      let indice = Number(this.getAttribute("data-indice"));
      diminuirQuantidade(indice);
    });
  }

  // Evento de clique em cada botão "+ Aumentar"
  let botoesAumentar = document.querySelectorAll(".botao-aumentar");
  for (let i = 0; i < botoesAumentar.length; i++) {
    botoesAumentar[i].addEventListener("click", function () {
      let indice = Number(this.getAttribute("data-indice"));
      aumentarQuantidade(indice);
    });
  }

  // Evento de clique em cada botão "Remover"
  let botoesRemover = document.querySelectorAll(".botao-remover");
  for (let i = 0; i < botoesRemover.length; i++) {
    botoesRemover[i].addEventListener("click", function () {
      let indice = Number(this.getAttribute("data-indice"));
      removerDoCarrinho(indice);
    });
  }
}

// Mostra na tela de finalização os itens, o total e o pagamento
function montarFinalizacao() {
  itensFinalizacao.innerHTML = "";

  for (let i = 0; i < carrinho.length; i++) {
    let item = carrinho[i];
    let subtotalItem = item.preco * item.quantidade;

    itensFinalizacao.innerHTML +=
      "<tr>" +
      "<td>" + item.nome + "</td>" +
      "<td>" + item.quantidade + "</td>" +
      "<td>R$ " + formatarPreco(item.preco) + "</td>" +
      "<td>R$ " + formatarPreco(subtotalItem) + "</td>" +
      "</tr>";
  }

  totalFinal.textContent = formatarPreco(calcularTotal());
  mostrarDetalhesPagamento();
}

// Mostra os detalhes da forma de pagamento escolhida
function mostrarDetalhesPagamento() {
  let forma = selectPagamento.value;
  let total = calcularTotal();

  // Condicionais para cada forma de pagamento
  if (forma === "financiamento") {
    detalhesPagamento.textContent =
      "Financiamento próprio: as parcelas são combinadas diretamente com a loja, após a análise de crédito.";
  } else if (forma === "cartao") {
    detalhesPagamento.textContent =
      "Cartão de crédito: em até 12x de R$ " + formatarPreco(total / 12) + " (valor aproximado, sem juros).";
  } else if (forma === "boleto") {
    detalhesPagamento.textContent =
      "Boleto bancário: vencimento em 3 dias úteis após a confirmação da compra.";
  } else if (forma === "pix") {
    detalhesPagamento.textContent =
      "Pix: pagamento à vista, com aprovação imediata após a confirmação.";
  }
}

// Troca da tela da loja para a tela de finalização
function irParaFinalizacao() {
  // Condicional: não deixa finalizar com carrinho vazio
  if (carrinho.length === 0) {
    mensagemCarrinho.textContent = "Adicione produtos antes de finalizar a compra.";
    return;
  }

  montarFinalizacao();
  telaLoja.classList.add("oculto");
  telaFinalizacao.classList.remove("oculto");
  window.scrollTo(0, 0);
}

// Volta da tela de finalização para a loja
function voltarParaLoja() {
  telaFinalizacao.classList.add("oculto");
  telaLoja.classList.remove("oculto");
  window.scrollTo(0, 0);
}

// ===== EVENTOS =====

// Aplicar cupom (o formulário não recarrega a página)
formCupom.addEventListener("submit", function (evento) {
  evento.preventDefault();

  let codigo = inputCupom.value.trim().toUpperCase();

  // Condicionais com operadores lógicos
  if (codigo === "") {
    desconto = 0;
    msgCupom.textContent = "Digite um cupom.";
  } else if (codigo === cupomValido) {
    desconto = 10;
    msgCupom.textContent = "Cupom aplicado! Você ganhou 10% de desconto.";
  } else {
    desconto = 0;
    msgCupom.textContent = "Cupom inválido.";
  }

  atualizarCarrinho();
});

// Botão Finalizar compra (abre a tela de finalização)
botaoFinalizar.addEventListener("click", irParaFinalizacao);

// Botão Voltar ao carrinho
botaoVoltar.addEventListener("click", voltarParaLoja);

// Mudar a forma de pagamento atualiza os detalhes
selectPagamento.addEventListener("change", mostrarDetalhesPagamento);

// Botão Confirmar compra
botaoConfirmar.addEventListener("click", function () {
  let forma = selectPagamento.options[selectPagamento.selectedIndex].text;

  // Limpa o carrinho e o cupom
  carrinho = [];
  desconto = 0;
  inputCupom.value = "";
  msgCupom.textContent = "";

  atualizarCarrinho();
  voltarParaLoja();
  mensagemCarrinho.textContent = "Compra realizada com sucesso! Pagamento: " + forma + ". Obrigado.";
});

// Formulário de contato
formContato.addEventListener("submit", function (evento) {
  evento.preventDefault();

  let nome = document.getElementById("nome").value;
  let email = document.getElementById("email").value;

  // Operador lógico && (e): precisa ter nome E e-mail com @
  if (nome !== "" && email.indexOf("@") !== -1) {
    msgContato.textContent = "Obrigado, " + nome + "! Sua mensagem foi enviada.";
    formContato.reset();
  } else {
    msgContato.textContent = "Preencha o nome e um e-mail válido.";
  }
});

// ===== INICIALIZAÇÃO =====
mostrarProdutos();
atualizarCarrinho();
