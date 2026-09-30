import { Globe } from "lucide-react";

export function RealmAtivoChip({ realm }: { realm: string }) {
    return (
        <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm w-fit">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">REALM ATIVO</span>
            <span className="font-semibold">{realm}</span>
        </div>
    );
}
