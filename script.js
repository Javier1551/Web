document.addEventListener('DOMContentLoaded', function() {
    const versionSelect = document.getElementById('version-biblia');
    const textoVersiculo = document.getElementById('texto-versiculo');
    const referenciaVersiculo = document.getElementById('referencia-versiculo');

    if (!versionSelect || !textoVersiculo || !referenciaVersiculo) {
        console.error('No se encontraron los elementos necesarios en el DOM.');
        return;
    }

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

    // Modal de imágenes
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.getElementById('close');

    if (modal && modalImg && closeModal) {
        document.querySelectorAll('#galeria .fotos img').forEach(img => {
            img.addEventListener('click', (event) => {
                modal.style.display = 'block';
                modalImg.src = event.target.src;
            });
        });

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    } else {
        console.error('No se encontraron los elementos del modal en el DOM.');
    }
});
