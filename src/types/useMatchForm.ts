import { useState } from "react";
import { useNavigate } from "react-router-dom";

export interface MatchFormData {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: string;
  awayScore: string;
  matchDate: string;
  location: string;
  division: string;
  error: string;
}

export function useMatchForm() {
  const navigate = useNavigate();

  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [location, setLocation] = useState("");
  const [division, setDivision] = useState("1ª Divisão");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!homeTeamId || !awayTeamId) {
      setError("Selecione as duas equipas.");
      return;
    }

    if (homeTeamId === awayTeamId) {
      setError("As equipas da casa e visitante não podem ser iguais.");
      return;
    }

    const newMatch = {
      homeTeamId,
      awayTeamId,
      homeScore: Number(homeScore) || 0,
      awayScore: Number(awayScore) || 0,
      matchDate,
      location,
      division,
    };

    // TODO: substituir por chamada real ao Supabase (insert na tabela de partidas)
    console.log("Nova partida:", newMatch);

    navigate("/admin/dashboard");
  };

  return {
    homeTeamId,
    awayTeamId,
    homeScore,
    awayScore,
    matchDate,
    location,
    division,
    error,
    setHomeTeamId,
    setAwayTeamId,
    setHomeScore,
    setAwayScore,
    setMatchDate,
    setLocation,
    setDivision,
    handleSubmit,
  };
}