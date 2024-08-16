let preguntasCorrectas = 0;
let errores = 0;
const totalPreguntas = 100; // Ajusta esto si tienes un número diferente de preguntas

// Supongamos que este es el código que verifica la respuesta correcta
function verificarRespuesta(respuesta, respuestaCorrecta) {
    if (respuesta === respuestaCorrecta) {
        preguntasCorrectas++;

        // Reproducir audio cada 10 preguntas correctas
        if (preguntasCorrectas % 10 === 0) {
            let audioSigueAsi = new Audio('ruta/al/audio/sigueasi.mp3');
            audioSigueAsi.play();

            mostrarMensajeMotivador("¡Asombroso, Vamos sigue así!");
        }

        // Verificar si el jugador ha ganado (respondido todas las preguntas correctamente)
        if (preguntasCorrectas === totalPreguntas) {
            manejarVictoria();
        }

    } else {
        manejarError();
    }
}

function manejarError() {
    errores++;

    if (errores >= 5) {
        // Reproducir audio de mensaje motivador de fin del juego por errores
        let audioFinDelJuego = new Audio('ruta/al/audio/findeljuego.mp3');
        audioFinDelJuego.play();

        // Mostrar mensaje motivador
        mostrarMensajeMotivador("Fin del juego. ¡No te desanimes! ¡Sigue intentándolo!");

        // Redirigir al menú principal después de unos segundos
        setTimeout(function() {
            window.location.href = 'menuPrincipal.html';
        }, 6000); // Redirige después de 6 segundos
    }
}

function manejarVictoria() {
    // Reproducir audio de victoria
    let audioVictoria = new Audio('ruta/al/audio/mensajemotivaforganadte.mp3');
    audioVictoria.play();

    // Mostrar mensaje motivador de victoria
    mostrarMensajeMotivador("¡Felicidades! ¡Has completado todas las preguntas! Tu conocimiento de la Biblia es asombroso");

    // Redirigir al menú principal después de unos segundos
    setTimeout(function() {
        window.location.href = 'menuPrincipal.html';
    }, 10000); // Redirige después de 10 segundos
}

function mostrarMensajeMotivador(mensaje) {
    let mensajeElement = document.getElementById('mensajeMotivador');
    mensajeElement.textContent = mensaje;
    mensajeElement.style.display = 'block';

    // Ocultar el mensaje después de unos segundos
    setTimeout(function() {
        mensajeElement.style.display = 'none';
    }, 6000); // Mostrar el mensaje durante 6 segundos (o más si es necesario)
}
