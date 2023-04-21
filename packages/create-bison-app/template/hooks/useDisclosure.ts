import * as React from 'react';

export function useDisclosure() {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggle = () => setIsOpen(!isOpen);

  return { isOpen, onToggle };
}
