'use server'    
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  
export default async function Page ( ) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dragon</CardTitle>
            </CardHeader>
            <CardContent>
                <p>3D Dragon model</p>
                
            </CardContent>
            <CardFooter>
                <Button  >
                    <Link href="modelview">
                    View Model
                    </Link>
                </Button>
            </CardFooter>
            </Card>


    )
}