import { Link } from "react-router-dom";
import { agendamentoCarefit } from "@/lib/ofertasCarefit";
import { track } from "@/lib/tracking";

export default function BookingCTA({ className, onde, curto = false }: { className: string; onde: string; curto?: boolean }) {
  return <Link className={className} to={agendamentoCarefit("dupla")} onClick={() => track("agendar_click", { servico: "dupla", onde })}>
    {curto ? "Agendar" : "Escolher dia e horário"}
  </Link>;
}
