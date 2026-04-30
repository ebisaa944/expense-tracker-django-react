import Button from '../ui/Button';

export default function AuthButton({ loading, children, ...props }) {
  return (
    <Button className="w-full" disabled={loading || props.disabled} {...props}>
      {loading ? 'Please wait...' : children}
    </Button>
  );
}
