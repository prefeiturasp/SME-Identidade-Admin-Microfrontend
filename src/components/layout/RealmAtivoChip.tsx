import { ChevronDown, Globe } from "lucide-react";

export function RealmAtivoChip({ realm }: Readonly<{ realm: string }>) {
    return (
        <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm w-fit">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Globe className="h-[13px] w-[13px] text-blue-700" />
            </span>
            <span className="text-xs font-bold leading-5 text-grey-500">REALM ATIVO</span>
            <span className="font-semibold">{realm}</span>
            <ChevronDown className="h-4 w-4 text-grey-500" />
        </div>
    );
}
