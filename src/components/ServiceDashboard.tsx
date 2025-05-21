// src/components/ServiceDashboard.tsx
import { useEffect, useState } from "react";
import { LOCAL_STORAGE_TOKEN_KEY, LOCAL_STORAGE_USERNAME_KEY } from '../constants'; // Ajusta la ruta

interface Service {
  id: string | number;
  tipo: 'licencia' | 'landing-page';
  nombre: string;
  fecha_compra: string;
  fecha_expiracion: string;
  estado: 'activo' | 'expirado' | 'pendiente';
  progreso?: number;
}

// Datos de ejemplo (reemplazar con llamada a API real)
const mockServicesData: Service[] = [
  { id: "svc1", tipo: 'licencia', nombre: 'Licencia VioTech Pro', fecha_compra: '2025-01-10', fecha_expiracion: '2026-01-10', estado: 'activo', progreso: 80 },
  { id: "svc2", tipo: 'landing-page', nombre: 'Landing Page "Innovación Digital"', fecha_compra: '2025-04-20', fecha_expiracion: '2025-10-20', estado: 'activo', progreso: 30 },
  { id: "svc3", tipo: 'licencia', nombre: 'Licencia VioTech Basic (Expirada)', fecha_compra: '2024-05-01', fecha_expiracion: '2025-05-01', estado: 'expirado', progreso: 100 },
];

type ErrorState = string | null;

// Componente para la tarjeta de servicio
const ServiceCard = ({ service }: { service: Service }) => (
    <div key={service.id.toString()} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="mb-2 sm:mb-0">
          <h4 className="text-xl font-bold text-primary-700 dark:text-primary-400">
            {service.nombre}
          </h4>
          <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">
            {service.tipo === 'licencia' ? 'Licencia de Software' : 'Desarrollo Landing Page'}
          </p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
          service.estado === 'activo' 
            ? 'bg-green-100 text-green-800 dark:bg-green-700/30 dark:text-green-300 ring-1 ring-inset ring-green-600/20'
            : service.estado === 'expirado'
            ? 'bg-red-100 text-red-800 dark:bg-red-700/20 dark:text-red-300 ring-1 ring-inset ring-red-600/10'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600/20 dark:text-yellow-300 ring-1 ring-inset ring-yellow-600/20'
        }`}>
          {service.estado.charAt(0).toUpperCase() + service.estado.slice(1)}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Fecha de Compra:</p>
          <p className="font-medium text-gray-700 dark:text-gray-200">{new Date(service.fecha_compra).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Válido Hasta:</p>
          <p className="font-medium text-gray-700 dark:text-gray-200">{new Date(service.fecha_expiracion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      {typeof service.progreso === 'number' && (
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-500 dark:text-gray-400">Progreso / Tiempo Restante:</span>
            <span className="font-semibold text-primary-600 dark:text-primary-400">{service.progreso}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ease-out ${service.progreso < 30 ? 'bg-red-500' : service.progreso < 70 ? 'bg-yellow-400' : 'bg-green-500'}`}
              style={{ width: `${service.progreso}%` }}
            />
          </div>
        </div>
      )}
      {/* Podrías añadir un botón de "Gestionar" o "Ver Detalles" aquí */}
      {/* <div className="mt-5 text-right">
        <a href={`/dashboard/services/${service.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
          Gestionar servicio &rarr;
        </a>
      </div> */}
    </div>
  );

