import { organizarDatosGraficoVolumenLlamadas, organizarDatosGraficoLlamadasAgente } from './script.js'

window.addEventListener('DOMContentLoaded', () => {

    let llamadas = [];

    fetch('./calls.json')
        .then((data) => data.json())
        .then((data) => {
            llamadas = data;

            const { labels, dataContestadas, dataPerdidas, dataTotal, dataTransferidas } = organizarDatosGraficoVolumenLlamadas(data);
            crearGraficoVolumenDato(labels, dataContestadas, dataPerdidas, dataTotal, dataTransferidas);

            const { labelsAgente, contestadasAgente, perdidasAgente, transferidasAgente } = organizarDatosGraficoLlamadasAgente(data);
            crearGraficoLlamadasAGente(labelsAgente, contestadasAgente, perdidasAgente, transferidasAgente);

            generarFiltros();
            mostrarDatosTabla(data);
        })
        .catch((error) => console.log(error));

    const crearGraficoVolumenDato = (labels, dataContestadas, dataPerdidas, dataTotal, dataTransferidas) => {
        const ctx = document.getElementById('volumen_llamadas').getContext('2d');
        const data = {
            labels,
            datasets: [
                {
                    label: "Contestadas",
                    data: dataContestadas,
                    borderColor: "#4CAF50",
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: "Perdidas",
                    data: dataPerdidas,
                    borderColor: "#F44336",
                    backgroundColor: "rgba(244, 67, 54, 0.2)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: "Transferidas",
                    data: dataTransferidas,
                    borderColor: "#2196F3",
                    backgroundColor: "rgba(33, 150, 243, 0.2)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: "Total",
                    data: dataTotal,
                    borderColor: "#FF9800",
                    backgroundColor: "rgba(255,152,0,0.2)",
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }
            ]
        };

        const config = {
            type: "line",
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: "index", intersect: false },
                plugins: {
                    legend: { position: "top", labels: { usePointStyle: true, padding: 20 } },
                    title: {
                        display: true,
                        text: "Volumen de Llamadas",
                        font: { size: 16, weight: "bold" }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.dataset.label}: ${context.formattedValue} llamadas`;
                            }
                        }
                    }
                },
                scales: {
                    x: { title: { display: true, text: "Fecha" }, grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: "Cantidad de llamadas" },
                        grid: { color: "rgba(0,0,0,0.05)" }
                    }
                }
            }
        };
        new Chart(ctx, config);
    };

    const crearGraficoLlamadasAGente = (labelsAgente, contestadasAgente, perdidasAgente, transferidasAgente) => {
        const ctx = document.getElementById('llamadas_agente').getContext('2d');

        const data = {
            labels: labelsAgente,
            datasets: [
                { label: "Contestadas", data: contestadasAgente, backgroundColor: "#4CAF50" },
                { label: "Perdidas", data: perdidasAgente, backgroundColor: "#F44336" },
                { label: "Transferidas", data: transferidasAgente, backgroundColor: "#2196F3" }
            ]
        };

        const config = {
            type: 'bar',
            data,
            options: {
                responsive: true,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                }
            }
        };

        new Chart(ctx, config);
    };

    const mostrarDatosTabla = (llamadas = []) => {
        const tbody = document.querySelector("#tablaLlamadas tbody");
        tbody.innerHTML = "";

        llamadas.forEach((llamada) => {
            const fecha = new Date(llamada.datetime).toLocaleDateString();
            let estado = "";

            if (llamada.status === 'answered') estado = 'Contestada';
            else if (llamada.status === 'missed') estado = 'Perdida';
            else if (llamada.status === 'transferred') estado = 'Transferida';

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${fecha}</td>
                <td>${llamada.source}</td>
                <td>${llamada.extension}</td>
                <td>${llamada.agent_name}</td>
                <td>${estado}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    function generarFiltros() {
        const filtroAgente = document.getElementById("filtroAgente");
        const filtroEstado = document.getElementById("filtroEstado");

        const agentes = [...new Set(llamadas.map((l) => l.agent_name))];
        const estados = [...new Set(llamadas.map((l) => l.status))];

        filtroAgente.innerHTML = `<option value="">Todos los agentes</option>`;
        filtroEstado.innerHTML = `<option value="">Todos los estados</option>`;

        agentes.forEach((agente) => {
            const option = document.createElement("option");
            option.value = agente;
            option.textContent = agente;
            filtroAgente.appendChild(option);
        });

        estados.forEach((estado) => {
            const option = document.createElement("option");
            option.value = estado;
            option.textContent =
                estado === "answered"
                    ? "Contestada"
                    : estado === "missed"
                        ? "Perdida"
                        : "Transferida";
            filtroEstado.appendChild(option);
        });
    }

    function aplicarFiltros() {
        const agente = document.getElementById("filtroAgente").value;
        const estado = document.getElementById("filtroEstado").value;

        const filtradas = llamadas.filter((llamada) => {
            const coincideAgente = !agente || llamada.agent_name === agente;
            const coincideEstado = !estado || llamada.status === estado;
            return coincideAgente && coincideEstado;
        });

        mostrarDatosTabla(filtradas);
    }


    function exportarTablaCSV() {
        const filas = document.querySelectorAll("#tablaLlamadas table tr");
        let csv = [];

        filas.forEach((fila) => {
            const columnas = fila.querySelectorAll("th, td");
            const valores = Array.from(columnas).map(col => `"${col.innerText}"`);
            csv.push(valores.join(","));
        });

        const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "llamadas.csv";
        link.click();
    }

    document.getElementById("btnExportar").addEventListener("click", exportarTablaCSV);

    document.getElementById("filtroAgente").addEventListener("change", aplicarFiltros);
    document.getElementById("filtroEstado").addEventListener("change", aplicarFiltros);
});
