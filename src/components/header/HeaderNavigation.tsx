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
          <ul className="flex flex-col min-w-[400px] mt-4"> 
            <li className="cursor-pointer ">
              <Link className="hover:underline hover:opacity-80" href={category?.path ?? ""}>{category.name}</Link>
              <ul>
                {
                  getChildCategories(category.id,"font-normal my-2 gap-4 text-base hover:underline ")
                }
              </ul>
            </li>
          </ul>
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
            <NavigationMenuTrigger className="bg-transparent hover:bg-none font-semibold text-base">
              <Link href={grandCategory?.path ? grandCategory?.path : ""}>{grandCategory.name}</Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-brand-light/30 border-t-none shadow-none">
              <NavigationMenuLink asChild>
              <ul className=" gap-3 grid min-w-[700px] grid-cols-3 p-6">
                {
                  getChildCategories(grandCategory.id,"font-semibold text-lg")
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



