import Button from '../ui/Button';

export default function GoogleAuthButton({ disabled, onClick }) {
  return (
    <Button
      type="button"
      tone="secondary"
      className="w-full bg-[var(--surface-strong)]"
      onClick={onClick}
      disabled={disabled}
    >
      Continue with Google
    </Button>
  );
}
