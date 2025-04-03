'use server'

import { ChevronRightIcon } from '@heroicons/react/20/solid'
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

import Image from 'next/image'


export default async function LandingPage () {

  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
     <div className="relative isolate overflow-hidden bg-white">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)" width="100%" height="100%" strokeWidth={0} />
      </svg>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0 lg:pt-8">      
          <Image
          alt="JRGS Logo"
          src="/JRGSLogo.png"
          width={250}
          height={350}
          className="w-auto h-auto"
          />            
          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-7xl">
            Securely Upload and Manage your 3D Assets
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Easily store, organize, and access your 3D models in the cloud. Keep your assets safe, fast to load, and ready for any project with powerful upload and management tools.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
          <SignedOut>
                <SignInButton>
                    <Button variant={'outline'}>
                            Sign in
                    </Button>
                </SignInButton>

                <SignUpButton>
                    <Button>
                            Sign up
                    </Button>
                </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <Button>
                      <Link href={'/authed/models'}> Go to Models </Link>
                  </Button>
                  <UserButton />
                </SignedIn>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 ring-inset lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                alt="App screenshot"
                src="/ModePageScreenshot.png"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md ring-1 shadow-2xl ring-gray-900/10"
              />
            </div>
          </div>
        </div>
      </div>
</div>
    </ClerkProvider>
  )
}
