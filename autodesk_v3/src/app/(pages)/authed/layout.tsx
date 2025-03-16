'use client'
import { Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
  import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
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
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]
 
export function AppSidebar() {
  useEffect( ( ) => {
      initialiseNewUser();
  } , [ ] );;
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
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
              <UserButton />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode  }>) {
    return (
      <ClerkProvider>
            <SignedIn>
              <SidebarProvider>
                <AppSidebar />
                <main>
                  <header>
                    <SidebarTrigger />
                    <SignOutButton>
                        <Button> Sign out </Button>
                     </SignOutButton>
                  </header>
                  {children}
                </main>
              </SidebarProvider>
                 {children}
            </SignedIn>
            <SignedOut>
                    <p> You must sign in</p>
            </SignedOut>
      </ClerkProvider>
    );
  }
  