const state = {
  produtos: [
    {
      id: 1,
      nome: "Vestido Midi Floral",
      categoria: "Vestidos",
      tamanho: "M",
      marca: "Zara",
      preco: 189.90,
      estoque: 14,
      status: "Ativo"
    },
    {
      id: 2,
      nome: "Calça Wide Leg",
      categoria: "Calça",
      tamanho: "M",
      marca: "Renner",
      preco: 159.90,
      estoque: 8,
      status: "Ativo"
    },
    {
      id: 3,
      nome: "Blusa Tricot",
      categoria: "Blusas",
      tamanho: "P",
      marca: "C&A",
      preco: 119.90,
      estoque: 23,
      status: "Ativo"
    },
    {
      id: 4,
      nome: "Casaco Cropped",
      categoria: "Casaco",
      tamanho: "G",
      marca: "Farm",
      preco: 229.90,
      estoque: 4,
      status: "Baixo estoque"
    },
    {
      id: 5,
      nome: "Saia Plissada",
      categoria: "Saia",
      tamanho: "M",
      marca: "Animale",
      preco: 139.90,
      estoque: 0,
      status: "Esgotado"
    }
  ],

  categoriasProduto: [
    "Calça",
    "Saia",
    "Casaco",
    "Vestidos",
    "Blusas"
  ],

  tamanhosProduto: ["PP", "P", "M", "G", "GG"],

  vendas: [
    {
      id: "#1048",
      cliente: "Mariana Souza",
      produtoId: 1,
      produtoNome: "Vestido Midi Floral",
      data: "16/09/2026",
      itens: 3,
      precoUnitario: 189.90,
      total: 569.70,
      pagamento: "PIX",
      controlaEstoque: false
    },
    {
      id: "#1047",
      cliente: "Camila Oliveira",
      produtoId: 2,
      produtoNome: "Calça Wide Leg",
      data: "16/09/2026",
      itens: 2,
      precoUnitario: 159.90,
      total: 319.80,
      pagamento: "Débito",
      controlaEstoque: false
    },
    {
      id: "#1046",
      cliente: "Juliana Costa",
      produtoId: 3,
      produtoNome: "Blusa Tricot",
      data: "15/09/2026",
      itens: 4,
      precoUnitario: 119.90,
      total: 479.60,
      pagamento: "Crédito",
      controlaEstoque: false
    },
    {
      id: "#1045",
      cliente: "Beatriz Santos",
      produtoId: 1,
      produtoNome: "Vestido Midi Floral",
      data: "15/09/2026",
      itens: 1,
      precoUnitario: 189.90,
      total: 189.90,
      pagamento: "Dinheiro",
      controlaEstoque: false
    },
    {
      id: "#1044",
      cliente: "Mariana Souza",
      produtoId: 2,
      produtoNome: "Calça Wide Leg",
      data: "14/09/2026",
      itens: 2,
      precoUnitario: 159.90,
      total: 319.80,
      pagamento: "PIX",
      controlaEstoque: false
    }
  ]
};

/* =========================================================
   PÁGINAS
========================================================= */

const pages = {
  dashboard: {
    title: "Dashboard",
    html: dashboard
  },

  produtos: {
    title: "Produtos",
    html: produtos
  },

  vendas: {
    title: "Vendas",
    html: vendas
  },

  estoque: {
    title: "Estoque",
    html: estoque
  },

  financeiro: {
    title: "Financeiro",
    html: financeiro
  },

  relatorios: {
    title: "Relatórios",
    html: relatorios
  },

  config: {
    title: "Configurações",
    html: config
  }
};

const content = document.getElementById("content");
const pageTitle = document.getElementById("pageTitle");
const modal = document.getElementById("modalBackdrop");
const toast = document.getElementById("toast");

/* =========================================================
   FUNÇÕES GERAIS
========================================================= */

