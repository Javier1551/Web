document.addEventListener('DOMContentLoaded', function() {
    // Verificar si la página tiene los elementos específicos de Versículos del Día
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

    // Verificar si la página tiene los elementos de la sección de Noticias
    const noticiasContainer = document.getElementById('noticias');
    if (noticiasContainer) {
        fetch('noticias.json')
            .then(response => response.json())
            .then(data => {
                data.noticias.forEach(noticia => {
                    const noticiaDiv = document.createElement('div');
                    noticiaDiv.className = 'noticia';
    
                    const imagen = document.createElement('img');
                    imagen.src = noticia.imagen;
                    imagen.alt = noticia.titulo;
    
                    const titulo = document.createElement('h3');
                    titulo.textContent = noticia.titulo;
    
                    const descripcion = document.createElement('p');
                    descripcion.textContent = noticia.descripcion;
    
                    const enlace = document.createElement('a');
                    enlace.href = noticia.enlace;
                    enlace.textContent = 'Leer más';
    
                    noticiaDiv.appendChild(imagen);
                    noticiaDiv.appendChild(titulo);
                    noticiaDiv.appendChild(descripcion);
                    noticiaDiv.appendChild(enlace);
    
                    noticiasContainer.appendChild(noticiaDiv);
                });
            })
            .catch(error => console.error('Error al cargar las noticias:', error));
    }

    // Verificar si la página tiene los elementos de la sección de Ministerios
    const ministerioImgs = document.querySelectorAll('.ministerio-img');
    if (ministerioImgs.length > 0) {
        const modal = document.getElementById("modal");
        const modalImg = document.getElementById("modal-img");
        const span = document.getElementById("close");

        ministerioImgs.forEach(function(img) {
            img.onclick = function() {
                modal.style.display = "block";
                modalImg.src = this.src;
            }
        });

        span.onclick = function() { 
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Código para el modal (funciona en todas las páginas con imágenes en galerías)
    const galleryImages = document.querySelectorAll('.fotos img');
    if (galleryImages.length > 0) {
        const modal = document.getElementById("modal");
        const modalImg = document.getElementById("modal-img");
        const span = document.getElementById("close");

        galleryImages.forEach(function(img) {
            img.addEventListener('click', function() {
                modal.style.display = "block";
                modalImg.src = img.src;
            });
        });

        span.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});
