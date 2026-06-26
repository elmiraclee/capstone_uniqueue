import { useCallback } from 'react';
import { View } from 'react-native';

import { useFocusEffect, usePathname, useRouter } from 'expo-router';

export default function Configuration() {
  const router = useRouter();
  const pathname = usePathname();

  useFocusEffect(
    useCallback(() => {
      if (pathname === '/office/config') {
        router.navigate('/office/config/document');
      }
    }, [pathname])
  );

  return <View />;
}