function money(v) {
  return Number(v).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function statusBadge(status) {
  const classe =
    status === "Ativo"
      ? "green"
      : status === "Baixo estoque"
      ? "orange"
      : "red";

  return `<span class="badge ${classe}">${status}</span>`;
}

function atualizarStatusProduto(produto) {
  produto.status =
    produto.estoque === 0
      ? "Esgotado"
      : produto.estoque <= 5
      ? "Baixo estoque"
      : "Ativo";
}

function atualizarSistema(pagina = null) {
  const paginaAtual =
    pagina ||
    document.querySelector(".nav-item.active")?.dataset.page ||
    "dashboard";

  render(paginaAtual);
}

function render(page = "dashboard") {
  const p = pages[page] || pages.dashboard;

  content.innerHTML = p.html();

  pageTitle.textContent = p.title;

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  bindPage(page);
}

/* =========================================================
   DASHBOARD
========================================================= */

function dashboard() {
  const valorEstoque = state.produtos.reduce(
    (total, produto) =>
      total + produto.preco * produto.estoque,
    0
  );

  const faturamento = state.vendas.reduce(
    (total, venda) =>
      total + Number(venda.total),
    0
  );

  const pedidos = state.vendas.length;

  const ticketMedio =
    pedidos > 0
      ? faturamento / pedidos
      : 0;

  const estoqueBaixo = state.produtos.filter(
    produto =>
      produto.estoque > 0 &&
      produto.estoque <= 5
  ).length;

  const produtosEsgotados = state.produtos.filter(
    produto =>
      produto.estoque === 0
  ).length;

  const vendasRecentes = state.vendas.slice(0, 5);

  return `
    <div class="page-head">
      <div>
        <h1>Dashboard</h1>
        <p>Visão geral da sua loja.</p>
      </div>
    </div>

    <div class="cards">

      <div class="card">
        <div class="card-label">Valor em estoque</div>
        <div class="card-value">${money(valorEstoque)}</div>
      </div>

      <div class="card">
        <div class="card-label">Faturamento</div>
        <div class="card-value">${money(faturamento)}</div>
      </div>

      <div class="card">
        <div class="card-label">Pedidos</div>
        <div class="card-value">${pedidos}</div>
      </div>

      <div class="card">
        <div class="card-label">Ticket médio</div>
        <div class="card-value">${money(ticketMedio)}</div>
      </div>

    </div>

    <div class="dashboard-grid">

      <div class="panel">

        <div class="panel-head">
          <div>
            <h2>Vendas recentes</h2>
            <p>Últimas vendas registradas.</p>
          </div>
        </div>

        <div class="table-wrap">

          <table>

            <thead>
              <tr>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Total</th>
                <th>Pagamento</th>
              </tr>
            </thead>

            <tbody>

              ${
                vendasRecentes.length
                  ? vendasRecentes
                      .map(
                        venda => `
                          <tr>

                            <td>
                              <b>${venda.id}</b>
                            </td>

                            <td>
                              ${venda.cliente}
                            </td>

                            <td>
                              ${venda.produtoNome}
                            </td>

                            <td>
                              <b>${money(venda.total)}</b>
                            </td>

                            <td>
                              <span class="badge green">
                                ${venda.pagamento}
                              </span>
                            </td>

                          </tr>
                        `
                      )
                      .join("")
                  : `
                    <tr>
                      <td colspan="5" class="empty-state">
                        Nenhuma venda registrada.
                      </td>
                    </tr>
                  `
              }

            </tbody>

          </table>

        </div>

      </div>

      <div class="panel">

        <div class="panel-head">

          <div>
            <h2>Estoque</h2>
            <p>Situação atual dos produtos.</p>
          </div>

        </div>

        <div class="stock-summary">

          <div>
            <strong>${state.produtos.length}</strong>
            <span>Produtos</span>
          </div>

          <div>
            <strong>${estoqueBaixo}</strong>
            <span>Estoque baixo</span>
          </div>

          <div>
            <strong>${produtosEsgotados}</strong>
            <span>Esgotados</span>
          </div>

        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   PRODUTOS
========================================================= */

function produtos() {
  return `
    <div class="page-head">

      <div>
        <h1>Produtos</h1>
        <p>Gerencie os produtos da sua loja.</p>
      </div>

      <button
        class="primary-btn"
        onclick="openProduct()"
      >
        + Novo produto
      </button>

    </div>

    <div class="panel">

      <div class="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Tamanho</th>
              <th>Marca</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            ${productRows(state.produtos)}
          </tbody>

        </table>

      </div>

    </div>
  `;
}

function productRows(arr) {
  return arr
    .map(
      produto => `
        <tr>

          <td>
            <span class="product-name">
              ${produto.nome}
            </span>
          </td>

          <td class="muted">
            ${produto.categoria}
          </td>

          <td class="muted">
            ${produto.tamanho || "—"}
          </td>

          <td class="muted">
            ${produto.marca || "—"}
          </td>

          <td>
            <b>${money(produto.preco)}</b>
          </td>

          <td>
            ${produto.estoque}
          </td>

          <td>
            ${statusBadge(produto.status)}
          </td>

          <td>

            <div class="actions">

              <button
                class="action-btn"
                title="Editar produto"
                onclick="editProduct(${produto.id})"
              >
                ✏️
              </button>

              <button
                class="action-btn delete"
                title="Excluir produto"
                onclick="deleteProduct(${produto.id})"
              >
                🗑️
              </button>

            </div>

          </td>

        </tr>
      `
    )
    .join("");
}

function openProduct(product = null) {
  const editando = !!product;

  openModal(
    editando
      ? "Editar produto"
      : "Novo produto",

    `
      <form onsubmit="
        saveProduct(
          event,
          ${editando ? product.id : "null"}
        )
      ">

        <div class="form-grid">

          <div class="field">

            <label>Nome do produto</label>

            <input
              name="nome"
              type="text"
              value="${editando ? product.nome : ""}"
              required
            >

          </div>

          <div class="field">

            <label>Categoria</label>

            <select name="categoria" required>
              <option value="" disabled ${editando ? "" : "selected"}>
                Selecione...
              </option>
              ${state.categoriasProduto
                .map(
                  cat => `
                    <option
                      value="${cat}"
                      ${editando && product.categoria === cat ? "selected" : ""}
                    >
                      ${cat}
                    </option>
                  `
                )
                .join("")}
            </select>

          </div>

          <div class="field">

            <label>Tamanho</label>

            <select name="tamanho" required>
              <option value="" disabled ${editando ? "" : "selected"}>
                Selecione...
              </option>
              ${state.tamanhosProduto
                .map(
                  tam => `
                    <option
                      value="${tam}"
                      ${editando && product.tamanho === tam ? "selected" : ""}
                    >
                      ${tam}
                    </option>
                  `
                )
                .join("")}
            </select>

          </div>

          <div class="field">

            <label>Marca</label>

            <input
              name="marca"
              type="text"
              placeholder="Ex: Zara, Renner, Farm..."
              value="${editando ? product.marca || "" : ""}"
              required
            >

          </div>

          <div class="field">

            <label>Preço</label>

            <input
              name="preco"
              type="number"
              step="0.01"
              min="0"
              value="${editando ? product.preco : ""}"
              required
            >

          </div>

          <div class="field">

            <label>Estoque</label>

            <input
              name="estoque"
              type="number"
              min="0"
              value="${editando ? product.estoque : 0}"
              required
            >

          </div>

        </div>

        <div class="form-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancelar
          </button>

          <button class="primary-btn">
            ${editando ? "Salvar alterações" : "Cadastrar produto"}
          </button>

        </div>

      </form>
    `
  );
}

function saveProduct(e, id) {
  e.preventDefault();

  const f = new FormData(e.target);

  const estoque = Number(f.get("estoque"));
  const preco = Number(f.get("preco"));

  if (estoque < 0 || preco < 0) {
    showToast("Informe valores válidos");
    return;
  }

  const produto = {
    id: id || Date.now(),
    nome: f.get("nome").trim(),
    categoria: f.get("categoria"),
    tamanho: f.get("tamanho"),
    marca: f.get("marca").trim(),
    preco,
    estoque,
    status: ""
  };

  atualizarStatusProduto(produto);

  if (id) {
    const index = state.produtos.findIndex(
      p => p.id === id
    );

    if (index !== -1) {
      state.produtos[index] = produto;
    }
  } else {
    state.produtos.push(produto);
  }

  closeModal();

  atualizarSistema("produtos");

  showToast("Produto salvo com sucesso");
}

function editProduct(id) {
  const produto = state.produtos.find(
    p => p.id === id
  );

  if (!produto) return;

  openProduct(produto);
}

function deleteProduct(id) {
  const produto = state.produtos.find(
    p => p.id === id
  );

  if (!produto) return;

  const possuiVenda = state.vendas.some(
    venda =>
      Number(venda.produtoId) === Number(id)
  );

  if (possuiVenda) {
    alert(
      "Este produto possui vendas registradas e não pode ser excluído."
    );

    return;
  }

  if (!confirm("Excluir este produto?")) {
    return;
  }

  state.produtos = state.produtos.filter(
    p => p.id !== id
  );

  atualizarSistema("produtos");

  showToast("Produto excluído");
}

/* =========================================================
   VENDAS
========================================================= */

function vendas() {
  const faturamento = state.vendas.reduce(
    (total, venda) =>
      total + Number(venda.total),
    0
  );

  const pedidos = state.vendas.length;

  const pix = state.vendas.filter(
    venda =>
      venda.pagamento === "PIX"
  ).length;

  const outros = pedidos - pix;

  return `
    <div class="page-head">

      <div>
        <h1>Vendas</h1>
        <p>Registre e acompanhe suas vendas.</p>
      </div>

      <button
        class="primary-btn"
        onclick="openSale()"
      >
        + Nova venda
      </button>

    </div>

    <div class="cards">

      <div class="card">
        <div class="card-label">
          Faturamento
        </div>

        <div class="card-value">
          ${money(faturamento)}
        </div>
      </div>

      <div class="card">
        <div class="card-label">
          Pedidos
        </div>

        <div class="card-value">
          ${pedidos}
        </div>
      </div>

      <div class="card">
        <div class="card-label">
          PIX
        </div>

        <div class="card-value">
          ${pix}
        </div>
      </div>

      <div class="card">
        <div class="card-label">
          Outros pagamentos
        </div>

        <div class="card-value">
          ${outros}
        </div>
      </div>

    </div>

    <div class="panel">

      <div class="panel-head">

        <div>
          <h2>Vendas recentes</h2>
          <p>Histórico das vendas realizadas.</p>
        </div>

      </div>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Data</th>
              <th>Quantidade</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            ${
              state.vendas.length
                ? state.vendas
                    .map(
                      venda => `
                        <tr>

                          <td>
                            <b>${venda.id}</b>
                          </td>

                          <td>
                            ${venda.cliente}
                          </td>

                          <td>
                            ${venda.produtoNome}
                          </td>

                          <td>
                            ${venda.data}
                          </td>

                          <td>
                            ${venda.itens}
                          </td>

                          <td>
                            <b>${money(venda.total)}</b>
                          </td>

                          <td>
                            <span class="badge green">
                              ${venda.pagamento}
                            </span>
                          </td>

                          <td>

                            <div class="actions">

                              <button
                                class="action-btn"
                                title="Editar venda"
                                onclick="editSale('${venda.id}')"
                              >
                                ✏️
                              </button>

                              <button
                                class="action-btn delete"
                                title="Excluir venda"
                                onclick="deleteSale('${venda.id}')"
                              >
                                🗑️
                              </button>

                            </div>

                          </td>

                        </tr>
                      `
                    )
                    .join("")
                : `
                  <tr>
                    <td
                      colspan="8"
                      class="empty-state"
                    >
                      Nenhuma venda registrada.
                    </td>
                  </tr>
                `
            }

          </tbody>

        </table>

      </div>

    </div>
  `;
}

/* =========================================================
   NOVA VENDA
========================================================= */

function openSale() {
  const produtosDisponiveis =
    state.produtos.filter(
      produto =>
        produto.estoque > 0
    );

  if (!produtosDisponiveis.length) {
    showToast(
      "Não há produtos disponíveis em estoque"
    );

    return;
  }

  openModal(
    "Nova venda",

    `
      <form onsubmit="saveSale(event)">

        <div class="form-grid">

          <div class="field">

            <label>Nome do cliente</label>

            <input
              name="cliente"
              type="text"
              placeholder="Digite o nome do cliente"
              required
            >

          </div>

          <div class="field">

            <label>Produto</label>

            <select
              name="produto"
              id="saleProduto"
              onchange="atualizarTotalVenda()"
              required
            >

              <option value="">
                Selecione o produto
              </option>

              ${
                produtosDisponiveis
                  .map(
                    produto => `
                      <option
                        value="${produto.id}"
                        data-preco="${produto.preco}"
                        data-estoque="${produto.estoque}"
                      >
                        ${produto.nome}
                        — ${money(produto.preco)}
                        (${produto.estoque} em estoque)
                      </option>
                    `
                  )
                  .join("")
              }

            </select>

          </div>

          <div class="field">

            <label>Quantidade</label>

            <input
              name="itens"
              id="saleQuantidade"
              type="number"
              min="1"
              value="1"
              oninput="atualizarTotalVenda()"
              required
            >

          </div>

          <div class="field">

            <label>Pagamento</label>

            <select
              name="pagamento"
              required
            >

              <option value="">
                Selecione
              </option>

              <option value="PIX">
                PIX
              </option>

              <option value="Débito">
                Débito
              </option>

              <option value="Crédito">
                Crédito
              </option>

              <option value="Dinheiro">
                Dinheiro
              </option>

            </select>

          </div>

        </div>

        <div class="sale-total">

          <span>
            Total da venda
          </span>

          <strong id="saleTotal">
            R$ 0,00
          </strong>

        </div>

        <input
          type="hidden"
          name="total"
          id="saleTotalInput"
          value="0"
        >

        <div class="form-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancelar
          </button>

          <button class="primary-btn">
            Registrar venda
          </button>

        </div>

      </form>
    `
  );
}

/* =========================================================
   CALCULAR TOTAL DA VENDA
========================================================= */

function atualizarTotalVenda() {
  const produtoSelect =
    document.getElementById("saleProduto");

  const quantidadeInput =
    document.getElementById("saleQuantidade");

  const totalElement =
    document.getElementById("saleTotal");

  const totalInput =
    document.getElementById("saleTotalInput");

  if (
    !produtoSelect ||
    !quantidadeInput ||
    !totalElement ||
    !totalInput
  ) {
    return;
  }

  const option =
    produtoSelect.options[
      produtoSelect.selectedIndex
    ];

  if (
    !option ||
    !option.dataset.preco
  ) {
    totalElement.textContent = "R$ 0,00";
    totalInput.value = 0;
    return;
  }

  const preco =
    Number(option.dataset.preco);

  const quantidade =
    Number(quantidadeInput.value) || 0;

  const estoque =
    Number(option.dataset.estoque);

  if (quantidade > estoque) {
    quantidadeInput.setCustomValidity(
      `Quantidade máxima disponível: ${estoque}`
    );
  } else {
    quantidadeInput.setCustomValidity("");
  }

  const total =
    preco * quantidade;

  totalElement.textContent =
    money(total);

  totalInput.value =
    total.toFixed(2);
}

/* =========================================================
   SALVAR VENDA
========================================================= */

function saveSale(e) {
  e.preventDefault();

  const f =
    new FormData(e.target);

  const produtoId =
    Number(f.get("produto"));

  const quantidade =
    Number(f.get("itens"));

  const cliente =
    String(f.get("cliente") || "").trim();

  const pagamento =
    f.get("pagamento");

  const produto =
    state.produtos.find(
      p =>
        Number(p.id) === produtoId
    );

  if (!produto) {
    showToast("Produto não encontrado");
    return;
  }

  if (!cliente) {
    showToast("Informe o nome do cliente");
    return;
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    showToast("Informe uma quantidade válida");
    return;
  }

  if (quantidade > produto.estoque) {
    showToast(
      `Estoque insuficiente. Disponível: ${produto.estoque}`
    );
    return;
  }

  if (!pagamento) {
    showToast("Selecione a forma de pagamento");
    return;
  }

  /* PREÇO × QUANTIDADE */

  const total =
    produto.preco * quantidade;

  /* PRÓXIMO NÚMERO DE PEDIDO */

  const numerosPedidos =
    state.vendas
      .map(venda =>
        Number(
          String(venda.id).replace("#", "")
        )
      )
      .filter(numero => !isNaN(numero));

  const maiorNumero =
    numerosPedidos.length
      ? Math.max(...numerosPedidos)
      : 1043;

  const novoNumero =
    maiorNumero + 1;

  /* REGISTRA VENDA */

  state.vendas.unshift({
    id: "#" + novoNumero,
    cliente,
    produtoId: produto.id,
    produtoNome: produto.nome,
    data: new Date().toLocaleDateString("pt-BR"),
    itens: quantidade,
    precoUnitario: produto.preco,
    total,
    pagamento,

    /* Esta venda controla o estoque */
    controlaEstoque: true
  });

  /* BAIXA NO ESTOQUE */

  produto.estoque -= quantidade;

  atualizarStatusProduto(produto);

  closeModal();

  /*
    Como o state foi atualizado,
    qualquer página renderizada
    mostrará os novos valores.
  */

  atualizarSistema("vendas");

  showToast(
    "Venda registrada e estoque atualizado"
  );
}

/* =========================================================
   EDITAR VENDA
========================================================= */

function editSale(id) {
  const sale =
    state.vendas.find(
      v =>
        v.id === id
    );

  if (!sale) return;

  openModal(
    "Editar venda",

    `
      <form
        onsubmit="
          updateSale(
            event,
            '${sale.id}'
          )
        "
      >

        <div class="form-grid">

          <div class="field">

            <label>
              Nome do cliente
            </label>

            <input
              name="cliente"
              type="text"
              value="${sale.cliente}"
              required
            >

          </div>

          <div class="field">

            <label>
              Produto
            </label>

            <select
              name="produto"
              id="editSaleProduto"
              onchange="atualizarTotalEdicao()"
              required
            >

              ${
                state.produtos
                  .map(
                    produto => {

                      const mesmoProduto =
                        Number(produto.id) ===
                        Number(sale.produtoId);

                      const estoqueDisponivel =
                        mesmoProduto &&
                        sale.controlaEstoque
                          ? produto.estoque + sale.itens
                          : produto.estoque;

                      return `
                        <option
                          value="${produto.id}"
                          data-preco="${produto.preco}"
                          data-estoque="${estoqueDisponivel}"
                          ${
                            mesmoProduto
                              ? "selected"
                              : ""
                          }
                        >
                          ${produto.nome}
                          — ${money(produto.preco)}
                          (${estoqueDisponivel} disponíveis)
                        </option>
                      `;
                    }
                  )
                  .join("")
              }

            </select>

          </div>

          <div class="field">

            <label>
              Quantidade
            </label>

            <input
              name="itens"
              id="editSaleQuantidade"
              type="number"
              min="1"
              value="${sale.itens}"
              oninput="atualizarTotalEdicao()"
              required
            >

          </div>

          <div class="field">

            <label>
              Pagamento
            </label>

            <select
              name="pagamento"
              required
            >

              <option
                value="PIX"
                ${
                  sale.pagamento === "PIX"
                    ? "selected"
                    : ""
                }
              >
                PIX
              </option>

              <option
                value="Débito"
                ${
                  sale.pagamento === "Débito"
                    ? "selected"
                    : ""
                }
              >
                Débito
              </option>

              <option
                value="Crédito"
                ${
                  sale.pagamento === "Crédito"
                    ? "selected"
                    : ""
                }
              >
                Crédito
              </option>

              <option
                value="Dinheiro"
                ${
                  sale.pagamento === "Dinheiro"
                    ? "selected"
                    : ""
                }
              >
                Dinheiro
              </option>

            </select>

          </div>

        </div>

        <div class="sale-total">

          <span>
            Total da venda
          </span>

          <strong id="editSaleTotal">
            ${money(sale.total)}
          </strong>

        </div>

        <input
          type="hidden"
          name="total"
          id="editSaleTotalInput"
          value="${sale.total}"
        >

        <div class="form-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancelar
          </button>

          <button class="primary-btn">
            Salvar alterações
          </button>

        </div>

      </form>
    `
  );

  atualizarTotalEdicao();
}

/* =========================================================
   CALCULAR TOTAL DA EDIÇÃO
========================================================= */

function atualizarTotalEdicao() {
  const produtoSelect =
    document.getElementById("editSaleProduto");

  const quantidadeInput =
    document.getElementById("editSaleQuantidade");

  const totalElement =
    document.getElementById("editSaleTotal");

  const totalInput =
    document.getElementById("editSaleTotalInput");

  if (
    !produtoSelect ||
    !quantidadeInput ||
    !totalElement ||
    !totalInput
  ) {
    return;
  }

  const option =
    produtoSelect.options[
      produtoSelect.selectedIndex
    ];

  if (!option) return;

  const preco =
    Number(option.dataset.preco);

  const quantidade =
    Number(quantidadeInput.value) || 0;

  const estoque =
    Number(option.dataset.estoque);

  if (quantidade > estoque) {
    quantidadeInput.setCustomValidity(
      `Quantidade máxima disponível: ${estoque}`
    );
  } else {
    quantidadeInput.setCustomValidity("");
  }

  const total =
    preco * quantidade;

  totalElement.textContent =
    money(total);

  totalInput.value =
    total.toFixed(2);
}

/* =========================================================
   ATUALIZAR VENDA
========================================================= */

function updateSale(e, id) {
  e.preventDefault();

  const f =
    new FormData(e.target);

  const sale =
    state.vendas.find(
      v =>
        v.id === id
    );

  if (!sale) return;

  const novoProdutoId =
    Number(f.get("produto"));

  const novaQuantidade =
    Number(f.get("itens"));

  const novoCliente =
    String(f.get("cliente") || "").trim();

  const novoPagamento =
    f.get("pagamento");

  const novoProduto =
    state.produtos.find(
      p =>
        Number(p.id) ===
        novoProdutoId
    );

  if (!novoProduto) {
    showToast("Produto não encontrado");
    return;
  }

  if (!novoCliente) {
    showToast("Informe o nome do cliente");
    return;
  }

  if (
    !Number.isInteger(novaQuantidade) ||
    novaQuantidade <= 0
  ) {
    showToast("Informe uma quantidade válida");
    return;
  }

  if (!novoPagamento) {
    showToast("Selecione a forma de pagamento");
    return;
  }

  /*
    Se esta venda antiga controla estoque,
    primeiro devolvemos a quantidade antiga.
  */

  const produtoAntigo =
    state.produtos.find(
      p =>
        Number(p.id) ===
        Number(sale.produtoId)
    );

  if (
    sale.controlaEstoque &&
    produtoAntigo
  ) {
    produtoAntigo.estoque +=
      Number(sale.itens);

    atualizarStatusProduto(
      produtoAntigo
    );
  }

  /*
    Agora verificamos quanto existe
    realmente disponível para a nova venda.
  */

  if (
    novaQuantidade >
    novoProduto.estoque
  ) {

    /*
      Se devolvemos o estoque antigo,
      desfazemos essa devolução.
    */

    if (
      sale.controlaEstoque &&
      produtoAntigo
    ) {
      produtoAntigo.estoque -=
        Number(sale.itens);

      atualizarStatusProduto(
        produtoAntigo
      );
    }

    showToast(
      `Estoque insuficiente. Disponível: ${novoProduto.estoque}`
    );

    return;
  }

  /*
    PREÇO × QUANTIDADE
  */

  const total =
    novoProduto.preco *
    novaQuantidade;

  /*
    Se a venda já controlava estoque,
    a venda continuará controlando estoque.
  */

  if (sale.controlaEstoque) {

    novoProduto.estoque -=
      novaQuantidade;

    atualizarStatusProduto(
      novoProduto
    );
  }

  /*
    Atualiza os dados da venda.
  */

  sale.cliente =
    novoCliente;

  sale.produtoId =
    novoProduto.id;

  sale.produtoNome =
    novoProduto.nome;

  sale.itens =
    novaQuantidade;

  sale.precoUnitario =
    novoProduto.preco;

  sale.total =
    total;

  sale.pagamento =
    novoPagamento;

  closeModal();

  atualizarSistema("vendas");

  showToast(
    "Venda atualizada com sucesso"
  );
}

/* =========================================================
   EXCLUIR VENDA
========================================================= */

function deleteSale(id) {
  const sale =
    state.vendas.find(
      v =>
        v.id === id
    );

  if (!sale) return;

  if (!confirm("Excluir esta venda?")) {
    return;
  }

  /*
    Só restaura estoque se a venda
    realmente tiver retirado produtos.
  */

  if (sale.controlaEstoque) {

    const produto =
      state.produtos.find(
        p =>
          Number(p.id) ===
          Number(sale.produtoId)
      );

    if (produto) {

      produto.estoque +=
        Number(sale.itens);

      atualizarStatusProduto(
        produto
      );
    }
  }

  /*
    Remove a venda.
  */

  state.vendas =
    state.vendas.filter(
      v =>
        v.id !== id
    );

  atualizarSistema("vendas");

  showToast(
    sale.controlaEstoque
      ? "Venda excluída e estoque restaurado"
      : "Venda excluída"
  );
}

/* =========================================================
   ESTOQUE
========================================================= */

function estoque() {
  const quantidadeTotal =
    state.produtos.reduce(
      (total, produto) =>
        total +
        Number(produto.estoque),
      0
    );

  const estoqueBaixo =
    state.produtos.filter(
      produto =>
        produto.estoque > 0 &&
        produto.estoque <= 5
    ).length;

  const valorEstoque =
    state.produtos.reduce(
      (total, produto) =>
        total +
        produto.preco *
        produto.estoque,
      0
    );

  return `
    <div class="page-head">

      <div>
        <h1>Estoque</h1>
        <p>
          Controle de entradas e saídas.
        </p>
      </div>

      <button
        class="primary-btn"
        onclick="openStock()"
      >
        + Movimentar estoque
      </button>

    </div>

    <div class="cards">

      <div class="card">

        <div class="card-label">
          Quantidade total
        </div>

        <div class="card-value">
          ${quantidadeTotal}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Estoque baixo
        </div>

        <div class="card-value">
          ${estoqueBaixo}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Valor em estoque
        </div>

        <div class="card-value">
          ${money(valorEstoque)}
        </div>

      </div>

    </div>

    <div class="panel">

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th>Preço</th>
              <th>Status</th>
            </tr>

          </thead>

          <tbody>

            ${
              state.produtos
                .map(
                  produto => `
                    <tr>

                      <td>
                        ${produto.nome}
                      </td>

                      <td>
                        ${produto.categoria}
                      </td>

                      <td>
                        <b>
                          ${produto.estoque}
                        </b>
                      </td>

                      <td>
                        ${money(produto.preco)}
                      </td>

                      <td>
                        ${statusBadge(
                          produto.status
                        )}
                      </td>

                    </tr>
                  `
                )
                .join("")
            }

          </tbody>

        </table>

      </div>

    </div>
  `;
}

function openStock() {
  openModal(
    "Movimentar estoque",

    `
      <form onsubmit="moveStock(event)">

        <div class="form-grid">

          <div class="field">

            <label>
              Produto
            </label>

            <select
              name="produto"
              required
            >

              <option value="">
                Selecione
              </option>

              ${
                state.produtos
                  .map(
                    produto => `
                      <option
                        value="${produto.id}"
                      >
                        ${produto.nome}
                        — estoque:
                        ${produto.estoque}
                      </option>
                    `
                  )
                  .join("")
              }

            </select>

          </div>

          <div class="field">

            <label>
              Tipo
            </label>

            <select
              name="tipo"
              required
            >

              <option value="Entrada">
                Entrada
              </option>

              <option value="Saída">
                Saída
              </option>

            </select>

          </div>

          <div class="field">

            <label>
              Quantidade
            </label>

            <input
              name="qtd"
              type="number"
              min="1"
              required
            >

          </div>

          <div class="field">

            <label>
              Observação
            </label>

            <input
              name="observacao"
              type="text"
              placeholder="Opcional"
            >

          </div>

        </div>

        <div class="form-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancelar
          </button>

          <button class="primary-btn">
            Atualizar estoque
          </button>

        </div>

      </form>
    `
  );
}

function moveStock(e) {
  e.preventDefault();

  const f =
    new FormData(e.target);

  const produto =
    state.produtos.find(
      p =>
        Number(p.id) ===
        Number(f.get("produto"))
    );

  const quantidade =
    Number(f.get("qtd"));

  if (!produto) {
    showToast("Produto não encontrado");
    return;
  }

  if (
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    showToast(
      "Informe uma quantidade válida"
    );

    return;
  }

  if (
    f.get("tipo") ===
    "Entrada"
  ) {

    produto.estoque +=
      quantidade;

  } else {

    if (
      quantidade >
      produto.estoque
    ) {

      showToast(
        `Estoque insuficiente. Disponível: ${produto.estoque}`
      );

      return;
    }

    produto.estoque -=
      quantidade;
  }

  atualizarStatusProduto(
    produto
  );

  closeModal();

  atualizarSistema("estoque");

  showToast(
    "Estoque atualizado"
  );
}

/* =========================================================
   FINANCEIRO
========================================================= */

function financeiro() {
  const faturamento =
    state.vendas.reduce(
      (total, venda) =>
        total +
        Number(venda.total),
      0
    );

  const pix =
    state.vendas
      .filter(
        venda =>
          venda.pagamento === "PIX"
      )
      .reduce(
        (total, venda) =>
          total +
          Number(venda.total),
        0
      );

  const debito =
    state.vendas
      .filter(
        venda =>
          venda.pagamento === "Débito"
      )
      .reduce(
        (total, venda) =>
          total +
          Number(venda.total),
        0
      );

  const credito =
    state.vendas
      .filter(
        venda =>
          venda.pagamento === "Crédito"
      )
      .reduce(
        (total, venda) =>
          total +
          Number(venda.total),
        0
      );

  const dinheiro =
    state.vendas
      .filter(
        venda =>
          venda.pagamento === "Dinheiro"
      )
      .reduce(
        (total, venda) =>
          total +
          Number(venda.total),
        0
      );

  return `
    <div class="page-head">

      <div>
        <h1>Financeiro</h1>

        <p>
          Acompanhe o faturamento da loja.
        </p>

      </div>

      <button
        class="primary-btn"
        onclick="openInvoice()"
      >
        🧾 Emitir nota fiscal
      </button>

    </div>

    <div class="cards">

      <div class="card">

        <div class="card-label">
          Faturamento
        </div>

        <div class="card-value">
          ${money(faturamento)}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          PIX
        </div>

        <div class="card-value">
          ${money(pix)}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Débito
        </div>

        <div class="card-value">
          ${money(debito)}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Crédito
        </div>

        <div class="card-value">
          ${money(credito)}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Dinheiro
        </div>

        <div class="card-value">
          ${money(dinheiro)}
        </div>

      </div>

    </div>

    <div class="panel">

      <div class="panel-head">

        <div>

          <h2>
            Resumo financeiro
          </h2>

          <p>
            Valores calculados a partir das vendas.
          </p>

        </div>

      </div>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            ${
              state.vendas.length
                ? state.vendas
                    .map(
                      venda => `
                        <tr>

                          <td>
                            <b>
                              ${venda.id}
                            </b>
                          </td>

                          <td>
                            ${venda.cliente}
                          </td>

                          <td>
                            ${venda.produtoNome}
                          </td>

                          <td>
                            ${venda.itens}
                          </td>

                          <td>
                            <b>
                              ${money(venda.total)}
                            </b>
                          </td>

                          <td>
                            <span class="badge green">
                              ${venda.pagamento}
                            </span>
                          </td>

                          <td>
                            <div class="actions">
                              <button
                                class="action-btn"
                                title="Emitir nota fiscal"
                                onclick="openInvoice('${venda.id}')"
                              >
                                🧾
                              </button>
                            </div>
                          </td>

                        </tr>
                      `
                    )
                    .join("")
                : `
                  <tr>
                    <td
                      colspan="7"
                      class="empty-state"
                    >
                      Nenhuma venda registrada.
                    </td>
                  </tr>
                `
            }

          </tbody>

        </table>

      </div>

    </div>
  `;
}

/* =========================================================
   NOTA FISCAL (SIMULAÇÃO)
========================================================= */

function gerarChaveAcesso() {
  let chave = "";

  for (let i = 0; i < 44; i++) {
    chave += Math.floor(Math.random() * 10);
  }

  return chave.replace(/(.{4})/g, "$1 ").trim();
}

function openInvoice(vendaId = null) {
  const opcoesVendas = state.vendas
    .map(
      venda => `
        <option
          value="${venda.id}"
          ${vendaId === venda.id ? "selected" : ""}
        >
          ${venda.id} — ${venda.cliente} (${money(venda.total)})
        </option>
      `
    )
    .join("");

  const vendaSelecionada = vendaId
    ? state.vendas.find(v => v.id === vendaId)
    : null;

  openModal(
    "Emitir nota fiscal",
    `
      <div class="field">
        <label>Selecione a venda</label>
        <select
          id="invoiceSaleSelect"
          onchange="renderInvoicePreview(this.value)"
        >
          <option value="">Selecione uma venda...</option>
          ${opcoesVendas}
        </select>
      </div>

      <div id="invoicePreview">
        ${
          vendaSelecionada
            ? invoicePreviewHtml(vendaSelecionada)
            : ""
        }
      </div>
    `
  );
}

function renderInvoicePreview(vendaId) {
  const preview = document.getElementById("invoicePreview");

  if (!preview) return;

  const venda = state.vendas.find(v => v.id === vendaId);

  preview.innerHTML = venda ? invoicePreviewHtml(venda) : "";
}

function invoicePreviewHtml(venda) {
  const numero = String(
    Math.floor(Math.random() * 90000) + 10000
  );

  const chave = gerarChaveAcesso();
  const dataEmissao = new Date().toLocaleString("pt-BR");

  return `
    <div class="invoice">

      <div class="invoice-head">
        <div>
          <strong>ModaGestão</strong>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>

        <div class="invoice-doc">
          <span>NFC-e nº ${numero}</span>
          <span>Emitida em ${dataEmissao}</span>
        </div>
      </div>

      <div class="invoice-row">
        <span class="invoice-label">Cliente</span>
        <strong>${venda.cliente}</strong>
      </div>

      <div class="table-wrap">
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qtd.</th>
              <th>Unitário</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>${venda.produtoNome}</td>
              <td>${venda.itens}</td>
              <td>${money(venda.precoUnitario)}</td>
              <td>${money(venda.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="invoice-total">
        <span>Total da nota</span>
        <strong>${money(venda.total)}</strong>
      </div>

      <div class="invoice-row">
        <span class="invoice-label">Chave de acesso (simulada)</span>
        <code>${chave}</code>
      </div>

      <p class="invoice-disclaimer">
        Documento gerado localmente, apenas para fins de demonstração e
        controle interno — não possui validade fiscal. Para emitir notas
        fiscais reais (NF-e/NFC-e) é necessário integrar com a SEFAZ do seu
        estado através de um certificado digital e um emissor autorizado.
      </p>

      <div class="form-actions">
        <button
          type="button"
          class="secondary-btn"
          onclick="closeModal()"
        >
          Fechar
        </button>

        <button
          type="button"
          class="primary-btn"
          onclick="window.print()"
        >
          Imprimir
        </button>
      </div>

    </div>
  `;
}

/* =========================================================
   RELATÓRIOS
========================================================= */

function relatorios() {
  const faturamento =
    state.vendas.reduce(
      (total, venda) =>
        total +
        Number(venda.total),
      0
    );

  const quantidadeVendida =
    state.vendas.reduce(
      (total, venda) =>
        total +
        Number(venda.itens),
      0
    );

  // Faturamento agrupado por dia
  const porDiaMap = {};

  state.vendas.forEach(venda => {
    porDiaMap[venda.data] =
      (porDiaMap[venda.data] || 0) + Number(venda.total);
  });

  const diasOrdenados = Object.keys(porDiaMap).sort((a, b) => {
    const [da, ma, ya] = a.split("/").map(Number);
    const [db, mb, yb] = b.split("/").map(Number);
    return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
  });

  const maiorValorDia = Math.max(
    ...diasOrdenados.map(dia => porDiaMap[dia]),
    1
  );

  const barrasHtml = diasOrdenados.length
    ? diasOrdenados
        .map(dia => {
          const valor = porDiaMap[dia];
          const altura = Math.max(
            6,
            Math.round((valor / maiorValorDia) * 100)
          );

          return `
            <div class="report-bar-col">
              <span class="report-bar-value">${money(valor)}</span>
              <div class="report-bar" style="height:${altura}%"></div>
              <span class="report-bar-label">${dia.slice(0, 5)}</span>
            </div>
          `;
        })
        .join("")
    : `<div class="empty-state">Sem dados suficientes para o gráfico.</div>`;

  // Ranking de produtos por quantidade vendida
  const porProdutoMap = {};

  state.vendas.forEach(venda => {
    porProdutoMap[venda.produtoNome] =
      (porProdutoMap[venda.produtoNome] || 0) + Number(venda.itens);
  });

  const rankingProdutos = Object.entries(porProdutoMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maiorQuantidade = Math.max(
    ...rankingProdutos.map(([, qtd]) => qtd),
    1
  );

  const rankingHtml = rankingProdutos.length
    ? rankingProdutos
        .map(
          ([nome, qtd]) => `
            <div class="report-rank-row">
              <span class="report-rank-name">${nome}</span>
              <div class="report-rank-bar-wrap">
                <div
                  class="report-rank-bar"
                  style="width:${Math.round(
                    (qtd / maiorQuantidade) * 100
                  )}%"
                ></div>
              </div>
              <span class="report-rank-value">${qtd} un.</span>
            </div>
          `
        )
        .join("")
    : `<div class="empty-state">Sem vendas registradas.</div>`;

  return `
    <div class="page-head">

      <div>

        <h1>Relatórios</h1>

        <p>
          Informações consolidadas da loja.
        </p>

      </div>

    </div>

    <div class="cards">

      <div class="card">

        <div class="card-label">
          Faturamento
        </div>

        <div class="card-value">
          ${money(faturamento)}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Vendas
        </div>

        <div class="card-value">
          ${state.vendas.length}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Itens vendidos
        </div>

        <div class="card-value">
          ${quantidadeVendida}
        </div>

      </div>

      <div class="card">

        <div class="card-label">
          Produtos
        </div>

        <div class="card-value">
          ${state.produtos.length}
        </div>

      </div>

    </div>

    <div class="grid-2">

      <div class="panel">

        <div class="panel-head">
          <div>
            <h2>Faturamento por dia</h2>
            <p>Evolução das vendas registradas.</p>
          </div>
        </div>

        <div class="report-chart">
          ${barrasHtml}
        </div>

      </div>

      <div class="panel">

        <div class="panel-head">
          <div>
            <h2>Produtos mais vendidos</h2>
            <p>Top produtos por quantidade vendida.</p>
          </div>
        </div>

        <div class="report-ranking">
          ${rankingHtml}
        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function config() {
  return `
    <div class="page-head">

      <div>

        <h1>Configurações</h1>

        <p>
          Configure as informações da sua loja.
        </p>

      </div>

    </div>

    <div class="panel">

      <div class="panel-body">

        <div class="form-grid">

          <div class="field">
            <label>Nome da loja</label>
            <input type="text" value="ModaGestão">
          </div>

          <div class="field">
            <label>Telefone</label>
            <input type="text" placeholder="(00) 00000-0000">
          </div>

          <div class="field">
            <label>E-mail de contato</label>
            <input type="email" placeholder="contato@loja.com">
          </div>

        </div>

        <div class="form-actions">
          <button
            class="primary-btn"
            onclick="showToast('Dados da loja salvos.')"
          >
            Salvar alterações
          </button>
        </div>

      </div>

    </div>
  `;
}

/* =========================================================
   MODAL
========================================================= */

function openModal(title, html) {
  const modalTitle =
    document.getElementById("modalTitle");

  const modalContent =
    document.getElementById("modalBody");

  if (!modal || !modalTitle || !modalContent) {
    console.error(
      "Elementos do modal não encontrados."
    );

    return;
  }

  modalTitle.textContent =
    title;

  modalContent.innerHTML =
    html;

  modal.classList.add("show");
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("show");
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
  if (!toast) return;

  toast.textContent =
    message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================================================
   LOGIN
========================================================= */

const DEMO_EMAIL = "admin@modagestao.com";
const DEMO_SENHA = "123456";

const loginForm = document.getElementById("loginForm");
const LoginBtn = document.getElementById("LoginBtn");

function entrarNoSistema() {
  document.body.classList.add("logged-in");
  render("dashboard");
  showToast("Bem-vindo(a) de volta!");
}

function sairDoSistema() {
  document.body.classList.remove("logged-in");

  if (loginForm) loginForm.reset();

  const sidebarEl = document.getElementById("sidebar");
  if (sidebarEl) sidebarEl.classList.remove("open");
}

if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();

    const email =
      document.getElementById("loginEmail").value.trim().toLowerCase();

    const senha =
      document.getElementById("loginPassword").value;

    if (email === DEMO_EMAIL && senha === DEMO_SENHA) {
      entrarNoSistema();
    } else {
      showToast("E-mail ou senha inválidos.");
    }
  });
}

