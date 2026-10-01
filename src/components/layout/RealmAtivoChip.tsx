import { ChevronDown, Globe } from "lucide-react";

export function RealmAtivoChip({ realm }: Readonly<{ realm: string }>) {
    return (
        <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm w-fit">
            <Globe className="h-4 w-4 text-blue-700" />
            <span className="text-xs font-bold leading-5 text-grey-500">REALM ATIVO</span>
            <span className="font-semibold">{realm}</span>
            <ChevronDown className="h-4 w-4 text-grey-500" />
        </div>
    );
}
