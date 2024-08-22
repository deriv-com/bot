export type TAccordionItem = Array<{
    header: string;
    content: React.ReactNode;
}>;

export type TAccordionProps = {
    className?: string;
    list: TAccordionItem;
};