if (LoginBtn) {
  LoginBtn.addEventListener("click", () => {
    /*
      Simulação de login com . Uma integração real exige
      configurar o  Identity Services com um Client ID
      próprio e validar o token retornado em um backend —
      isso não é possível apenas com HTML/CSS/JS no navegador.
    */
    entrarNoSistema();
  });
}

/* =========================================================
   NAVEGAÇÃO
========================================================= */

function bindPage(page) {
  /*
    Reservado para eventos específicos
    de cada página.
  */
}

document.addEventListener(
  "click",
  e => {

    const nav =
      e.target.closest(".nav-item");

    if (!nav) return;

    const page =
      nav.dataset.page;

    if (!page) return;

    render(page);

    const sidebar = document.getElementById("sidebar");

    if (sidebar) sidebar.classList.remove("open");
  }
);

/* =========================================================
   MENU MOBILE
========================================================= */

const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");

if (mobileMenu && sidebar) {

  mobileMenu.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.addEventListener("click", e => {
    const clicouDentro =
      sidebar.contains(e.target) || mobileMenu.contains(e.target);

    if (!clicouDentro) sidebar.classList.remove("open");
  });
}

/* =========================================================
   LOGOUT
========================================================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    sairDoSistema();
    showToast("Sessão encerrada.");
  });
}

/* =========================================================
   FECHAR MODAL NO X
========================================================= */

const modalCloseBtn = document.getElementById("modalClose");

if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", closeModal);
}

/* =========================================================
   FECHAR MODAL CLICANDO FORA
========================================================= */

if (modal) {

  modal.addEventListener(
    "click",
    e => {

      if (e.target === modal) {
        closeModal();
      }

    }
  );

}

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

render("dashboard");