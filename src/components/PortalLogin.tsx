import { useState } from "react";
import LoginForm from "./LoginForm";

export default function PortalLogin() {
  const [token, setToken] = useState<string | null>(null);

  if (token) {
    return (
      <section className="flex justify-center my-12">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-6">¡Sesión iniciada con éxito!</h2>
          <p>Bienvenido de nuevo.</p>
        </div>
      </section>
    );
  }

  return <LoginForm setToken={setToken} />;
}
