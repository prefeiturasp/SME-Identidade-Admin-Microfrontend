'use client'

import { Spinner } from "./ui/spinner"

interface Props {
    title?: string
}

export function SpinnerCustom({ title = "Por favor, aguarde..." }: Readonly<Props>) {
    return (
        <div className="flex flex-col items-center justify-center py-4">
            <h6>{title}</h6>
            <Spinner className="text-primary" />
        </div>
    )
}
