const API_URL = "https://restaurante-backend-xyz.onrender.com/platillos";

// Función para traer los platillos desde MongoDB Atlas mediante el Backend
async function obtenerMenú() {
    try {
        const res = await fetch(API_URL);
        const datos = await res.json();
        const tabla = document.getElementById("tablaPlatillos");
        tabla.innerHTML = ""; // Limpiar tabla antes de pintar

        datos.forEach(platillo => {
            tabla.innerHTML += `
                <tr>
                    <td><strong>${platillo.nombre}</strong></td>
                    <td><span style="color: #777;">${platillo.categoria}</span></td>
                    <td>$${platillo.precio}.00</td>
                </tr>`;
        });
    } catch (err) {
        console.error("Error al obtener el menú:", err);
    }
}

// Función para enviar un nuevo platillo a la base de datos
document.getElementById("formPlatillo").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoPlatillo = {
        nombre: document.getElementById("nombre").value,
        precio: Number(document.getElementById("precio").value),
        categoria: document.getElementById("categoria").value
    };

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoPlatillo)
        });

        if(res.ok) {
            alert("✨ ¡Platillo registrado con éxito en MongoDB Atlas!");
            document.getElementById("formPlatillo").reset();
            obtenerMenú(); // Actualiza la tabla dinámicamente sin recargar la página
        }
    } catch (err) {
        console.error("Error al guardar platillo:", err);
    }
});

// Cargar los datos inmediatamente al entrar al sitio web
obtenerMenú();