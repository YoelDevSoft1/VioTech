import { useEffect, useState } from "react";

interface Service {
  id: number;
  tipo: 'licencia' | 'landing-page';
  nombre: string;
  fecha_compra: string;
  fecha_expiracion: string;
  estado: 'activo' | 'expirado';
  progreso?: number;
}

export default function ServiceDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Datos de ejemplo - Reemplazar con llamada a API real
  const mockServices: Service[] = [
    {
      id: 1,
      tipo: 'licencia',
      nombre: 'Licencia Premium',
      fecha_compra: '2025-03-15',
      fecha_expiracion: '2026-03-15',
      estado: 'activo',
      progreso: 25
    },
    {
      id: 2,
      tipo: 'landing-page',
      nombre: 'Landing Page Corporativa',
      fecha_compra: '2025-05-01',
      fecha_expiracion: '2025-11-01', 
      estado: 'activo',
      progreso: 60
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Simular llamada a API
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const renderServiceCard = (service: Service) => (
    <div key={service.id} className="card p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-6 shadow-lg rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {service.nombre}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {service.tipo === 'licencia' ? 'Licencia de software' : 'Servicio de landing page'}
          </p>
        </div>
        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
          service.estado === 'activo' 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {service.estado === 'activo' ? 'Activo' : 'Expirado'}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Fecha de compra:</span>
          <span className="text-gray-900 dark:text-white">{service.fecha_compra}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Expiración:</span>
          <span className="text-gray-900 dark:text-white">{service.fecha_expiracion}</span>
        </div>
      </div>

      {service.progreso && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-400">Tiempo restante:</span>
            <span className="text-gray-900 dark:text-white">{service.progreso}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-primary-500 h-2 rounded-full" 
              style={{ width: `${service.progreso}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="section min-h-screen bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Mis Servicios Contratados
          </h2>

          {loading && (
            <div className="card p-6 text-center text-gray-600 dark:text-gray-300">
              Cargando servicios...
            </div>
          )}

          {error && (
            <div className="card p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300">
              {error}
            </div>
          )}

          {!loading && services.length === 0 && (
            <div className="card p-6 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Aún no has contratado ningún servicio
              </p>
              <a 
                href="/servicios" 
                className="btn-primary inline-block"
              >
                Ver servicios disponibles
              </a>
            </div>
          )}

          {!loading && services.length > 0 && (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Licencias
                </h3>
                {services.filter(s => s.tipo === 'licencia').map(renderServiceCard)}
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Servicios Web
                </h3>
                {services.filter(s => s.tipo === 'landing-page').map(renderServiceCard)}
              </div>
            </>
          )}

          <div className="mt-8 text-center">
            <button
              className="btn-primary"
              onClick={() => {
                localStorage.removeItem("authToken");
                window.location.href = "/login";
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
