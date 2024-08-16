document.addEventListener('DOMContentLoaded', function () {
    let preguntas = [];
    let preguntaActual = 0;
    let errores = 0;
    let puntaje = 0;
    let tiempo = 15;
    let mejorRecord = localStorage.getItem('mejorRecord') || 0;
    let intervalo;

    // Cargar sonidos
    const sonidoCorrecto = new Audio('./correcto.mp3');
    const sonidoIncorrecto = new Audio('./incorrecto.mp3');
    const sonidoTiempoAgotado = new Audio('./tiempoAgotado.mp3');
    const sonidoBoton = new Audio('./Click.mp3');
    const sonidoAdvertenciaTiempo = new Audio('./tiempo.mp3');
    const sonidoJuegoTerminado = new Audio('./finJuego.mp3');
    const audioMotivadorCada10 = new Audio('./sigueasi.mp3');
    const audioFinDelJuego = new Audio('./findeljuego.mp3');
    const audioGanasteJuego = new Audio('./mensajemotivaforganadte.mp3');

    // Cargar música del menú y manejar posibles errores
    const menuMusic = document.getElementById('menuMusic');
    if (menuMusic) {
        menuMusic.volume = 0.5;
        menuMusic.play().catch(error => {
            console.error('No se pudo reproducir la música del menú:', error);
        });
    } else {
        console.error('Elemento de música del menú no encontrado');
    }

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
        if (preguntas.length === 0 || errores >= 5) {
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

        document.getElementById('contador-preguntas').textContent = `Pregunta: ${puntaje + 1}/${preguntas.length}`;
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
        const pregunta = preguntas.splice(preguntaActual, 1)[0];

        if (opcion === pregunta.respuestaCorrecta) {
            puntaje++;
            sonidoCorrecto.play();
            mostrarMensaje('¡Correcto!', 'success');
            if (puntaje % 10 === 0 && preguntas.length > 0) {
                mostrarMensaje('¡Asombroso, Vamos sigue así!', 'motivacion');
                audioMotivadorCada10.play();
            }
        } else {
            errores++;
            sonidoIncorrecto.play();
            mostrarMensaje('¡Incorrecto!', 'error');
        }

        if (errores >= 5 || preguntas.length === 0) {
            finalizarJuego();
            return;
        }

        setTimeout(mostrarPregunta, 2000);
    }

    // Reducir el tiempo del contador
    function reducirTiempo() {
        tiempo--;
        actualizarTiempo();

        if (tiempo === 10) { // Ajustado a 10 para que la advertencia sea a la mitad del tiempo
            sonidoAdvertenciaTiempo.play();
        }

        if (tiempo <= 0) {
            clearInterval(intervalo);
            errores++;
            sonidoTiempoAgotado.play(); // Sonido de tiempo agotado
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
        if (menuMusic) {
            menuMusic.pause(); // Detener la música al finalizar el juego
        }

        if (puntaje > mejorRecord) {
            mejorRecord = puntaje;
            localStorage.setItem('mejorRecord', mejorRecord);
        }

        if (errores >= 5) {
            mostrarMensaje('Fin del juego. ¡No te desanimes! ¡Sigue intentándolo!', 'motivacion');
            audioFinDelJuego.play(); // Reproducir sonido de juego terminado
        } else {
            mostrarMensaje('¡Felicidades! ¡Has completado todas las preguntas! Tu conocimiento de la Biblia es Asombroso', 'motivacion');
            audioGanasteJuego.play(); // Reproducir sonido de victoria
        }

        setTimeout(() => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = '../Juego/indexJuego.html'; // Regresar al menú principal
            }, 500);
        }, errores >= 5 ? 6000 : 10000);
    }

    // Iniciar el juego
    cargarPreguntas();
    document.getElementById('mejor-record').textContent = mejorRecord;
});
