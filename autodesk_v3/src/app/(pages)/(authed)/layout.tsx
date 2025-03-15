
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
  } from '@clerk/nextjs'

export default function  RootLayout({ children }: Readonly<{ children: React.ReactNode  }>) {
    return (
      <ClerkProvider>
            <SignedIn>
                 {children}
            </SignedIn>
            <SignedOut>
                    <p> You must sign in</p>
            </SignedOut>
      </ClerkProvider>
    );
  }
  