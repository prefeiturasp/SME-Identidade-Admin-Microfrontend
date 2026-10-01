export function PageHeader({
    title,
    description,
    action,
}: Readonly<{
    title: string;
    description: React.ReactNode;
    action?: React.ReactNode;
}>) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-base font-normal leading-none text-grey-700">{description}</p>
            </div>
            {action}
        </div>
    );
}
