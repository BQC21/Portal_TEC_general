type AddProductSectionTitleProps = {
  title: string;
};

export function AddProductSectionTitle({ title }: AddProductSectionTitleProps) {
  return (
    <div className="border-b border-slate-200 pb-4">
      <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
    </div>
  );
}