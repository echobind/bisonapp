import { Loader } from 'lucide-react';

/** Renders a full page loading spinner */
export function FullPageSpinner() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  );
}
