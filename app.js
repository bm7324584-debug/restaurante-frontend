// REEMPLAZA ESTO CON TU URL VERDADERA DE RENDER
const API_URL = "https://restaurante-backend-185g.onrender.com/platillos";

// Memoria local de la interfaz para cambios en tiempo real
let cachePlatillos = [];

// 1. OBTENER Y MOSTRAR (READ / GET)
async function renderizarDashboard() {
    try {
        const res = await fetch(API_URL);
        if(!res.ok) throw new Error("Error en respuesta de red");
        
        cachePlatillos = await res.json();
        const contenedor = document.getElementById("foodShowcase");
        contenedor.innerHTML = "";

        if(cachePlatillos.length === 0) {
            contenedor.innerHTML = `<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1; padding: 40px;">No hay platillos registrados en el menú todavía.</p>`;
            return;
        }

        cachePlatillos.forEach(item => {
            // Foto por defecto Premium si no se agrega una
            const URL_FOTO = item.imagen ? item.imagen : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600";
            
            contenedor.innerHTML += `
                <div class="premium-card">
                    <div class="img-wrapper">
                        <span class="tag-cat">${item.categoria}</span>
                        <img class="card-img" src="${URL_FOTO}" alt="${item.nombre}" onerror="this.src='https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600'">
                    </div>
                    <div class="card-body">
                        <div class="meta-row">
                            <h3 class="card-name">${item.nombre}</h3>
                            <span class="card-price">$${item.precio}</span>
                        </div>
                        <p class="card-info-text">${item.descripcion}</p>
                    </div>
                    <div class="action-tray">
                        <button class="btn-action-edit" onclick="activarModoEdicion('${item._id}')">Editar</button>
                        <button class="btn-action-delete" onclick="eliminarDelMenu('${item._id}')">Eliminar</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        console.error("Fallo al conectar con el Backend:", err);
    }
}

// 2. CREAR O ACTUALIZAR (POST / PUT)
document.getElementById("menuForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const targetId = document.getElementById("editTargetId").value;
    const cuerpoDatos = {
        nombre: document.getElementById("nombre").value,
        categoria: document.getElementById("categoria").value,
        precio: Number(document.getElementById("precio").value),
        imagen: document.getElementById("imagen").value,
        descripcion: document.getElementById("descripcion").value
    };

    try {
        let response;
        
        // Si hay un ID guardado, significa que se presionó "Editar" anteriormente
        if (targetId) {
            response = await fetch(`${API_URL}/${targetId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpoDatos)
            });
        } else {
            // Si no hay ID, se está agregando un platillo totalmente nuevo
            response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cuerpoDatos)
            });
        }

        if (response.ok) {
            alert(targetId ? "🚀 ¡Platillo modificado con éxito!" : "🚀 ¡Platillo publicado con éxito!");
            limpiarFormulario();
            renderizarDashboard();
        } else {
            alert("No se pudo completar la operación. Revisa los logs.");
        }
    } catch (err) {
        console.error("Error al procesar formulario:", err);
    }
});

// 3. ELIMINAR REGISTRO (DELETE)
async function eliminarDelMenu(id) {
    if (confirm("¿Estás seguro de que deseas retirar este platillo del catálogo en la nube?")) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.ok) {
                renderizarDashboard(); // Refresca los cambios de inmediato
            }
        } catch (err) {
            console.error("Fallo al eliminar:", err);
        }
    }
}

// 4. PASAR DATOS AL FORMULARIO PARA EDITAR
function activarModoEdicion(id) {
    const platilloEncontrado = cachePlatillos.find(p => p._id === id);
    if (!platilloEncontrado) return;

    // Poblar los inputs
    document.getElementById("editTargetId").value = platilloEncontrado._id;
    document.getElementById("nombre").value = platilloEncontrado.nombre;
    document.getElementById("categoria").value = platilloEncontrado.categoria;
    document.getElementById("precio").value = platilloEncontrado.precio;
    document.getElementById("imagen").value = platilloEncontrado.imagen;
    document.getElementById("descripcion").value = platilloEncontrado.descripcion;

    // Cambiar la estética visual del formulario para avisar que es una edición
    document.getElementById("panel-title").innerText = "✍️ Ajustando Receta";
    document.getElementById("submitBtnText").innerText = "Guardar Cambios Modernos";
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Animación de subida fluida
}

// Limpieza absoluta de estados
function limpiarFormulario() {
    document.getElementById("menuForm").reset();
    document.getElementById("editTargetId").value = "";
    document.getElementById("panel-title").innerText = "Agregar Platillo";
    document.getElementById("submitBtnText").innerText = "Publicar Registro";
}

// Carga Inicial del Dashboard
renderizarDashboard();