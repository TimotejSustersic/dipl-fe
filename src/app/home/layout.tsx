"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ROUTE_MAPS, ROUTE_CARS } from "@/routes";
import Link from "next/link";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div id="home" className="h-screen flex flex-col">
      <div id="home-navigation" className="h-16 flex-shrink-0">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href={ROUTE_MAPS} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Maps
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href={ROUTE_CARS} legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Cars
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
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
