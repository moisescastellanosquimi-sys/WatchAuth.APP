import { Tabs } from 'expo-router';
import { Home, Grid3x3, Store, MessageCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { getScaledTabFontSize, moderateScale } from '@/utils/responsive';

export default function TabLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tabFontSize = getScaledTabFontSize();
  const iconSize = moderateScale(22);
  const bottomPadding = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.gold,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 'auto' as any,
          minHeight: 60 + bottomPadding,
          paddingBottom: bottomPadding,
        },
        tabBarLabelStyle: {
          fontSize: tabFontSize,
          fontWeight: '600' as const,
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.scan'),
          tabBarIcon: ({ color }) => <Home size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: t('tabs.collection'),
          tabBarIcon: ({ color }) => <Grid3x3 size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: t('tabs.market'),
          tabBarIcon: ({ color }) => <Store size={iconSize} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('tabs.messages'),
          tabBarIcon: ({ color }) => <MessageCircle size={iconSize} color={color} />,
        }}
      />
    </Tabs>
  );
}
