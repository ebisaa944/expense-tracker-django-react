import Button from './Button';
import Card from './Card';

export default function Modal({
  description,
  isOpen,
  onClose,
  onConfirm,
  title,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md">
        <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button tone="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button tone="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </Card>
    </div>
  );
}
