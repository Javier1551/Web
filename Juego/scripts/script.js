document.addEventListener('DOMContentLoaded', function () {
    let preguntas = [];
    let preguntaActual = 0;
    let errores = 0;
    let puntaje = 0;
    let tiempo = 15;
    let mejorRecord = localStorage.getItem('mejorRecord') || 0;
    let intervalo;
    const mensajeMotivador = "¡Bien hecho!"; // Mensaje motivador al ganar
    const mensajePerdedor = "¡Sigue intentándolo!"; // Mensaje motivador al perder

    // Cargar sonidos
    const sonidoCorrecto = new Audio('./correcto.mp3');
    const sonidoIncorrecto = new Audio('./incorrecto.mp3');
    const sonidoTiempoAgotado = new Audio('./tiempoAgotado.mp3');
    const sonidoBoton = new Audio('./Click.mp3');
    const sonidoAdvertenciaTiempo = new Audio('./tiempo.mp3');
    const sonidoJuegoTerminado = new Audio('./finJuego.mp3');
    const sonidoMotivador = new Audio('./motivacion.mp3'); // Audio motivador para cada 10 preguntas correctas

    // Cargar preguntas desde el JSON
    async function cargarPreguntas() {
        try {
            const response = await fetch('preguntas.json');
            const data = await response.json();
            preguntas = data.preguntas.sort(() => 0.5 - Math.random());
            mostrarPregunta();
        } catch (error) {
            console.error('Error al cargar las preguntas:', error);
        }
    }

    // Mostrar la pregunta y opciones
    function mostrarPregunta() {
        if (errores >= 5 || preguntas.length === 0) {
            finalizarJuego();
            return;
        }
        tiempo = 15;
        actualizarTiempo();

        const pregunta = preguntas[preguntaActual];
        document.getElementById('pregunta').textContent = pregunta.pregunta;
        const opciones = document.getElementById('opciones');
        opciones.innerHTML = '';

        for (const opcion in pregunta.opciones) {
            const button = document.createElement('button');
            button.textContent = `${opcion.toUpperCase()}: ${pregunta.opciones[opcion]}`;
            button.addEventListener('click', () => {
                sonidoBoton.play();
                verificarRespuesta(opcion);
                desactivarOpciones();
            });
            opciones.appendChild(button);
        }

        document.getElementById('contador-preguntas').textContent = `Pregunta: ${preguntaActual + 1}/${preguntas.length}`;
        intervalo = setInterval(reducirTiempo, 1000);
    }

    // Desactivar las opciones después de seleccionar una
    function desactivarOpciones() {
        const botones = document.querySelectorAll('#opciones button');
        botones.forEach(boton => boton.disabled = true);
    }

    // Verificar si la respuesta es correcta o incorrecta
    function verificarRespuesta(opcion) {
        clearInterval(intervalo);
        const pregunta = preguntas.splice(preguntaActual, 1)[0]; // Remover pregunta actual

        if (opcion === pregunta.respuestaCorrecta) {
            puntaje++;
            sonidoCorrecto.play();
            mostrarMensaje('¡Correcto!', 'success');
            if (puntaje % 10 === 0) {
                sonidoMotivador.play();
                mostrarMensaje('¡Sigue así! ¡Estás haciendo un gran trabajo!', 'motivacion');
            }
        } else {
            errores++;
            sonidoIncorrecto.play();
            mostrarMensaje('¡Incorrecto!', 'error');
        }

        setTimeout(mostrarPregunta, 2000);
    }

    // Reducir el tiempo del contador
    function reducirTiempo() {
        tiempo--;
        actualizarTiempo();

        if (tiempo <= 0) {
            clearInterval(intervalo);
            sonidoTiempoAgotado.play();
            verificarRespuesta(null); // Tratamos como si se hubiera quedado sin tiempo
        }
    }

    // Actualizar el tiempo en la pantalla
    function actualizarTiempo() {
        document.getElementById('contador-tiempo').textContent = `Tiempo: ${tiempo}s`;
        if (tiempo <= 5 && tiempo > 0) {
            sonidoAdvertenciaTiempo.play();
        }
    }

    // Mostrar mensaje al usuario
    function mostrarMensaje(mensaje, tipo) {
        const mensajeElement = document.getElementById('mensaje');
        mensajeElement.textContent = mensaje;
        mensajeElement.className = tipo;
        setTimeout(() => {
            mensajeElement.textContent = '';
            mensajeElement.className = '';
        }, tipo === 'motivacion' ? 6000 : 2000);
    }

    // Finalizar el juego
    function finalizarJuego() {
        clearInterval(intervalo);
        if (puntaje > mejorRecord) {
            mejorRecord = puntaje;
            localStorage.setItem('mejorRecord', mejorRecord);
        }
        if (errores >= 5) {
            mostrarMensaje(mensajePerdedor, 'error');
            setTimeout(() => {
                sonidoJuegoTerminado.play();
                // Aquí puedes redirigir al menú o hacer otra cosa después de 6 segundos
            }, 6000);
        } else {
            mostrarMensaje(mensajeMotivador, 'success');
            setTimeout(() => {
                sonidoJuegoTerminado.play();
                // Aquí puedes redirigir al menú o hacer otra cosa después de 10 segundos
            }, 10000);
        }
        actualizarMejorRecord(); // Actualizar el mejor récord al finalizar el juego
    }

    // Actualizar el mejor récord en la pantalla
    function actualizarMejorRecord() {
        document.getElementById('mejor-record').textContent = mejorRecord;
    }

    cargarPreguntas();
});