export default function ServiceDashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Estado para la carga inicial del usuario

  useEffect(() => {
    console.log("SERVICE_DASHBOARD: useEffect Montado.");
    setIsLoadingUser(true); // Inicia carga de estado de usuario
    
    const tokenFromStorage = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
    const userNameFromStorage = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);

    console.log(`SERVICE_DASHBOARD: Intentando leer token con clave '${LOCAL_STORAGE_TOKEN_KEY}'.`);
    console.log("SERVICE_DASHBOARD: Valor de token recuperado:", tokenFromStorage ? `Sí (Token: ${tokenFromStorage.substring(0,15)}...)` : "No (null o undefined)");

    if (!tokenFromStorage) {
      console.warn("SERVICE_DASHBOARD: TOKEN NO ENCONTRADO. Redirigiendo a /login.");
      window.location.href = "/login?from=/dashboard&reason=no_token";
      // No necesitas setIsLoadingUser(false) aquí porque la redirección ocurre
      return; 
    }

    // Si hay token, asumimos autenticado inicialmente
    setUserName(userNameFromStorage);
    setIsLoadingUser(false); // Termina carga de estado de usuario
    
    // Ahora carga los servicios
    fetchUserServices(tokenFromStorage); 

  }, []); // Se ejecuta solo al montar

  const fetchUserServices = async (token: string) => {
    setLoading(true); // Para la carga de servicios
    setError(null);
    try {
      // TODO: Implementar llamada real a la API
      // const apiUrl = `${import.meta.env.PUBLIC_BACKEND_API_URL || 'http://localhost:4000'}/api/user/my-services`;
      // const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` }});
      // if (!response.ok) throw new Error((await response.json()).error || "Error al cargar servicios.");
      // const userServicesData: Service[] = await response.json();
      // setServices(userServicesData);

      // Usando mock data por ahora
      await new Promise(resolve => setTimeout(resolve, 750)); // Simular delay
      setServices(mockServicesData);
      console.log("SERVICE_DASHBOARD: Mock services cargados.");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido cargando servicios.";
      setError(errorMessage);
      console.error("Error en fetchUserServices:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingUser) {
    // Muestra un loader mientras se verifica el estado del usuario, para evitar flash de contenido
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> {/* Ajusta min-h según tu layout */}
        <p className="text-xl text-gray-600 dark:text-gray-400">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <section className="section bg-gray-50 dark:bg-gray-900/95 text-gray-800 dark:text-gray-200 flex-grow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="max-w-5xl mx-auto"> {/* Contenedor más ancho */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-300 dark:border-gray-700">
            <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Mi Panel de Control
                </h1>
                {userName && (
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                    Bienvenido, {userName}. Administra tus servicios VioTech.
                </p>
                )}
            </div>
            <button
              className="mt-6 sm:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-colors text-sm shadow-md hover:shadow-lg"
              onClick={() => {
                console.log("SERVICE_DASHBOARD: Botón Cerrar sesión clickeado.");
                localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
                localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
                window.dispatchEvent(new CustomEvent("authChanged", { detail: { isAuthenticated: false } }));
                console.log("SERVICE_DASHBOARD: Token/userName eliminados. Evento authChanged disparado. Redirigiendo a /login.");
                window.location.href = "/login";
              }}
            >
              Cerrar sesión
            </button>
          </div>

          {loading && ( <div className="text-center py-12"> <p className="text-xl text-gray-500 dark:text-gray-400">Cargando tus servicios...</p> </div> )}
          {error && ( <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-lg dark:bg-red-900/40 dark:text-red-300 dark:border-red-600" role="alert"> <p className="font-bold text-lg mb-1">¡Ups! Ocurrió un error:</p> <p>{error}</p> </div> )}
          
          {!loading && !error && services.length === 0 && ( 
            <div className="text-center py-12 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-xl"> 
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-primary-400 dark:text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.755 4 3.92C16 13.093 14.233 15 12 15c-1.428 0-2.729-.91-3.382-2.205M12 12H4M12 12L4.472 10M12 12L4.472 14M20 12L12 12" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.755 4 3.92C16 13.093 14.233 15 12 15c-1.428 0-2.729-.91-3.382-2.205M12 12H4M12 12L4.472 10M12 12L4.472 14M20 12L12 12" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-6 mb-3"> Aún no tienes servicios activos. </h3> 
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">Una vez que adquieras un plan, aparecerá aquí para que puedas gestionarlo fácilmente.</p>
              <a href="/precios" className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-md hover:shadow-lg text-base"> 
                Explorar Planes
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a> 
            </div> 
          )}

          {!loading && !error && services.length > 0 && (
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-700">
                  <span className="inline-block border-b-4 border-primary-500 pb-1">Licencias</span>
                </h3>
                {services.filter(s => s.tipo === 'licencia').length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.filter(s => s.tipo === 'licencia').map(service => <ServiceCard key={service.id.toString() + '-lic'} service={service} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic py-4">No tienes licencias de software activas.</p>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 pb-3 border-b-2 border-gray-300 dark:border-gray-700">
                  <span className="inline-block border-b-4 border-primary-500 pb-1">Páginas Web</span>
                </h3>
                {services.filter(s => s.tipo === 'landing-page').length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.filter(s => s.tipo === 'landing-page').map(service => <ServiceCard key={service.id.toString() + '-lp'} service={service} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic py-4">No tienes servicios web (landing pages) contratados.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
