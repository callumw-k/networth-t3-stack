import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Hide,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
} from "@chakra-ui/react";
import { SignedOut } from "@clerk/nextjs";
import NextLink from "next/link";
const menuItems = [
  {
    text: "Home",
    href: "/",
  },
  {
    text: "Tracker",
    href: "/tracker",
  },
  {
    text: "Sign Up",
    href: "/sign-up",
    auth: true,
  },
  {
    text: "Sign In",
    href: "/sign-in",
    auth: true,
  },
];

export function NavBar() {
  return (
    <Box
      display="flex"
      justifyContent={"flex-end"}
      gap={4}
      p={4}
      borderBottom={"1px solid #EAECF0"}
      mb={{ base: 8, md: 12 }}
    >
      <Hide above="md">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Navigtaion menu"
            icon={<HamburgerIcon />}
            variant={"outline"}
          />
          <MenuList>
            <MenuItem as={NextLink} href="/">
              Home
            </MenuItem>
            <MenuItem as={NextLink} href="/tracker">
              Tracker
            </MenuItem>
            <SignedOut>
              <MenuItem as={NextLink} href="/sign-up">
                Sign Up
              </MenuItem>
              <MenuItem as={NextLink} href="/sign-in">
                Sign In
              </MenuItem>
            </SignedOut>
          </MenuList>
        </Menu>
      </Hide>
      <Show above="md">
        {menuItems.map((item) => {
          if (item.auth) {
            return (
              <SignedOut key={item.href}>
                <Link as={NextLink} href={item.href}>
                  {item.text}
                </Link>
              </SignedOut>
            );
          }
          return (
            <Link as={NextLink} key={item.href} href={item.href}>
              {item.text}
            </Link>
          );
        })}
      </Show>
    </Box>
  );
}
