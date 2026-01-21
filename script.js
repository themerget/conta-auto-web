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

    // 1. SIMULAMOS los datos que luego vendrán del login y el archivo
    const payloadDePrueba = {
        email: 'usuario_prueba@ejemplo.com', // Esto luego será `userEmail`
        tipo: 'compra',
        test: true,
        mensaje: 'Primera conexión exitosa con ContaAuto.'
    };

    try {
        // 2. ENVIAMOS los datos a tu Apps Script (POST)
        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, { // Asegúrate de que esta variable tiene tu URL
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadDePrueba)
        });

        // 3. PROCESAMOS la respuesta
        const data = await response.json();
        console.log('✅ Respuesta del servidor:', data);
        resultDiv.innerHTML = `<p style="color:green;"><strong>✅ ¡Conexión exitosa!</strong></p>
                               <p>El backend recibió: ${data.message || 'Sin mensaje'}</p>`;

    } catch (error) {
        console.error('❌ Error en la conexión:', error);
        resultDiv.innerHTML = `<p style="color:red;"><strong>❌ Error de conexión</strong></p>
                               <p>Detalle: ${error.message}</p>`;
    }
}
