document.addEventListener('DOMContentLoaded', function () {
    let preguntas = [];
    let preguntaActual = 0;
    let errores = 0;
    let puntaje = 0;
    let tiempo = 15;
    let mejorRecord = localStorage.getItem('mejorRecord') || 0;
    let intervalo;

    // Cargar sonidos y música
    const sonidoCorrecto = new Audio('./correcto.mp3');
    const sonidoIncorrecto = new Audio('./incorrecto.mp3');
    const sonidoTiempoAgotado = new Audio('./tiempoAgotado.mp3');
    const sonidoBoton = new Audio('./Click.mp3');
    const sonidoAdvertenciaTiempo = new Audio('./tiempo.mp3');
    const sonidoJuegoTerminado = new Audio('./finJuego.mp3');

    // Pre-cargar sonidos
    [sonidoCorrecto, sonidoIncorrecto, sonidoTiempoAgotado, sonidoBoton, sonidoAdvertenciaTiempo, sonidoJuegoTerminado].forEach(audio => audio.load());

    // Cargar música del menú y manejar posibles errores
    const menuMusic = document.getElementById('menuMusic');
    if (menuMusic) {
        menuMusic.volume = 0.5;
        menuMusic.play().catch(error => console.error('No se pudo reproducir la música del menú:', error));
    } else {
        console.error('Elemento de música del menú no encontrado');
    }

    // Reproducir mensaje de voz en el inicio
    const mensajeVoz = new Audio('./bienvenida.mp3');
    mensajeVoz.play().catch(error => console.error('No se pudo reproducir el mensaje de voz:', error));

    // Cargar preguntas desde el JSON
    async function cargarPreguntas() {
        try {
            const response = await fetch('preguntas.json');
            const data = await response.json();
            preguntas = data.preguntas.sort(() => 0.5 - Math.random());
            mostrarPregunta();
        } catch (error) {
            console.error('Error al cargar las preguntas:', error);
            mostrarMensaje('Error al cargar las preguntas. Por favor, intenta nuevamente.', 'error');
        }
    }

    // Mostrar la pregunta y opciones
    function mostrarPregunta() {
        clearInterval(intervalo);

        if (errores >= 5) {
            finalizarJuego();
            return;
        }

        // Reiniciar el tiempo
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
        const [pregunta] = preguntas.splice(preguntaActual, 1);

        if (opcion === pregunta.respuestaCorrecta) {
            puntaje++;
            sonidoCorrecto.play();
            mostrarMensaje('¡Correcto!', 'success');
            if (puntaje % 10 === 0) {
                mostrarMensaje('¡Sigue así! ¡Estás haciendo un gran trabajo!', 'motivacion');
            }
        } else {
            errores++;
            sonidoIncorrecto.play();
            mostrarMensaje('¡Incorrecto!', 'error');
        }

        sonidoAdvertenciaTiempo.pause(); // Detener el sonido de advertencia si suena
        sonidoAdvertenciaTiempo.currentTime = 0; // Reiniciar el sonido de advertencia

        if (errores >= 5) {
            finalizarJuego();
            return;
        }

        setTimeout(mostrarPregunta, 2000);
    }

    // Reducir el tiempo del contador
    function reducirTiempo() {
        tiempo--;
        actualizarTiempo();

        if (tiempo === 10) { // Reproducir el sonido solo cuando el tiempo esté en 10 segundos
            sonidoAdvertenciaTiempo.play();
        }

        if (tiempo <= 0) {
            clearInterval(intervalo);
            errores++;
            sonidoTiempoAgotado.play();
            sonidoAdvertenciaTiempo.pause(); // Detener el sonido de advertencia si suena
            sonidoAdvertenciaTiempo.currentTime = 0; // Reiniciar el sonido de advertencia
            mostrarMensaje('¡Tiempo agotado!', 'error');
            setTimeout(mostrarPregunta, 2000);
        }
    }

    // Actualizar el tiempo en la pantalla
    function actualizarTiempo() {
        document.getElementById('contador-tiempo').textContent = `Tiempo: ${tiempo}s`;
    }

    // Mostrar mensaje en pantalla
    function mostrarMensaje(mensaje, tipo) {
        const mensajeElemento = document.getElementById('mensaje');
        mensajeElemento.textContent = mensaje;
        mensajeElemento.className = tipo;
        setTimeout(() => {
            mensajeElemento.textContent = '';
            mensajeElemento.className = '';
        }, 2000);
    }

    // Finalizar el juego
    function finalizarJuego() {
        clearInterval(intervalo);
        if (menuMusic) {
            menuMusic.pause();
        }
        sonidoJuegoTerminado.play();
        if (puntaje > mejorRecord) {
            mejorRecord = puntaje;
            localStorage.setItem('mejorRecord', mejorRecord);
        }
        mostrarMensaje(`¡Juego terminado! Tu puntuación: ${puntaje}. Mejor puntuación: ${mejorRecord}`, 'final');
        setTimeout(() => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = '../Juego/indexJuego.html';
            }, 500);
        }, 5000);
    }

    // Iniciar el juego
    cargarPreguntas();
});
