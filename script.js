


export const organizarDatosGraficoVolumenLlamadas = (llamadas = []) => {

    let resumen = {}



    llamadas.forEach((llamada) => {


        let fecha = new Date(llamada.datetime).toLocaleDateString()

        // Si no existe la fecha, agrega la fecha con datos inicializados en 0
        if (!resumen[fecha]) {
            resumen[fecha] = {
                contestadas: 0,
                perdidas: 0,
                transferidas: 0
            }
        }

        // realiza conteo de estado llamada agrupado por fecha
        if (llamada.status == 'answered') resumen[fecha].contestadas++
        if (llamada.status == 'missed') resumen[fecha].perdidas++
        if (llamada.status == 'transferred') resumen[fecha].transferidas++
    });

    const labels = Object.keys(resumen).sort()
    const dataContestadas = labels.map(f => resumen[f].contestadas)
    const dataPerdidas = labels.map(f => resumen[f].perdidas)
    const dataTransferidas = labels.map(f => resumen[f].transferidas)
    const dataTotal = labels.map(f =>
        resumen[f].contestadas + resumen[f].perdidas + resumen[f].transferidas
    );

    return { labels, dataContestadas, dataPerdidas, dataTransferidas, dataTotal }
}

export const organizarDatosGraficoLlamadasAgente = (llamadas = []) => {
    
    let resumen = {}
    llamadas.forEach(llamada => {

        let agente = llamada.agent_name
        if (!resumen[agente]) {
            resumen[agente] = {
                contestadas: 0,
                transferidas: 0,
                perdidas: 0
            }
        }

        if(llamada.status == 'answered') resumen[agente].contestadas++
        if(llamada.status == 'missed') resumen[agente].perdidas++
        if(llamada.status == 'transferred') resumen[agente].transferidas++
    })

    const labelsAgente = Object.keys(resumen)
    const contestadasAgente = labelsAgente.map(a => resumen[a].contestadas)
    const perdidasAgente = labelsAgente.map(a => resumen[a].perdidas)
    const transferidasAgente = labelsAgente.map(a => resumen[a].transferidas)

    return {labelsAgente, contestadasAgente, perdidasAgente, transferidasAgente}

}
