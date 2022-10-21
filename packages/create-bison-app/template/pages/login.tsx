import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useState } from 'react';

import { LoginForm } from '../components/auth/LoginForm';
import { SignUpForm } from '../components/auth/SignUpForm';

// import { getDefaultServerSideProps } from '@/utils/getDefaultServerSideProps';
import { Logo } from '@/components/Logo';

function LoginPage() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabsChange = (index: number) => {
    setTabIndex(index);
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Container maxW="lg" py={{ base: '6', md: '12' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Logo />
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={useBreakpointValue({ base: 'xs', md: 'sm' })}>
                Log in to your account
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Don't have an account?</Text>
                <Button variant="link" colorScheme="blue" onClick={() => setTabIndex(1)}>
                  Sign up
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
            boxShadow={{ base: 'none', sm: useColorModeValue('md', 'md-dark') }}
            borderRadius={{ base: 'none', sm: 'xl' }}
          >
            <Tabs
              isLazy
              lazyBehavior="unmount"
              isFitted
              variant="enclosed"
              index={tabIndex}
              onChange={handleTabsChange}
            >
              <TabList>
                <Tab>Login</Tab>
                <Tab>Sign Up</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <LoginForm />
                </TabPanel>
                <TabPanel>
                  <SignUpForm />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

// export { getDefaultServerSideProps as getServerSideProps };
export default LoginPage;