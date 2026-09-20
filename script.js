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

  categorias: [
    { id: 1, nome: "Calça", ativa: true },
    { id: 2, nome: "Saia", ativa: true },
    { id: 3, nome: "Casaco", ativa: true },
    { id: 4, nome: "Vestidos", ativa: true },
    { id: 5, nome: "Blusas", ativa: true }
  ],

  tamanhosProduto: ["PP", "P", "M", "G", "GG"],

  /* Desconto (%) aplicado automaticamente conforme a forma de pagamento */
  descontosPagamento: {
    PIX: 5,
    Dinheiro: 5,
    Débito: 0,
    Crédito: 0
  },

  vendas: [
    {
      id: "#1048",
      cliente: "Mariana Souza",
      produtos: [
        { produtoId: 1, nome: "Vestido Midi Floral", preco: 189.90, quantidade: 3, subtotal: 569.70 }
      ],
      produtoNome: "Vestido Midi Floral",
      data: "16/09/2026",
      itens: 3,
      precoUnitario: 189.90,
      subtotal: 569.70,
      desconto: 5,
      descontoValor: 0,
      total: 569.70,
      pagamento: "PIX",
      controlaEstoque: false
    },
    {
      id: "#1047",
      cliente: "Camila Oliveira",
      produtos: [
        { produtoId: 2, nome: "Calça Wide Leg", preco: 159.90, quantidade: 2, subtotal: 319.80 }
      ],
      produtoNome: "Calça Wide Leg",
      data: "16/09/2026",
      itens: 2,
      precoUnitario: 159.90,
      subtotal: 319.80,
      desconto: 0,
      descontoValor: 0,
      total: 319.80,
      pagamento: "Débito",
      controlaEstoque: false
    },
    {
      id: "#1046",
      cliente: "Juliana Costa",
      produtos: [
        { produtoId: 3, nome: "Blusa Tricot", preco: 119.90, quantidade: 4, subtotal: 479.60 }
      ],
      produtoNome: "Blusa Tricot",
      data: "15/09/2026",
      itens: 4,
      precoUnitario: 119.90,
      subtotal: 479.60,
      desconto: 0,
      descontoValor: 0,
      total: 479.60,
      pagamento: "Crédito",
      controlaEstoque: false
    },
    {
      id: "#1045",
      cliente: "Beatriz Santos",
      produtos: [
        { produtoId: 1, nome: "Vestido Midi Floral", preco: 189.90, quantidade: 1, subtotal: 189.90 }
      ],
      produtoNome: "Vestido Midi Floral",
      data: "15/09/2026",
      itens: 1,
      precoUnitario: 189.90,
      subtotal: 189.90,
      desconto: 5,
      descontoValor: 0,
      total: 189.90,
      pagamento: "Dinheiro",
      controlaEstoque: false
    },
    {
      id: "#1044",
      cliente: "Mariana Souza",
      produtos: [
        { produtoId: 2, nome: "Calça Wide Leg", preco: 159.90, quantidade: 2, subtotal: 319.80 }
      ],
      produtoNome: "Calça Wide Leg",
      data: "14/09/2026",
      itens: 2,
      precoUnitario: 159.90,
      subtotal: 319.80,
      desconto: 5,
      descontoValor: 0,
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

  categorias: {
    title: "Categorias",
    html: categorias
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

function faturamentoPorDiaMap() {
  const mapa = {};

  state.vendas.forEach(venda => {
    mapa[venda.data] = (mapa[venda.data] || 0) + Number(venda.total);
  });

  return mapa;
}

function quantidadePorProdutoMap() {
  const mapa = {};

  state.vendas.forEach(venda => {
    (venda.produtos && venda.produtos.length
      ? venda.produtos
      : [{ nome: venda.produtoNome, quantidade: venda.itens }]
    ).forEach(item => {
      mapa[item.nome] = (mapa[item.nome] || 0) + Number(item.quantidade || 0);
    });
  });

  return mapa;
}

function categoriasAtivasNomes() {
  return state.categorias
    .filter(cat => cat.ativa)
    .map(cat => cat.nome);
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

  // Produtos mais / menos vendidos
  const qtdPorProduto = quantidadePorProdutoMap();

  state.produtos.forEach(produto => {
    if (!(produto.nome in qtdPorProduto)) qtdPorProduto[produto.nome] = 0;
  });

  const rankingCompleto = Object.entries(qtdPorProduto).sort(
    (a, b) => b[1] - a[1]
  );

  const maisVendidos = rankingCompleto.slice(0, 5);
  const menosVendidos = rankingCompleto.slice().reverse().slice(0, 5);

  // Períodos (dias) de maior / menor venda
  const porDia = faturamentoPorDiaMap();
  const diasRanking = Object.entries(porDia).sort((a, b) => b[1] - a[1]);

  const melhoresDias = diasRanking.slice(0, 3);
  const pioresDias = diasRanking.slice().reverse().slice(0, 3);

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
                              ${produtoResumoVenda(venda)}
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

    <div class="dashboard-grid">

      <div class="panel">

        <div class="panel-head">
          <div>
            <h2>Produtos mais vendidos</h2>
            <p>Top produtos por quantidade vendida.</p>
          </div>
        </div>

        <div class="report-ranking">
          ${rankingListaHtml(maisVendidos, "un.")}
        </div>

      </div>

      <div class="panel">

        <div class="panel-head">
          <div>
            <h2>Produtos menos vendidos</h2>
            <p>Produtos com menor saída.</p>
          </div>
        </div>

        <div class="report-ranking">
          ${rankingListaHtml(menosVendidos, "un.")}
        </div>

      </div>

    </div>

    <div class="dashboard-grid">

      <div class="panel">

        <div class="panel-head">
          <div>
            <h2>Períodos de maior venda</h2>
            <p>Dias com maior faturamento.</p>
          </div>
        </div>

        <div class="report-ranking">
          ${rankingListaHtml(melhoresDias, "", true)}
        </div>

      </div>

      <div class="panel">

        <div class="panel-head">
          <div>
            <h2>Períodos de menor venda</h2>
            <p>Dias com menor faturamento.</p>
          </div>
        </div>

        <div class="report-ranking">
          ${rankingListaHtml(pioresDias, "", true)}
        </div>

      </div>

    </div>
  `;
}

function rankingListaHtml(lista, sufixo = "", emDinheiro = false) {
  if (!lista.length) {
    return `<div class="empty-state">Sem dados suficientes.</div>`;
  }

  const maiorValor = Math.max(...lista.map(([, valor]) => valor), 1);

  return lista
    .map(
      ([nome, valor]) => `
        <div class="report-rank-row">
          <span class="report-rank-name">${nome}</span>
          <div class="report-rank-bar-wrap">
            <div
              class="report-rank-bar"
              style="width:${Math.max(4, Math.round((valor / maiorValor) * 100))}%"
            ></div>
          </div>
          <span class="report-rank-value">
            ${emDinheiro ? money(valor) : valor + " " + sufixo}
          </span>
        </div>
      `
    )
    .join("");
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
              ${(() => {
                const nomes = categoriasAtivasNomes();
                if (editando && product.categoria && !nomes.includes(product.categoria)) {
                  nomes.push(product.categoria);
                }
                return nomes
                  .map(
                    cat => `
                      <option
                        value="${cat}"
                        ${editando && product.categoria === cat ? "selected" : ""}
                      >
                        ${cat}${editando && product.categoria === cat && !categoriasAtivasNomes().includes(cat) ? " (inativa)" : ""}
                      </option>
                    `
                  )
                  .join("");
              })()}
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
    showToast("Informe valores válidos", "error");
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
      (venda.produtos || []).some(
        item => Number(item.produtoId) === Number(id)
      )
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
   CATEGORIAS
========================================================= */

function categorias() {
  return `
    <div class="page-head">

      <div>
        <h1>Categorias</h1>
        <p>Cadastre e gerencie as categorias dos seus produtos.</p>
      </div>

      <button
        class="primary-btn"
        onclick="openCategoria()"
      >
        + Nova categoria
      </button>

    </div>

    <div class="panel">

      <div class="table-wrap">

        <table>

          <thead>
            <tr>
              <th>Categoria</th>
              <th>Produtos vinculados</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            ${categoriaRows()}
          </tbody>

        </table>

      </div>

    </div>
  `;
}

function categoriaRows() {
  if (!state.categorias.length) {
    return `
      <tr>
        <td colspan="4" class="empty-state">
          Nenhuma categoria cadastrada.
        </td>
      </tr>
    `;
  }

  return state.categorias
    .map(cat => {
      const qtdProdutos = state.produtos.filter(
        p => p.categoria === cat.nome
      ).length;

      return `
        <tr>

          <td>
            <span class="product-name">${cat.nome}</span>
          </td>

          <td class="muted">
            ${qtdProdutos}
          </td>

          <td>
            <span class="badge ${cat.ativa ? "green" : "red"}">
              ${cat.ativa ? "Ativa" : "Inativa"}
            </span>
          </td>

          <td>
            <div class="actions">

              <button
                class="action-btn"
                title="Editar categoria"
                onclick="editCategoria(${cat.id})"
              >
                ✏️
              </button>

              <button
                class="action-btn"
                title="${cat.ativa ? "Inativar" : "Ativar"} categoria"
                onclick="toggleCategoriaAtiva(${cat.id})"
              >
                ${cat.ativa ? "⏸️" : "▶️"}
              </button>

              <button
                class="action-btn delete"
                title="Excluir categoria"
                onclick="deleteCategoria(${cat.id})"
              >
                🗑️
              </button>

            </div>
          </td>

        </tr>
      `;
    })
    .join("");
}

function openCategoria(cat = null) {
  const editando = !!cat;

  openModal(
    editando ? "Editar categoria" : "Nova categoria",

    `
      <form onsubmit="saveCategoria(event, ${editando ? cat.id : "null"})">

        <div class="form-grid">

          <div class="field">
            <label>Nome da categoria</label>
            <input
              name="nome"
              type="text"
              placeholder="Ex: Vestidos, Calças..."
              value="${editando ? cat.nome : ""}"
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
            ${editando ? "Salvar alterações" : "Cadastrar categoria"}
          </button>

        </div>

      </form>
    `
  );
}

function saveCategoria(e, id) {
  e.preventDefault();

  const f = new FormData(e.target);
  const nome = String(f.get("nome") || "").trim();

  if (!nome) {
    showToast("Informe o nome da categoria", "error");
    return;
  }

  const jaExiste = state.categorias.some(
    cat =>
      cat.nome.toLowerCase() === nome.toLowerCase() &&
      cat.id !== id
  );

  if (jaExiste) {
    showToast("Já existe uma categoria com esse nome", "error");
    return;
  }

  if (id) {
    const categoria = state.categorias.find(c => c.id === id);

    if (categoria) {
      /* Mantém os produtos já cadastrados apontando para o novo nome */
      state.produtos.forEach(p => {
        if (p.categoria === categoria.nome) p.categoria = nome;
      });

      categoria.nome = nome;
    }
  } else {
    state.categorias.push({
      id: Date.now(),
      nome,
      ativa: true
    });
  }

  closeModal();
  atualizarSistema("categorias");
  showToast("Categoria salva com sucesso");
}

function editCategoria(id) {
  const categoria = state.categorias.find(c => c.id === id);
  if (!categoria) return;
  openCategoria(categoria);
}

function toggleCategoriaAtiva(id) {
  const categoria = state.categorias.find(c => c.id === id);
  if (!categoria) return;

  categoria.ativa = !categoria.ativa;

  atualizarSistema("categorias");
  showToast(
    categoria.ativa
      ? "Categoria ativada"
      : "Categoria inativada. Ela não aparecerá mais no cadastro de produtos."
  );
}

function deleteCategoria(id) {
  const categoria = state.categorias.find(c => c.id === id);
  if (!categoria) return;

  const emUso = state.produtos.some(p => p.categoria === categoria.nome);

  if (emUso) {
    alert(
      "Esta categoria possui produtos vinculados e não pode ser excluída. Inative-a ou altere a categoria dos produtos."
    );
    return;
  }

  if (!confirm("Excluir esta categoria?")) return;

  state.categorias = state.categorias.filter(c => c.id !== id);

  atualizarSistema("categorias");
  showToast("Categoria excluída");
}

/* =========================================================
   VENDAS
========================================================= */

let vendasPeriodoAtivo = "todas";

const PERIODOS_VENDA = [
  { id: "todas", label: "Todas" },
  { id: "semana", label: "Semanal" },
  { id: "mes", label: "Mensal" },
  { id: "estemes", label: "Este mês" },
  { id: "ano", label: "Anual" }
];

function parseDataBR(str) {
  const [d, m, y] = String(str).split("/").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function filtrarVendasPorPeriodo(lista, periodo) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  return lista.filter(venda => {
    const d = parseDataBR(venda.data);
    const diffDias = Math.floor((hoje - d) / 86400000);

    if (periodo === "semana") return diffDias >= 0 && diffDias < 7;
    if (periodo === "mes") return diffDias >= 0 && diffDias < 30;
    if (periodo === "estemes")
      return (
        d.getFullYear() === hoje.getFullYear() &&
        d.getMonth() === hoje.getMonth()
      );
    if (periodo === "ano") return d.getFullYear() === hoje.getFullYear();
    return true;
  });
}

function selecionarPeriodoVendas(periodo) {
  vendasPeriodoAtivo = periodo;
  atualizarSistema("vendas");
}

function vendas() {
  const vendasFiltradas = filtrarVendasPorPeriodo(
    state.vendas,
    vendasPeriodoAtivo
  );

  const faturamento = vendasFiltradas.reduce(
    (total, venda) =>
      total + Number(venda.total),
    0
  );

  const pedidos = vendasFiltradas.length;

  const pix = vendasFiltradas.filter(
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

    <div class="tabs">
      ${PERIODOS_VENDA.map(
        p => `
          <button
            class="tab-btn ${vendasPeriodoAtivo === p.id ? "active" : ""}"
            onclick="selecionarPeriodoVendas('${p.id}')"
          >
            ${p.label}
          </button>
        `
      ).join("")}
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
          <h2>Vendas ${vendasPeriodoAtivo === "todas" ? "recentes" : "no período"}</h2>
          <p>Histórico das vendas realizadas.</p>
        </div>

      </div>

      <div class="table-wrap">

        <table>

          <thead>

            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Produto(s)</th>
              <th>Data</th>
              <th>Quantidade</th>
              <th>Desconto</th>
              <th>Total</th>
              <th>Pagamento</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            ${
              vendasFiltradas.length
                ? vendasFiltradas
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
                            ${produtoResumoVenda(venda)}
                          </td>

                          <td>
                            ${venda.data}
                          </td>

                          <td>
                            ${venda.itens}
                          </td>

                          <td class="muted">
                            ${venda.desconto ? venda.desconto + "%" : "—"}
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
                      colspan="9"
                      class="empty-state"
                    >
                      Nenhuma venda registrada neste período.
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

function produtoResumoVenda(venda) {
  const itens = venda.produtos || [];

  if (!itens.length) return venda.produtoNome || "—";
  if (itens.length === 1) return itens[0].nome;

  return `${itens[0].nome} +${itens.length - 1} item(ns)`;
}

/* =========================================================
   VENDA — CARRINHO (NOVA / EDIÇÃO)
========================================================= */

let saleCart = [];
let saleEditId = null;

function estoqueBaseProduto(produtoId) {
  const produto = state.produtos.find(
    p => Number(p.id) === Number(produtoId)
  );

  if (!produto) return 0;

  let base = produto.estoque;

  if (saleEditId) {
    const vendaOriginal = state.vendas.find(v => v.id === saleEditId);

    const itemOriginal =
      vendaOriginal &&
      vendaOriginal.controlaEstoque &&
      (vendaOriginal.produtos || []).find(
        i => Number(i.produtoId) === Number(produtoId)
      );

    if (itemOriginal) base += Number(itemOriginal.quantidade);
  }

  return base;
}

function openSale() {
  const produtosDisponiveis = state.produtos.filter(
    produto => produto.estoque > 0
  );

  if (!produtosDisponiveis.length) {
    showToast("Não há produtos disponíveis em estoque", "error");
    return;
  }

  saleEditId = null;
  saleCart = [];

  abrirModalVenda("Nova venda", "", "PIX");
}

function editSale(id) {
  const venda = state.vendas.find(v => v.id === id);
  if (!venda) return;

  saleEditId = id;
  saleCart = (venda.produtos || []).map(item => ({
    produtoId: item.produtoId,
    nome: item.nome,
    preco: item.preco,
    quantidade: item.quantidade
  }));

  abrirModalVenda("Editar venda", venda.cliente, venda.pagamento);
}

function abrirModalVenda(titulo, cliente, pagamento) {
  const formasPagamento = Object.keys(state.descontosPagamento);

  openModal(
    titulo,
    `
      <form onsubmit="saveSaleCart(event)">

        <div class="form-grid">

          <div class="field">
            <label>Nome do cliente</label>
            <input
              name="cliente"
              id="saleCliente"
              type="text"
              placeholder="Digite o nome do cliente"
              value="${cliente || ""}"
              required
            >
          </div>

          <div class="field">
            <label>Forma de pagamento</label>
            <select
              name="pagamento"
              id="salePagamento"
              onchange="renderSaleCart()"
              required
            >
              <option value="">Selecione</option>
              ${formasPagamento
                .map(
                  forma => `
                    <option value="${forma}" ${pagamento === forma ? "selected" : ""}>
                      ${forma}${
                        state.descontosPagamento[forma]
                          ? " (" + state.descontosPagamento[forma] + "% desconto)"
                          : ""
                      }
                    </option>
                  `
                )
                .join("")}
            </select>
          </div>

        </div>

        <div class="field">
          <label>Adicionar produto</label>

          <div class="sale-add-row">

            <select id="saleProdutoSelect">
              <option value="">Selecione o produto</option>
              ${state.produtos
                .map(
                  produto => `
                    <option value="${produto.id}">
                      ${produto.nome} — ${money(produto.preco)}
                      (${estoqueBaseProduto(produto.id)} disponíveis)
                    </option>
                  `
                )
                .join("")}
            </select>

            <input
              id="saleProdutoQtd"
              type="number"
              min="1"
              value="1"
            >

            <button type="button" class="secondary-btn" onclick="adicionarItemVenda()">
              Adicionar
            </button>

          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Qtd.</th>
                <th>Unitário</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="saleCartBody"></tbody>
          </table>
        </div>

        <div id="saleTotals"></div>

        <div class="form-actions">

          <button
            type="button"
            class="secondary-btn"
            onclick="closeModal()"
          >
            Cancelar
          </button>

          <button class="primary-btn">
            ${saleEditId ? "Salvar alterações" : "Registrar venda"}
          </button>

        </div>

      </form>
    `
  );

  renderSaleCart();
}

function adicionarItemVenda() {
  const select = document.getElementById("saleProdutoSelect");
  const qtdInput = document.getElementById("saleProdutoQtd");

  if (!select || !qtdInput) return;

  const produtoId = Number(select.value);
  const quantidade = Number(qtdInput.value);

  if (!produtoId) {
    showToast("Selecione um produto", "error");
    return;
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    showToast("Informe uma quantidade válida", "error");
    return;
  }

  const produto = state.produtos.find(p => Number(p.id) === produtoId);
  if (!produto) return;

  const disponivel = estoqueBaseProduto(produtoId);

  const existente = saleCart.find(
    item => Number(item.produtoId) === produtoId
  );

  const totalDesejado = quantidade + (existente ? existente.quantidade : 0);

  if (totalDesejado > disponivel) {
    showToast(`Estoque insuficiente. Disponível: ${disponivel}`, "error");
    return;
  }

  if (existente) {
    existente.quantidade = totalDesejado;
  } else {
    saleCart.push({
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade
    });
  }

  qtdInput.value = 1;
  renderSaleCart();
}

function removerItemVenda(produtoId) {
  saleCart = saleCart.filter(
    item => Number(item.produtoId) !== Number(produtoId)
  );
  renderSaleCart();
}

function atualizarQtdItemVenda(produtoId, valor) {
  const item = saleCart.find(
    i => Number(i.produtoId) === Number(produtoId)
  );

  if (!item) return;

  const quantidade = Number(valor);
  const disponivel = estoqueBaseProduto(produtoId);

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    return;
  }

  if (quantidade > disponivel) {
    showToast(`Estoque insuficiente. Disponível: ${disponivel}`, "error");
    item.quantidade = disponivel;
  } else {
    item.quantidade = quantidade;
  }

  renderSaleCart();
}

function calcularTotaisCarrinho() {
  const subtotal = saleCart.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  const pagamentoSelect = document.getElementById("salePagamento");
  const pagamento = pagamentoSelect ? pagamentoSelect.value : "";

  const descontoPerc =
    (pagamento && state.descontosPagamento[pagamento]) || 0;

  const descontoValor = subtotal * (descontoPerc / 100);
  const total = subtotal - descontoValor;

  return { subtotal, pagamento, descontoPerc, descontoValor, total };
}

function renderSaleCart() {
  const body = document.getElementById("saleCartBody");
  const totalsBox = document.getElementById("saleTotals");

  if (!body || !totalsBox) return;

  body.innerHTML = saleCart.length
    ? saleCart
        .map(
          item => `
            <tr>
              <td>${item.nome}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value="${item.quantidade}"
                  style="width:64px"
                  onchange="atualizarQtdItemVenda(${item.produtoId}, this.value)"
                >
              </td>
              <td>${money(item.preco)}</td>
              <td><b>${money(item.preco * item.quantidade)}</b></td>
              <td>
                <button
                  type="button"
                  class="action-btn delete"
                  title="Remover"
                  onclick="removerItemVenda(${item.produtoId})"
                >
                  🗑️
                </button>
              </td>
            </tr>
          `
        )
        .join("")
    : `
      <tr>
        <td colspan="5" class="empty-state">
          Nenhum produto adicionado.
        </td>
      </tr>
    `;

  const { subtotal, descontoPerc, descontoValor, total } =
    calcularTotaisCarrinho();

  totalsBox.innerHTML = `
    <div class="sale-total-line">
      <span>Subtotal</span>
      <span>${money(subtotal)}</span>
    </div>
    <div class="sale-total-line">
      <span>Desconto${descontoPerc ? " (" + descontoPerc + "%)" : ""}</span>
      <span>${descontoValor ? "- " + money(descontoValor) : money(0)}</span>
    </div>
    <div class="sale-total">
      <span>Total da venda</span>
      <strong>${money(total)}</strong>
    </div>
  `;
}

function saveSaleCart(e) {
  e.preventDefault();

  const f = new FormData(e.target);
  const cliente = String(f.get("cliente") || "").trim();
  const pagamento = f.get("pagamento");

  if (!cliente) {
    showToast("Informe o nome do cliente", "error");
    return;
  }

  if (!saleCart.length) {
    showToast("Adicione ao menos um produto à venda", "error");
    return;
  }

  if (!pagamento) {
    showToast("Selecione a forma de pagamento", "error");
    return;
  }

  /* Revalida disponibilidade de cada item antes de confirmar */
  for (const item of saleCart) {
    const disponivel = estoqueBaseProduto(item.produtoId);
    if (item.quantidade > disponivel) {
      showToast(`Estoque insuficiente para ${item.nome}. Disponível: ${disponivel}`, "error");
      return;
    }
  }

  const { subtotal, descontoPerc, descontoValor, total } =
    calcularTotaisCarrinho();

  const produtosVenda = saleCart.map(item => ({
    produtoId: item.produtoId,
    nome: item.nome,
    preco: item.preco,
    quantidade: item.quantidade,
    subtotal: item.preco * item.quantidade
  }));

  const quantidadeTotal = produtosVenda.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  if (saleEditId) {
    const vendaOriginal = state.vendas.find(v => v.id === saleEditId);

    /* Restaura estoque somente se a venda original já controlava estoque */
    if (vendaOriginal && vendaOriginal.controlaEstoque) {
      (vendaOriginal.produtos || []).forEach(item => {
        const produto = state.produtos.find(
          p => Number(p.id) === Number(item.produtoId)
        );
        if (produto) {
          produto.estoque += Number(item.quantidade);
          atualizarStatusProduto(produto);
        }
      });
    }

    /* Baixa o estoque com os novos itens (a venda passa a controlar estoque) */
    produtosVenda.forEach(item => {
      const produto = state.produtos.find(
        p => Number(p.id) === Number(item.produtoId)
      );
      if (produto) {
        produto.estoque -= item.quantidade;
        atualizarStatusProduto(produto);
      }
    });

    vendaOriginal.cliente = cliente;
    vendaOriginal.produtos = produtosVenda;
    vendaOriginal.produtoNome = produtosVenda[0].nome;
    vendaOriginal.itens = quantidadeTotal;
    vendaOriginal.precoUnitario = produtosVenda[0].preco;
    vendaOriginal.subtotal = subtotal;
    vendaOriginal.desconto = descontoPerc;
    vendaOriginal.descontoValor = descontoValor;
    vendaOriginal.total = total;
    vendaOriginal.pagamento = pagamento;
    vendaOriginal.controlaEstoque = true;

    closeModal();
    atualizarSistema("vendas");
    showToast("Venda atualizada com sucesso");
    return;
  }

  /* Baixa o estoque para venda nova */
  produtosVenda.forEach(item => {
    const produto = state.produtos.find(
      p => Number(p.id) === Number(item.produtoId)
    );
    if (produto) {
      produto.estoque -= item.quantidade;
      atualizarStatusProduto(produto);
    }
  });

  /* Próximo número de pedido */
  const numerosPedidos = state.vendas
    .map(venda => Number(String(venda.id).replace("#", "")))
    .filter(numero => !isNaN(numero));

  const maiorNumero = numerosPedidos.length
    ? Math.max(...numerosPedidos)
    : 1043;

  const novoNumero = maiorNumero + 1;

  state.vendas.unshift({
    id: "#" + novoNumero,
    cliente,
    produtos: produtosVenda,
    produtoNome: produtosVenda[0].nome,
    data: new Date().toLocaleDateString("pt-BR"),
    itens: quantidadeTotal,
    precoUnitario: produtosVenda[0].preco,
    subtotal,
    desconto: descontoPerc,
    descontoValor,
    total,
    pagamento,
    controlaEstoque: true
  });

  closeModal();
  atualizarSistema("vendas");
  showToast("Venda registrada e estoque atualizado");
}

/* =========================================================
   EXCLUIR VENDA
========================================================= */

function deleteSale(id) {
  const sale = state.vendas.find(v => v.id === id);
  if (!sale) return;

  if (!confirm("Excluir esta venda?")) return;

  if (sale.controlaEstoque) {
    (sale.produtos || []).forEach(item => {
      const produto = state.produtos.find(
        p => Number(p.id) === Number(item.produtoId)
      );
      if (produto) {
        produto.estoque += Number(item.quantidade);
        atualizarStatusProduto(produto);
      }
    });
  }

  state.vendas = state.vendas.filter(v => v.id !== id);

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
    showToast("Produto não encontrado", "error");
    return;
  }

  if (
    !Number.isInteger(quantidade) ||
    quantidade <= 0
  ) {
    showToast(
      "Informe uma quantidade válida",
      "error"
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
        `Estoque insuficiente. Disponível: ${produto.estoque}`,
        "error"
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
                            ${produtoResumoVenda(venda)}
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
            ${(venda.produtos && venda.produtos.length
              ? venda.produtos
              : [{ nome: venda.produtoNome, quantidade: venda.itens, preco: venda.precoUnitario, subtotal: venda.total }]
            )
              .map(
                item => `
                  <tr>
                    <td>${item.nome}</td>
                    <td>${item.quantidade}</td>
                    <td>${money(item.preco)}</td>
                    <td>${money(item.subtotal != null ? item.subtotal : item.preco * item.quantidade)}</td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      ${
        venda.desconto
          ? `
            <div class="invoice-row">
              <span class="invoice-label">Subtotal</span>
              <strong>${money(venda.subtotal)}</strong>
            </div>
            <div class="invoice-row">
              <span class="invoice-label">Desconto (${venda.desconto}%)</span>
              <strong>- ${money(venda.descontoValor)}</strong>
            </div>
          `
          : ""
      }

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
  const porDiaMap = faturamentoPorDiaMap();

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
  const porProdutoMap = quantidadePorProdutoMap();

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

    <div class="panel">

      <div class="panel-head">
        <div>
          <h2>Descontos por forma de pagamento</h2>
          <p>Percentual aplicado automaticamente ao registrar uma venda.</p>
        </div>
      </div>

      <div class="panel-body">

        <form
          class="form-grid"
          onsubmit="salvarDescontosPagamento(event)"
        >

          ${Object.keys(state.descontosPagamento)
            .map(
              forma => `
                <div class="field">
                  <label>${forma}</label>
                  <input
                    name="${forma}"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value="${state.descontosPagamento[forma]}"
                  >
                </div>
              `
            )
            .join("")}

          <div class="form-actions" style="grid-column:1/-1">
            <button class="primary-btn">Salvar descontos</button>
          </div>

        </form>

      </div>

    </div>
  `;
}

function salvarDescontosPagamento(e) {
  e.preventDefault();

  const f = new FormData(e.target);

  Object.keys(state.descontosPagamento).forEach(forma => {
    const valor = Number(f.get(forma));
    state.descontosPagamento[forma] = isNaN(valor)
      ? 0
      : Math.min(100, Math.max(0, valor));
  });

  showToast("Descontos por forma de pagamento atualizados");
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

const TOAST_ICONS = {
  success:
    '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor" opacity=".18"/><path d="M6 10.5l2.5 2.5L14 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  error:
    '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="10" fill="currentColor" opacity=".18"/><path d="M10 6v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="13.5" r="1" fill="currentColor"/></svg>',
};

function showToast(message, type = "success") {
  if (!toast) return;

  toast.innerHTML =
    `<span class="toast-icon">${TOAST_ICONS[type] || TOAST_ICONS.success}</span><span class="toast-msg">${message}</span>`;

  toast.classList.remove("toast-success", "toast-error");
  toast.classList.add(
    type === "error" ? "toast-error" : "toast-success"
  );

  toast.classList.add("show");

  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
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
      showToast("E-mail ou senha inválidos.", "error");
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
