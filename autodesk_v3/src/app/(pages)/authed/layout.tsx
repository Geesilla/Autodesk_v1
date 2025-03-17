'use client'
import { Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
  import { BookImage, Calendar, FileAxis3D, Home, Inbox, PackageOpen, Search, Settings, Upload } from "lucide-react"
import { initialiseNewUser } from "@/features/users/actions"

  import {

    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import {
    ClerkProvider,
    SignInButton,
    SignOutButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
    UserProfile,
  } from '@clerk/nextjs'
import { useEffect } from "react"
import { Button } from "@/components/ui/button"


const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "inbox",
    icon: Inbox,
  },
  {
    title: "Upload Models",
    url: "upload",
    icon: Upload,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Models",
    url: "models",
    icon: FileAxis3D,
  },
  {
    title: "Projects",
    url: "projects",
    icon: PackageOpen,
  },
]
 
export function AppSidebar() {
  useEffect( ( ) => {
      initialiseNewUser();
  } , [ ] );;
  return (
    <Sidebar className="shadow-md" >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold font-sans">JRGS TECH</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu  className="text-lg font-bold font-sans">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <SignedIn>
        <SidebarProvider>
          <AppSidebar />
          <main className="flex flex-col min-h-screen w-full">
            {/* Header with Fixed Size & Button Aligned Right */}
            <header className="w-full h-16 bg-gray-100 dark:bg-gray-900 flex items-center justify-between px-6 shadow-md">
              <SidebarTrigger />
              <div className="ml-auto">
                <UserButton afterSignOutUrl="/" />
              </div>
            </header>

            {/* Page Content */}
            <div className="p-6 flex-grow">{children}</div>
          </main>
        </SidebarProvider>
      </SignedIn>
      <SignedOut>
        <p className="text-center mt-6">You must sign in</p>
      </SignedOut>
    </ClerkProvider>
  );
}

  