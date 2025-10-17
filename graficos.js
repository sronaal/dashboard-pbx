import { organizarDatosGraficoVolumenLlamadas, organizarDatosGraficoLlamadasAgente } from './script.js'

window.addEventListener('DOMContentLoaded', () => {



    fetch('./calls.json')
        .then((data) => {

            return data.json()
        })
        .then((data) => {
            const { labels, dataContestadas, dataPerdidas, dataTotal, dataTransferidas } = organizarDatosGraficoVolumenLlamadas(data)
            crearGraficoVolumenDato(labels, dataContestadas, dataPerdidas, dataTotal, dataTransferidas)
            console.log(data)
            const { labelsAgente, contestadasAgente, perdidasAgente, transferidasAgente } = organizarDatosGraficoLlamadasAgente(data)
            crearGraficoLlamadasAGente(labelsAgente, contestadasAgente, perdidasAgente, transferidasAgente)
        
            mostrarDatosTabla(data)
        })
        .catch((error) => {
            console.log(error)
        })

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
                    backgroundColor: "rbga(255,152,0,0.2)",
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
                        font: { size: 16, weigth: "bold" }
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
        }
        new Chart(ctx, config)
    }

    const crearGraficoLlamadasAGente = (labelsAgente, contestadasAgente, perdidasAgente, transferidasAgente) => {
        const ctx = document.getElementById('llamadas_agente').getContext('2d');

        const data = {
            labels: labelsAgente,  // <-- nombres de los agentes
            datasets: [
                {
                    label: "Contestadas",
                    data: contestadasAgente,
                    backgroundColor: "#4CAF50"
                },
                {
                    label: "Perdidas",
                    data: perdidasAgente,
                    backgroundColor: "#F44336"
                },
                {
                    label: "Transferidas",
                    data: transferidasAgente,
                    backgroundColor: "#2196F3"
                }
            ]
        };

        const config = {
            type: 'bar',
            data,
            options: {
                responsive: true,
                scales: {
                   x:{ stacked: true}
                },
                y: { stacked: true}
            }
        };

        new Chart(ctx, config);
    };

    const mostrarDatosTabla = (llamadas = []) => {

        const tbody = document.querySelector("#tablaLlamadas tbody")
        tbody.innerHTML = ""

        llamadas.forEach((llamada) => {

            const fecha = new Date(llamada.datetime).toLocaleDateString()
            

            const tr = document.createElement("tr")

            tr.innerHTML = `
                <td>${fecha}</td>
                <td>${llamada.source}</td>
                <td>${llamada.extension}</td>
                <td>${llamada.agent_name}</td>
                <td>${llamada.status}</td>
            `;
            tbody.appendChild(tr)
        })
        
    }







})

