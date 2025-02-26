document.addEventListener("DOMContentLoaded", function () {
    // Inicializar los mapas
    const map1 = L.map('map1').setView([4.6097, -74.0817], 13); // Bogotá
    const map2 = L.map('map2').setView([4.6097, -74.0817], 13);

    // Sincronizar la vista de los mapas
    map1.sync(map2);
    map2.sync(map1);

    // Agregar OpenStreetMap a map1
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map1);

    // Agregar un mapa base diferente a map2
    L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenTopoMap contributors'
    }).addTo(map2);

    // Activar Geoman en ambos mapas
    map1.pm.addControls();
    map2.pm.addControls();

    // Función para copiar geometrías entre mapas
    function copiarGeometria(e, destino) {
        const layer = e.layer;
        let geojson = layer.toGeoJSON();
        L.geoJSON(geojson).addTo(destino);
    }

    // Escuchar eventos de dibujo en map1 y replicarlos en map2
    map1.on('pm:create', function (e) {
        copiarGeometria(e, map2);
    });

    // Escuchar eventos de dibujo en map2 y replicarlos en map1
    map2.on('pm:create', function (e) {
        copiarGeometria(e, map1);
    });

    // Implementar la barra deslizante
    const slider = document.getElementById('slider');
    const mapContainer1 = document.getElementById('map1');

    let isDragging = false;

    slider.addEventListener('mousedown', function () {
        isDragging = true;
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        let percentage = (e.clientX / window.innerWidth) * 100;
        if (percentage < 10) percentage = 10;
        if (percentage > 90) percentage = 90;
        mapContainer1.style.width = percentage + '%';
        slider.style.left = percentage + '%';
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
});

