import React from 'react'
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '../ui/button'
import { Home, Menu } from 'lucide-react'
import Link from 'next/link'
import { OPTIONS } from '@/app/posting/page'

function NavigationSubMenu() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                    <SheetTitle><Menu className="h-6 w-6" /></SheetTitle>
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            {/* đây là mobile nav */}
            <SheetContent side="left">
                <Link href="#" className="!max-w-8" prefetch={false}>
                    <Home className="h-6 w-6" />
                </Link>
                <div className="grid gap-2 py-6">
                    {OPTIONS.categories.map((category, index) => (
                        <Accordion key={index} type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>{category.label}</AccordionTrigger>
                                {category.options.map((option, index) => {
                                    {
                                        return (
                                            <AccordionContent key={index} className="pl-4">
                                                <Link className="hover:underline" href={`${category.slug}${option.slug}`}>{option.label}</Link>
                                            </AccordionContent>
                                        )
                                    }
                                })}
                            </AccordionItem>
                        </Accordion>

                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default NavigationSubMenu