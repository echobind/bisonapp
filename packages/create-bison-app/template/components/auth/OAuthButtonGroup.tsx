import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';

import { GoogleIcon } from './ProviderIcons';

const providers = [
  { name: 'google', icon: <GoogleIcon boxSize="5" /> },
  // { name: 'twitter', icon: <TwitterIcon boxSize="5" /> },
  // { name: 'gitHub', icon: <GitHubIcon boxSize="5" /> },
];

export const OAuthButtonGroup = () => (
  <ButtonGroup variant="outline" spacing="4" width="full">
    {providers.map(({ name, icon }) => (
      <Button key={name} width="full" onClick={() => signIn(name)}>
        <VisuallyHidden>Sign in with {name}</VisuallyHidden>
        {icon}
      </Button>
    ))}
  </ButtonGroup>
);