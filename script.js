// Configuración CRÍTICA: Reemplaza con tus URLs
const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby3lUiGZdXebPWqaIhLZ0MUvBlqRJveKfPBBYJu_cpeCDal6dSse8Xb3QjnPVInwokp0A/exec'; // URL de tu App Web
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
    const fileInput = document.getElementById('fileInput');
    const invoiceType = document.getElementById('invoiceType').value;
    const resultDiv = document.getElementById('result');

    if (!fileInput.files[0]) {
        resultDiv.innerHTML = '<p style="color: red;">⚠️ Por favor, selecciona un archivo.</p>';
        return;
    }

    resultDiv.innerHTML = '<p>⏳ Analizando factura con IA...</p>';

    // 1. Leer el archivo como Base64
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function() {
        const base64Data = reader.result.split(',')[1]; // Removemos el prefijo

        // 2. Preparar los datos para enviar a Apps Script
        const payload = {
            email: userEmail,
            tipo: invoiceType,
            archivo: {
                nombre: file.name,
                tipo: file.type,
                datosBase64: base64Data
            }
        };

        try {
            // 3. Enviar a tu App Web de Apps Script
            const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // Importante para Apps Script
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Nota: Con 'no-cors' no podemos leer la respuesta directamente.
            // Asumimos que fue exitoso si no hay error de red.
            resultDiv.innerHTML = `
                <p style="color: green;">✅ Factura enviada para procesamiento.</p>
                <p>Tu Google Sheets se está actualizando... Esto puede tardar unos segundos.</p>
            `;
            
            // Opcional: Mostrar enlace a Sheets (necesitarías que tu script devuelva la URL)
            // document.getElementById('sheetLink').style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            resultDiv.innerHTML = `<p style="color: red;">❌ Error al procesar: ${error.message}</p>`;
        }
    };
}
