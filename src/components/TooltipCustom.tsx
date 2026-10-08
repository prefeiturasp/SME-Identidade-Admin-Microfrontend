import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
    children: React.ReactNode;
    side: "left" | "top" | "bottom" | "right"
    title: string
}

export function TooltipCustom({ children, side, title }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            <Tooltip key={side} {...(!title ? { open: false } : {})}>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side}>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
