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
    console.log('Iniciando envío de prueba...');

    // 1. PREPARAR los datos de prueba. Más adelante aquí irá el archivo de factura y el email real.
    const payloadDePrueba = {
        email: 'usuario_prueba@ejemplo.com', // Reemplazar luego por 'userEmail' (del login)
        tipo: 'compra', // 'compra' o 'venta'
        test: true,
        mensaje: 'Esta es una prueba de conexión POST.',
        timestamp: new Date().toISOString()
    };

    // 2. ENVIAR la solicitud POST. ¡NO USES 'mode: no-cors'!
    try {
        console.log('Enviando a:', APPS_SCRIPT_WEB_APP_URL); // Asegúrate de que esta variable tenga tu URL
        console.log('Payload:', payloadDePrueba);

        const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
            method: 'POST', // Método correcto
            headers: {
                'Content-Type': 'application/json' // Cabecera imprescindible para JSON
            },
            body: JSON.stringify(payloadDePrueba) // Convertir objeto a cadena JSON
        });

        // 3. PROCESAR la respuesta del servidor (Apps Script)
        console.log('Respuesta recibida. Status:', response.status);
        const data = await response.json(); // Intentar parsear la respuesta como JSON
        console.log('✅ Respuesta del backend:', data);

        // Mostrar éxito en la página
        resultDiv.innerHTML = `
            <p style="color:green; font-weight:bold;">✅ ¡Conexión POST exitosa!</p>
            <p>El backend respondió: <strong>${data.message || 'Sin mensaje'}</strong></p>
            <p>Revisa la consola (F12) para más detalles.</p>
        `;

    } catch (error) {
        // 4. MANEJAR errores de red o de análisis de la respuesta
        console.error('❌ Error crítico en la conexión:', error);
        resultDiv.innerHTML = `
            <p style="color:red; font-weight:bold;">❌ Error en la comunicación</p>
            <p><strong>Tipo:</strong> ${error.name}</p>
            <p><strong>Mensaje:</strong> ${error.message}</p>
            <p>Asegúrate de que la URL de tu Apps Script es correcta y de que la función 'doPost' está bien definida.</p>
        `;
    }
}
