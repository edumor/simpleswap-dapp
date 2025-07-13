## Capturas de pantalla y pruebas funcionales

A continuación se muestran capturas de pantalla y descripciones de las pruebas realizadas sobre el despliegue en Vercel:

### 1. Carga de la página principal
- La página principal carga correctamente y muestra el título "SimpleSwap DApp".
- El botón "Conectar Billetera" aparece en la parte superior.
- Estado inicial: Desconectado.

![Página principal](https://simpleswap-dapp.vercel.app/screenshot-main.png)

### 2. Formulario de intercambio (Swap)
- Se visualiza el formulario para enviar Token A y recibir Token B.
- Mensaje: "Conecte la billetera para ver el precio" si no hay wallet conectada.
- Se muestran campos para seleccionar montos y mensajes de estado de la transacción.

![Formulario de swap](https://simpleswap-dapp.vercel.app/screenshot-swap.png)

### 3. Consulta de precios y pool
- Al conectar la wallet, se muestra el precio actual y la información del pool de liquidez.
- Los datos se actualizan en tiempo real.

![Precio y pool](https://simpleswap-dapp.vercel.app/screenshot-pool.png)

### 4. Aprobación de tokens
- El usuario puede aprobar el uso de TokenA o TokenB antes de intercambiar.
- El formulario de aprobación funciona y muestra mensajes de éxito/error.

![Aprobación de tokens](https://simpleswap-dapp.vercel.app/screenshot-approve.png)

### 5. Mensajes de éxito y error
- El sistema muestra mensajes claros tras cada acción (aprobación, swap, error de conexión, etc).

---

Estas pruebas confirman que la dApp funciona correctamente en producción y que la experiencia de usuario es fluida y clara.

> Nota: Las capturas de pantalla pueden variar según el estado de la wallet y la red seleccionada.
