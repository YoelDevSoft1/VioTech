import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Define el tipo de servicio (ajústalo a tu backend si necesitas más campos)
interface Service {
  _id: string;
  nombre: string;
  tipo: 'licencia' | 'landing-page';
  estado: 'activo' | 'expirado';
  fecha_compra: string;
  fecha_expiracion: string;
  precio?: number;
  detalles?: string;
}

export default function Dashboard() {
  const [servicios, setServicios] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getServicios = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/services`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setServicios(response.data.servicios || response.data); // Ajusta según tu backend
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar servicios');
      } finally {
        setLoading(false);
      }
    };
    getServicios();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <section className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Mis servicios contratados
          </h1>
          <button onClick={handleLogout} className="btn-primary">
            Cerrar sesión
          </button>
        </div>

        {loading && (
          <div className="text-center p-8 text-gray-600">Cargando servicios...</div>
        )}
        {error && (
          <div className="text-center p-8 text-red-600">{error}</div>
        )}

        {!loading && !error && servicios.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600 mb-4">
              No tienes servicios contratados aún.
            </p>
            <a href="/features" className="btn-primary inline-block">
              Ver servicios disponibles
            </a>
          </div>
        )}

        <div className="space-y-8">
          {!loading && !error && servicios.map((servicio) => (
            <div
              key={servicio._id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4"
              style={{
                borderColor: servicio.estado === 'activo'
                  ? '#34d399' // verde
                  : '#f87171' // rojo
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{servicio.nombre}</h2>
                  <p className="text-gray-600 capitalize">
                    {servicio.tipo === 'licencia' ? 'Licencia de software' : 'Landing page'}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    servicio.estado === 'activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {servicio.estado.charAt(0).toUpperCase() + servicio.estado.slice(1)}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:space-x-8 text-sm text-gray-700 space-y-2 md:space-y-0">
                <span>
                  <strong>Compra:</strong>{' '}
                  {new Date(servicio.fecha_compra).toLocaleDateString('es-CO')}
                </span>
                <span>
                  <strong>Expira:</strong>{' '}
                  {new Date(servicio.fecha_expiracion).toLocaleDateString('es-CO')}
                </span>
                {(servicio.precio !== undefined) && (
                  <span>
                    <strong>Precio:</strong> ${servicio.precio.toLocaleString('es-CO')}
                  </span>
                )}
              </div>

              {servicio.detalles && (
                <div className="mt-3 text-gray-600 text-sm">
                  <strong>Detalles:</strong> {servicio.detalles}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
