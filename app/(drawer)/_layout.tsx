import { Drawer } from 'expo-router/drawer';
import React from 'react';

const DrawerLayout = () => {
  return (
    <Drawer>
      {/* These are the screens that will appear in the drawer */}
      <Drawer.Screen name="(tabs)/home" />
      <Drawer.Screen name="exercises" />
      <Drawer.Screen name="mental" />
      <Drawer.Screen name="foodScreen" />
      <Drawer.Screen name="stepCounter" />
    </Drawer>
  );
};

export default DrawerLayout;
