/*
  --------------------------------------------------------------------------------------
  Função para fazer previsão de atraso de voo via requisição GET
  --------------------------------------------------------------------------------------
*/

const predictFlightDelay = async (airline, flight, airportFrom, airportTo, dayOfWeek, time, length) => {
    
  // Constrói a URL com os parâmetros
  const params = new URLSearchParams({
    airline: airline,
    flight: flight,
    airportFrom: airportFrom,
    airportTo: airportTo,
    dayOfWeek: dayOfWeek,
    time: time,
    length: length
  });

  let url = `http://127.0.0.1:5000/predict?${params.toString()}`;
  
  return fetch(url, {
    method: 'get'
  })
    .then((response) => response.json())
    .then((data) => {
      return data; // Retorna os dados da previsão
    })
    .catch((error) => {
      console.error('Error:', error);
      throw error;
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para mostrar o resultado da previsão
  --------------------------------------------------------------------------------------
*/
const showPredictionResult = (prediction) => {
  const resultContainer = document.getElementById("predictionResult");
  const outputElement = document.getElementById("predictionOutput");
  
  // Remove classes anteriores
  outputElement.className = "prediction-output";
  
  // Define o texto e a classe baseado na previsão
  if (prediction === 1) {
    outputElement.textContent = "ATRASO PREVISTO";
    outputElement.classList.add("prediction-delay");
  } else {
    outputElement.textContent = "SEM ATRASO PREVISTO";
    outputElement.classList.add("prediction-no-delay");
  }
  
  // Mostra o container de resultado
  resultContainer.style.display = "block";
  
  // Scroll suave para o resultado
  resultContainer.scrollIntoView({ 
    behavior: 'smooth', 
    block: 'center' 
  });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma nova previsão de voo
  --------------------------------------------------------------------------------------
*/
const newItem = async (event) => {
  event.preventDefault();

  let inputAirline = document.getElementById("newAirline").value;
  let inputFlight = document.getElementById("newFlight").value;
  let inputAirportFrom = document.getElementById("newAirportFrom").value;
  let inputAirportTo = document.getElementById("newAirportTo").value;
  let inputDayOfWeek = document.getElementById("newDayOfWeek").value;
  let inputTime = document.getElementById("newTime").value;
  let inputLength = document.getElementById("newLength").value;

  // Validações
  if (inputAirline === '' || inputFlight === '' || inputAirportFrom === '' || inputAirportTo === '' || inputDayOfWeek === '' || inputTime === '' || inputLength === '') {
    alert("Por favor, preencha todos os campos obrigatórios!");
    return;
  }
  
  if (isNaN(inputFlight) || isNaN(inputTime) || isNaN(inputLength)) {
    alert("Os campos Flight Number, Time e Length devem ser números!");
    return;
  }
  
  // Validação específica para Flight Number
  const flightNumber = parseInt(inputFlight);
  if (flightNumber < 1) {
    alert("Flight Number deve ser um número positivo!");
    return;
  }
  
  // DayOfWeek agora vem do select, então já é um número válido de 1-7
  const dayOfWeek = parseInt(inputDayOfWeek);
  if (dayOfWeek < 1 || dayOfWeek > 7) {
    alert("Day of Week deve ser um número entre 1 e 7!");
    return;
  }
  
  // Validação específica para Time (minutos desde meia-noite)
  const timeMinutes = parseInt(inputTime);
  if (timeMinutes < 0 || timeMinutes > 1439) {
    alert("Time deve ser entre 0 e 1439 minutos (0 = meia-noite, 1439 = 23:59)!");
    return;
  }
  
  // Validação específica para Flight Length
  const flightLength = parseInt(inputLength);
  if (flightLength < 1) {
    alert("Flight Length deve ser um número positivo (distância em milhas)!");
    return;
  }

  // Validação dos códigos dos aeroportos
  if (!validAirportCodes.includes(inputAirportFrom)) {
    alert(`Código do aeroporto de origem inválido! (${inputAirportFrom})`);
    return;
  }
  
  if (!validAirportCodes.includes(inputAirportTo)) {
    alert(`Código do aeroporto de destino inválido! (${inputAirportTo})`);
    return;
  }

  try {
    // Envia os dados para previsão
    const result = await predictFlightDelay(
      inputAirline, 
      inputFlight, 
      inputAirportFrom, 
      inputAirportTo, 
      inputDayOfWeek, 
      inputTime, 
      inputLength
    );
    
    // Mostra o resultado da previsão
    showPredictionResult(result.delay);
    
  } catch (error) {
    console.error('Erro ao fazer previsão:', error);
    alert("Erro ao fazer previsão. Verifique se o servidor está rodando e tente novamente.");
  }
}