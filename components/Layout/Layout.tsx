'use client';

import {
  AppShell,
  Burger,
  Button,
  Flex,
  Group,
  NativeSelect,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure, useFavicon } from '@mantine/hooks';
import '@mantine/notifications/styles.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  IconBooks,
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandTwitter,
  IconMicroscope,
  IconSpeakerphone,
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useEffect } from 'react';
import { Networks, useNetworkConfiguration } from '../../hooks/useNetworkConfiguration';
import { shortKey } from '@/lib/utils';
import icon from '@/public/meta.jpg';
import _favicon from '@/public/favicon.ico';
import { Explorers, useExplorerConfiguration } from '@/hooks/useExplorerConfiguration';

interface MenuItem {
  name: string;
  href: string;
  icon: ReactNode;
  debug?: boolean;
  external?: boolean;
}
const menuItems: MenuItem[] = [
  { name: 'Proposals', href: '/proposals', icon: <IconSpeakerphone /> },
  // { name: 'Analytics', href: '/analytics', icon: <IconDeviceDesktopAnalytics /> },
  { name: 'Docs', href: 'https://themetadao.org/', icon: <IconBooks />, external: true },
  { name: 'Debug', href: '/debug', icon: <IconMicroscope />, debug: true },
];

const networks = [
  { label: 'Mainnet', value: Networks.Mainnet.toString() },
  { label: 'Devnet', value: Networks.Devnet.toString() },
  { label: 'Localnet', value: Networks.Localnet.toString() },
  { label: 'Custom', value: Networks.Custom.toString() },
];

const explorers = [
  { label: 'Solana.fm', value: Explorers.SolanaFM.toString() },
  { label: 'Solscan', value: Explorers.Solscan.toString() },
  { label: 'X-Ray', value: Explorers.Xray.toString() },
  { label: 'Solana Explorer', value: Explorers.Solana.toString() },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const wallet = useWallet();
  const modal = useWalletModal();
  const { network, endpoint, setNetwork, setCustomEndpoint } = useNetworkConfiguration();
  const { explorer, setExplorer } = useExplorerConfiguration();
  const [opened, { toggle }] = useDisclosure();

  useFavicon(_favicon.src);

  useEffect(() => {
    if (!wallet.connected && wallet.wallet) {
      wallet.connect();
    }
  }, [wallet]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'lg', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Flex justify="space-between" align="center" p="5" w="100%">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Flex justify="flex-start" align="center" gap="xs">
              <Image src={icon} alt="App logo" width={48} height={48} />
              <Title c="initial">Futarchy</Title>
            </Flex>
          </Link>
          <Burger opened={opened} onClick={toggle} hiddenFrom="lg" size="sm" />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap={15}>
          <Stack>
            {menuItems.map((item) =>
              item.debug && network === Networks.Mainnet ? null : (
                <Link key={item.href} href={item.href} target={item.external ? '_blank' : '_self'}>
                  <Button variant="default" w="100%" justify="flex-start">
                    {item.icon}
                    <Text>{item.name}</Text>
                  </Button>
                </Link>
              ),
            )}
          </Stack>
          {wallet?.publicKey ? (
            <Button variant="danger" onClick={() => wallet.disconnect()}>
              {shortKey(wallet.publicKey)}
            </Button>
          ) : (
            <Button onClick={() => modal.setVisible(true)}>Connect wallet</Button>
          )}
          <NativeSelect
            label="Network"
            data={networks}
            value={network}
            onChange={(e) => setNetwork(e.target.value as Networks)}
          />
          {network === Networks.Custom ? (
            <TextInput
              label="RPC URL"
              placeholder="Your custom RPC URL"
              onChange={(e) => setCustomEndpoint(e.target.value)}
              defaultValue={endpoint}
            />
          ) : null}
          <NativeSelect
            label="Explorer"
            data={explorers}
            value={explorer}
            onChange={(e) => setExplorer(e.target.value as Explorers)}
          />
          <Group justify="center">
            <Link href="https://github.com/Dodecahedr0x/meta-dao-frontend">
              <IconBrandGithub />
            </Link>
            <Link href="https://discord.gg/metadao">
              <IconBrandDiscord />
            </Link>
            <Link href="https://twitter.com/MetaDAOProject">
              <IconBrandTwitter />
            </Link>
          </Group>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
