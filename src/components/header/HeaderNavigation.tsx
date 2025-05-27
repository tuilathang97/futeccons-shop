"use client"
import { useCategories } from "@/contexts/CategoriesContext";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "../ui/navigation-menu";
import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";


export default function HeaderNavigation() {
  const { categories } = useCategories()
  const level1Categories = categories.filter((category) => category.level === 1)
  function getChildCategories(searchId: number,className?:string) {
    const result = categories.filter((category) => category.parentId === searchId)
    return (
      result.map((category) => (
        <div key={category.id} className={cn("",className)}>
          <ListItem href={category?.path ?? ""} title={category.name}>
            {category.name}
          </ListItem>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4"> 
            {
              getChildCategories(category.id,"min-w-full lg:min-w-full bg-gray-400/10 hover:opacity-80 rounded-md")
            }
          </div>
        </div>
      ))
    )
  }
  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
       {
        level1Categories.map((grandCategory) => (
          <NavigationMenuItem key={grandCategory.id}>
            <NavigationMenuTrigger className="bg-transparent font-semibold text-md">
              <Link href={grandCategory?.path ? grandCategory?.path : ""}>{grandCategory.name}</Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink asChild>
              <ul className=" gap-3 p-6 md:w-[600px] lg:w-[800px]">
                {
                  getChildCategories(grandCategory.id,"grid grid-cols-[0.3fr_1fr] my-2 gap-4")
                }
              </ul>

              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))
       }
      </NavigationMenuList>
    </NavigationMenu>
  )
}



const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className="my-2">
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

