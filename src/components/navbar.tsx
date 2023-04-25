import { Box } from "@chakra-ui/react";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar() {
  return (
    <Box display="flex" gap={4}>
      <Link href="/">Home</Link>
      <Link href="/tracker">Tracker</Link>
      <SignedOut>
        <Link href="/sign-up">Sign Up</Link>
        <Link href="/sign-in">Sign In</Link>
      </SignedOut>
    </Box>
  );
}
