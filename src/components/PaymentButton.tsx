// frontend/src/components/PaymentButton.tsx
import React, { useState } from 'react';
import axios from 'axios'; // Importa axios
import type { AxiosError } from 'axios'; // Importa el TIPO AxiosError así

// Define la interfaz para las props del botón
interface PaymentButtonProps {
  serviceId: string;
  amount: number; // El monto en la moneda base (ej. pesos)
  email: string;  // Email del cliente para Wompi
  onPaymentSuccess?: (data: { checkout_url: string; transaction_id: string }) => void; // Callback opcional al iniciar
  onPaymentError?: (errorMessage: string) => void; // Callback opcional en error
  buttonText?: string;
  className?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  serviceId,
  amount,
  email,
  onPaymentSuccess,
  onPaymentError,
  buttonText = `Pagar $${amount.toLocaleString('es-CO')}`, // Texto por defecto del botón
  className = "w-full px-6 py-3 text-base font-medium text-white rounded-md shadow-sm transition-colors duration-150 ease-in-out" // Clases por defecto
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    // Validación básica en el frontend
    if (!serviceId || !email || typeof amount !== 'number' || amount <= 0) {
      const msg = "Datos para el pago incompletos o inválidos. Verifique el servicio, email y monto.";
      setError(msg);
      onPaymentError?.(msg); // Llama al callback de error si existe
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token'); // O como obtengas tu token JWT
      if (!token) {
        const msg = "Usuario no autenticado. Por favor, inicie sesión para continuar.";
        setError(msg);
        onPaymentError?.(msg);
        // Aquí podrías, por ejemplo, redirigir al login:
        // import { useNavigate } from 'react-router-dom';
        // const navigate = useNavigate();
        // navigate('/login');
        setLoading(false);
        return;
      }

      // Accede a import.meta.env (esto requiere el archivo vite-env.d.ts configurado)
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4321'}/api/payments/create-transaction`;
      
      // Define la estructura esperada de la respuesta del backend
      interface BackendResponse {
        checkout_url: string;
        transaction_id: string;
        // Agrega otros campos si tu backend los devuelve
      }

      const response = await axios.post<BackendResponse>(
        apiUrl,
        {
          amount: amount, // El backend espera el monto en la moneda base (ej. 100000 para 100.000 COP)
          email: email,
          serviceId: serviceId,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && response.data.checkout_url) {
        onPaymentSuccess?.(response.data); // Llama al callback con los datos si existe
        // Redirigir al checkout de Wompi
        window.location.href = response.data.checkout_url;
      } else {
        // Esto no debería pasar si el backend siempre devuelve checkout_url en éxito
        throw new Error('Respuesta de pago inválida del servidor. No se recibió URL de checkout.');
      }
    } catch (err) {
      // Aquí usamos el tipo AxiosError importado
      const axiosError = err as AxiosError<{ error?: string }>; // Tipamos el error para acceder a .response.data.error
      const errorMessage = axiosError.response?.data?.error || axiosError.message || 'Error desconocido al iniciar el pago. Intente más tarde.';
      setError(errorMessage);
      onPaymentError?.(errorMessage); // Llama al callback de error si existe
      console.error('Error al crear transacción de pago:', axiosError.response?.data || axiosError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch w-full">
      <button
        type="button" // Es buena práctica especificar el tipo para botones
        onClick={handlePayment}
        disabled={loading || amount <= 0} // Deshabilitar también si el monto es inválido
        className={`${className} ${loading || amount <= 0 ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800'}`}
        title={amount <= 0 ? "El monto debe ser mayor a cero" : buttonText}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </div>
        ) : (
          buttonText
        )}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400 text-center" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default PaymentButton;
