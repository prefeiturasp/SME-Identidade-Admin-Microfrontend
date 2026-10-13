import { Terminal } from "lucide-react";

import { BarChartIcon } from "@/components/icons/BarChartIcon";
import { MessageSquareIcon } from "@/components/icons/MessageSquareIcon";
import { ShieldIcon } from "@/components/icons/ShieldIcon";

export interface BlueprintFerramenta {
    id: string;
    nome: string;
    descricao: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const blueprintsMock: BlueprintFerramenta[] = [
    { id: "jenkins", nome: "Jenkins CI/CD", descricao: "Pipeline de automação SME", icon: Terminal },
    { id: "rocketchat", nome: "Rocket.Chat", descricao: "Comunicação instantânea segura", icon: MessageSquareIcon },
    { id: "grafana", nome: "Grafana Labs", descricao: "Dashboards de observabilidade", icon: BarChartIcon },
    { id: "nexus", nome: "Sonatype Nexus", descricao: "Gestão de artefatos e binários", icon: ShieldIcon },
];
