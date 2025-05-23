"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ROUTE_MAPS, ROUTE_CARS, ROUTE_TESTING, ROUTE_INFRASTRUCTURE } from "@/routes";
import Link from "next/link";
import { Map, Car, FlaskConical, Fuel } from "lucide-react";

interface NavLinkProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

const NavLink = ({ href, icon: Icon, label }: NavLinkProps) => (
  <NavigationMenuItem>
   
      <NavigationMenuLink
        className={
          navigationMenuTriggerStyle() +
          " flex items-center gap-2 transition-all hover:bg-primary/10"
        }
        href={href}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </NavigationMenuLink>
    
  </NavigationMenuItem>
);

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Link href={ROUTE_MAPS} className="flex items-center gap-2 mr-6">
          {" "}
          {/* Changed from <Link href="/"> */}
          <Map className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg text-primary hidden sm:inline-block">
            Maps
          </span>
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavLink href={ROUTE_CARS} label="Vehicles" icon={Car}></NavLink>
            <NavLink href={ROUTE_TESTING} label="Testing & Evaluation" icon={FlaskConical}></NavLink>
            <NavLink href={ROUTE_INFRASTRUCTURE} label="Infrastrcture" icon={Fuel}></NavLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div id="home-body" className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default HomeLayout;
