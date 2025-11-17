// relatorios.js
let chartBarras, chartLinhas, chartPizza;

async function loadRelatorios() {
  const [top, hist, distTipo, mini] = await Promise.all([api("/api/relatorios/alimentos-mais-doados"), api("/api/relatorios/historico-doa-dist"), api("/api/relatorios/distribuicao-tipo-instituicao"), api("/api/relatorios/mini-grid-instituicoes")]);
  {
    const labels = top.map((x) => x.item),
      data = top.map((x) => Number(x.total));
    chartBarras = new Chart(document.getElementById("barTopItens").getContext("2d"), { type: "bar", data: { labels, datasets: [{ label: "Total (itens)", data }] }, options: { responsive: true, maintainAspectRatio: false } });
  }
  {
    const labels = hist.map((x) => x.mes),
      doa = hist.map((x) => Number(x.doacoes)),
      dis = hist.map((x) => Number(x.distribuicoes));
    chartLinhas = new Chart(document.getElementById("lineHist").getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Doações", data: doa, tension: 0.3 },
          { label: "Distribuições", data: dis, tension: 0.3 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }
  {
    const labels = distTipo.map((x) => x.tipo),
      data = distTipo.map((x) => Number(x.total));
    chartPizza = new Chart(document.getElementById("pieTipos").getContext("2d"), { type: "pie", data: { labels, datasets: [{ data }] }, options: { responsive: true, maintainAspectRatio: false } });
  }

  const grid = document.getElementById("miniGrid");

  grid.innerHTML = "<tr><th>Instituição</th><th>Qtd</th><th>Data</th></tr>";
  for (const r of mini) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${r.instituicao}</td><td>${r.qtd}</td><td>${new Date(r.data).toLocaleDateString()}</td>`;
    grid.appendChild(tr);
  }
}
