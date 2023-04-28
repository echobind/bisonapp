import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/** A form with a centered box. Ex: Login, Signup */
export function CenteredBoxForm({ children }: Props) {
  return (
    <div className="m-auto rounded-xl w-full max-w-sm sm:shadow-md dark:sm:shadow-slate-600 p-8 my-4 lg:my-16 mx-8 lg:mx-auto">
      {children}
    </div>
  );
}
