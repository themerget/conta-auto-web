// Configuración CRÍTICA: Reemplaza con tus URLs
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbzBp0XkblENy8GdaL1ebz46WNtNbz_xRz3c9ybO6PJ-ghVpV5To1Fn7yCU46Ppnc8GIAw/exec'; // URL de tu App Web
const APPS_SCRIPT_API_ENDPOINT = 'https://script.googleapis.com/v1/scripts/...:run'; // Solo si usas API Executable

let userEmail = null; // Aquí guardaremos el email del usuario logueado

// Esta función se llama automáticamente tras un login exitoso con Google
function handleGoogleSignIn(response) {
    console.log("Login exitoso", response);
    // Decodificamos el token JWT para obtener el email
    const userData = JSON.parse(atob(response.credential.split('.')[1]));
    userEmail = userData.email;
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('result').innerHTML = `<p>Conectado como: <strong>${userEmail}</strong></p>`;
}

// Función para procesar la factura seleccionada
async function processInvoice() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>🔄 Enviando datos de prueba a la API...</p>';

    // Este es un payload de ejemplo, similar al que enviarás luego
    const payloadDePrueba = {
        email: 'usuario_prueba@ejemplo.com',
        tipo: 'compra',
        mensaje: 'Esto es una prueba de conexión.'
    };

    try {
        // APPS_SCRIPT_WEB_APP_URL es la variable que ya tienes con tu URL
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadDePrueba)
        });

        const data = await response.json(); // Tu doPost debe devolver JSON
        resultDiv.innerHTML = `<p style="color:green;">✅ Prueba exitosa.</p><p>Respuesta: ${data.message}</p>`;
        console.log('Respuesta detallada:', data);

    } catch (error) {
        resultDiv.innerHTML = `<p style="color:red;">❌ Error en la prueba: ${error.message}</p>`;
        console.error('Error detallado:', error);
    }
}
