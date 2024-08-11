document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad del Versículo del Día
    const versionSelect = document.getElementById('version-biblia');
    const textoVersiculo = document.getElementById('texto-versiculo');
    const referenciaVersiculo = document.getElementById('referencia-versiculo');

    if (versionSelect && textoVersiculo && referenciaVersiculo) {
        let versiculos = [];

        async function cargarVersiculos() {
            try {
                const response = await fetch('versiculos.json');
                const data = await response.json();
                versiculos = data.versiculos;
                mostrarVersiculoDelDia();
            } catch (error) {
                console.error('Error al cargar los versículos:', error);
            }
        }

        function obtenerVersiculoAleatorio(version) {
            const versiculosFiltrados = versiculos.filter(v => v.version === version);
            if (versiculosFiltrados.length === 0) {
                return null;
            }
            return versiculosFiltrados[Math.floor(Math.random() * versiculosFiltrados.length)];
        }

        function mostrarVersiculo(versiculo) {
            if (versiculo) {
                textoVersiculo.textContent = versiculo.texto;
                referenciaVersiculo.textContent = `${versiculo.referencia} (${versiculo.version})`;
            } else {
                textoVersiculo.textContent = 'No se encontraron versículos para esta versión.';
                referenciaVersiculo.textContent = '';
            }
        }

        function mostrarVersiculoDelDia() {
            const version = versionSelect.value;
            const hoy = new Date().toISOString().split('T')[0];
            let versiculoGuardado = JSON.parse(localStorage.getItem('versiculoDelDia'));

            if (versiculoGuardado && versiculoGuardado.fecha === hoy) {
                mostrarVersiculo(versiculoGuardado.versiculo);
            } else {
                const nuevoVersiculo = obtenerVersiculoAleatorio(version);
                mostrarVersiculo(nuevoVersiculo);
                localStorage.setItem('versiculoDelDia', JSON.stringify({
                    fecha: hoy,
                    versiculo: nuevoVersiculo
                }));
            }
        }

        function actualizarVersiculoAlCambiarVersion() {
            const version = versionSelect.value;
            let versiculoGuardado = JSON.parse(localStorage.getItem('versiculoDelDia'));

            if (versiculoGuardado && versiculoGuardado.versiculo) {
                const referencia = versiculoGuardado.versiculo.referencia;
                const versiculoEnNuevaVersion = versiculos.find(v => v.referencia === referencia && v.version === version);
                if (versiculoEnNuevaVersion) {
                    mostrarVersiculo(versiculoEnNuevaVersion);
                } else {
                    mostrarVersiculoDelDia();
                }
            } else {
                mostrarVersiculoDelDia();
            }
        }

        versionSelect.addEventListener('change', actualizarVersiculoAlCambiarVersion);
        cargarVersiculos();
    }

    // Funcionalidad del Modal para Imágenes
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modal-img");
    var span = document.getElementById("close");

    function openModal(element) {
        modal.style.display = "block";
        modalImg.src = element.src;
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Agregar evento click a todas las imágenes de la galería
    const galleryImages = document.querySelectorAll('img');  // Cambiado a seleccionar todas las imágenes
    galleryImages.forEach(function(img) {
        img.addEventListener('click', function() {
            openModal(img);
        });
    });
});
