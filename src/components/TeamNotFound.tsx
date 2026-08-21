import React from 'react';
import { Link } from 'react-router-dom';

interface TeamNotFoundProps {
  backTo?: string;
}

export const TeamNotFound: React.FC<TeamNotFoundProps> = ({ backTo = "/admin/equipas" }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="text-center">
        <p className="mb-4 text-sm text-slate-500">Equipa não encontrada.</p>
        <Link to={backTo} className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Voltar à lista de equipas
        </Link>
      </div>
    </div>
  );
};