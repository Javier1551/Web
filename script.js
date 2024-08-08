document.addEventListener('DOMContentLoaded', function() {
    // Verificar si la página tiene los elementos específicos
    const versionSelect = document.getElementById('version-biblia');
    const textoVersiculo = document.getElementById('texto-versiculo');
    const referenciaVersiculo = document.getElementById('referencia-versiculo');

    if (versionSelect && textoVersiculo && referenciaVersiculo) {
        // Ejecutar solo si los elementos existen
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

        // Cargar versículos y mostrar el inicial
        cargarVersiculos();
    } else {
        console.error('No se encontraron los elementos necesarios en el DOM.');
    }

    // Código para el modal (funciona en todas las páginas)
    var modal = document.getElementById("modal");
    var modalImg = document.getElementById("modal-img");
    var span = document.getElementById("close");

    // Función para abrir el modal al hacer clic en una imagen
    function openModal(element) {
        modal.style.display = "block";
        modalImg.src = element.src;
    }

    // Función para cerrar el modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Cerrar el modal al hacer clic fuera de la imagen
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Agregar evento click a cada imagen de la galería
    const galleryImages = document.querySelectorAll('.fotos img');
    galleryImages.forEach(function(img) {
        img.addEventListener('click', function() {
            openModal(img);
        });
    });
});
