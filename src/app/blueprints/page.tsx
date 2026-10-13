import { PageHeader } from "@/components/layout/PageHeader";
import { RealmAtivoChip } from "@/components/layout/RealmAtivoChip";
import { BlueprintsProvisionamento } from "@/components/blueprints/BlueprintsProvisionamento";

export default function BlueprintsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            <RealmAtivoChip realm="sme-devops" />

            <PageHeader
                title="Automação de blueprints"
                description="Escolha uma ferramenta oficial da SME para provisionar automaticamente no Keycloak, com as melhores práticas de segurança já aplicadas."
            />

            <BlueprintsProvisionamento realm="sme-devops" />
        </div>
    );
}
