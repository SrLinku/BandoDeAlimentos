// inicio_charts.js
async function loadInicioV2() {
  const [rec, dist, risco, alertas] = await Promise.all([api("/api/relatorios/recebimentos-mes"), api("/api/relatorios/distribuicoes-mes"), api("/api/relatorios/risco-lotes"), api("/api/relatorios/alertas")]);
  qs("#kpi_receb").textContent = (rec.total || 0).toLocaleString("pt-BR") + " kg";
  qs("#kpi_dist").textContent = (dist.total || 0).toLocaleString("pt-BR") + " kg";
  qs("#kpi_risco").textContent = (risco.qtd || 0) + " Lotes";

  if (qs("#alert_lotes")) qs("#alert_lotes").textContent = `${alertas.vencem7 || 0} Lotes vencem nos próximos 7 dias`;
  if (qs("#alert_coletas")) qs("#alert_coletas").textContent = `${alertas.coletasHoje || 0} Coletas agendadas para hoje`;

  const serie = await api("/api/relatorios/recebimentos-vs-distribuicoes?dias=30");
  const labels = serie.map((r) => r.dia);
  const receb = serie.map((r) => Number(r.recebimentos));
  const distr = serie.map((r) => Number(r.distribuicoes));

  const ctx = document.getElementById("chartRxD").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Recebido", data: receb, tension: 0.3, fill: false },
        { label: "Distribuído", data: distr, tension: 0.3, fill: false },
      ],
    },
    options: { responsive: true, maintainAspectRatio: false },
  });
}
