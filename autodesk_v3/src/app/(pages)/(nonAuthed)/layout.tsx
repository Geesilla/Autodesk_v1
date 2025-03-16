import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import Link from 'next/link';

function Header ( ) {
  return (
    <header className='w-full flex z-[99] absolute p-4'>
        <div className='w-full'>
            <h1> App title </h1>
        </div>
        <div className="flex flex-row space-x-3">
        <SignedOut>
                <SignInButton>
                    <Button variant={'outline'}>
                            sign in
                    </Button>
                </SignInButton>

                <SignUpButton>
                    <Button>
                            sign up
                    </Button>
                </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <Button>
                      <Link href={'/authed/dashboard'}> Go to Admin </Link>
                  </Button>
                  <UserButton />
                </SignedIn>
        </div>
    </header>
  )
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Header />
        {children}
    </>

  );
}
