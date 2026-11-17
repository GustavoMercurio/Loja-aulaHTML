// ===== DADOS =====
// Lista de produtos (array de objetos)
var produtos = [
  { nome: "Accelo 1016", preco: 335086.0, imagem: "https://picsum.photos/seed/accelo/300/200" },
  { nome: "Delivery 11180", preco: 366541.0, imagem: "https://picsum.photos/seed/delivery/300/200" },
  { nome: "Fiorino Endurance", preco: 91332.0, imagem: "https://picsum.photos/seed/fiorino/300/200" }
];

// Carrinho começa vazio
var carrinho = [];

// Desconto atual em porcentagem (0 = sem desconto)
var desconto = 0;

// Cupom válido
var cupomValido = "MOTOR10";

// ===== PEGANDO ELEMENTOS DA PÁGINA (DOM) =====
var listaProdutos = document.getElementById("lista-produtos");
var itensCarrinho = document.getElementById("itens-carrinho");
var totalSpan = document.getElementById("total");
var mensagemCarrinho = document.getElementById("mensagem-carrinho");
var formCupom = document.getElementById("form-cupom");
var inputCupom = document.getElementById("cupom");
var msgCupom = document.getElementById("msg-cupom");
var botaoComprar = document.getElementById("botao-comprar");
var formContato = document.getElementById("form-contato");
var msgContato = document.getElementById("msg-contato");

// ===== FUNÇÕES =====

// Deixa o preço no formato brasileiro (ex: 335.086,00)
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
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

// Adiciona um produto no carrinho
function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  mensagemCarrinho.textContent = produto.nome + " foi adicionado ao carrinho.";
  atualizarCarrinho();
}

// Remove um item pelo índice (posição na lista)
function removerDoCarrinho(indice) {
  carrinho.splice(indice, 1);
  mensagemCarrinho.textContent = "Item removido.";
  atualizarCarrinho();
}

// Atualiza a tabela, o total e o desconto
function atualizarCarrinho() {
  itensCarrinho.innerHTML = "";

  // Condicional: carrinho vazio ou não
  if (carrinho.length === 0) {
    itensCarrinho.innerHTML = '<tr><td colspan="3">Seu carrinho está vazio.</td></tr>';
  }

  let subtotal = 0;

  // Repetição: monta uma linha da tabela para cada item
  for (let i = 0; i < carrinho.length; i++) {
    let item = carrinho[i];
    subtotal = subtotal + item.preco;

    itensCarrinho.innerHTML +=
      "<tr>" +
      "<td>" + item.nome + "</td>" +
      "<td>R$ " + formatarPreco(item.preco) + "</td>" +
      '<td><button class="botao botao-remover" data-indice="' + i + '">Remover</button></td>' +
      "</tr>";
  }

  // Operações matemáticas: calcula o desconto e o total
  let valorDesconto = subtotal * desconto / 100;
  let total = subtotal - valorDesconto;
  totalSpan.textContent = formatarPreco(total);

  // Evento de clique em cada botão "Remover"
  let botoesRemover = document.querySelectorAll(".botao-remover");
  for (let i = 0; i < botoesRemover.length; i++) {
    botoesRemover[i].addEventListener("click", function () {
      let indice = Number(this.getAttribute("data-indice"));
      removerDoCarrinho(indice);
    });
  }
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

// Botão de comprar
botaoComprar.addEventListener("click", function () {
  if (carrinho.length === 0) {
    mensagemCarrinho.textContent = "Adicione produtos antes de comprar.";
    return;
  }

  mensagemCarrinho.textContent = "Compra realizada com sucesso! Obrigado.";

  // Limpa o carrinho e o cupom
  carrinho = [];
  desconto = 0;
  inputCupom.value = "";
  msgCupom.textContent = "";
  atualizarCarrinho();
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
