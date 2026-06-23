// REEMPLAZA ESTA URL POR TU URL REAL DE RENDER (Mantén el /platillos al final)
const API_URL = "https://restaurante-backend-185g.onrender.com/platillos";

// Función para renderizar la galería visual premium desde MongoDB Atlas
async function cargarGaleriaPremium() {
    try {
        const res = await fetch(API_URL);
        const platillos = await res.json();
        const galeria = document.getElementById("galeriaPlatillos");
        
        galeria.innerHTML = ""; // Limpiar galería

        if(platillos.length === 0) {
            galeria.innerHTML = `<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1;">No hay platillos en el menú. ¡Agrega el primero!</p>`;
            return;
        }

        platillos.forEach(platillo => {
            // Si el usuario no puso imagen, le asignamos una bonita por defecto de comida
            const foto = platillo.imagen ? platillo.imagen : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500";
            
            galeria.innerHTML += `
                <div class="food-card">
                    <div class="food-img-container">
                        <span class="badge-category">${platillo.categoria}</span>
                        <img class="food-img" src="${foto}" alt="${platillo.nombre}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'">
                    </div>
                    <div class="food-info">
                        <div class="food-title-row">
                            <h3 class="food-title">${platillo.nombre}</h3>
                            <span class="food-price">$${platillo.precio}</span>
                        </div>
                        <p class="food-desc">${platillo.descripcion}</p>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error al cargar la galería:", err);
    }
}

// Escuchador del formulario para mandar los nuevos campos premium a la base de datos
document.getElementById("formPlatillo").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoPlatillo = {
        nombre: document.getElementById("nombre").value,
        categoria: document.getElementById("categoria").value,
        precio: Number(document.getElementById("precio").value),
        imagen: document.getElementById("imagen").value,
        descripcion: document.getElementById("descripcion").value
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoPlatillo)
        });

        if(res.ok) {
            alert("✨ ¡Platillo premium guardado en la nube con éxito!");
            document.getElementById("formPlatillo").reset();
            cargarGaleriaPremium(); // Actualiza la galería al instante
        } else {
            alert("Hubo un problema al guardar el platillo.");
        }
    } catch (err) {
        console.error("Error al enviar el platillo:", err);
    }
});

// Arrancar la app cargando la galería premium
cargarGaleriaPremium();