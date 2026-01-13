import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Grid3x3, Eye, EyeOff, User, LogOut, Plus, DollarSign } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { mockWatches } from '@/mocks/data';
import type { WatchItem } from '@/types';
import { moderateScale, moderateFontScale, wp, hp, screenWidth } from '@/utils/responsive';

const CARD_GAP = moderateScale(12);
const CARD_WIDTH = (screenWidth - wp(6) * 2 - CARD_GAP) / 2;

export default function CollectionScreen() {
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [showPrivate, setShowPrivate] = useState(false);

  if (!isAuthenticated || !user) {
    return <AuthPrompt />;
  }

  const userWatches = mockWatches.filter(w => w.userId === user.id);
  const displayedWatches = showPrivate ? userWatches : userWatches.filter(w => w.isPublic);

  const handleLogout = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    await logout();
  };

  const toggleVisibility = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowPrivate(!showPrivate);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>{t('collection.title')}</Text>
            <Pressable
              onPress={handleLogout}
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <LogOut size={moderateScale(18)} color={Colors.textSecondary} />
            </Pressable>
          </View>

          {!user.sellerVerified && (
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                }
                router.push('/seller-onboarding' as any);
              }}
              style={({ pressed }) => [
                styles.sellerPrompt,
                pressed && styles.buttonPressed,
              ]}
            >
              <DollarSign size={moderateScale(18)} color={Colors.gold} />
              <Text style={styles.sellerPromptText}>{t('collection.becomeSeller')}</Text>
            </Pressable>
          )}

          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
              ) : (
                <User size={moderateScale(28)} color={Colors.gold} />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              {user.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>{t('marketplace.premium')}</Text>
                </View>
              )}
            </View>
          </View>

          {user.sellerVerified && (
            <View style={styles.sellerBadge}>
              <Text style={styles.sellerBadgeText}>
                {user.sellerType === 'professional' ? '🏢 ' + t('collection.professionalSeller') : '👤 ' + t('collection.privateSeller')}
              </Text>
            </View>
          )}

          <View style={styles.stats}>
            <StatCard label={t('collection.totalWatches')} value={userWatches.length.toString()} />
            <StatCard label={t('collection.public')} value={userWatches.filter(w => w.isPublic).length.toString()} />
            <StatCard label={t('collection.private')} value={userWatches.filter(w => !w.isPublic).length.toString()} />
          </View>

          <Pressable
            onPress={toggleVisibility}
            style={({ pressed }) => [
              styles.visibilityToggle,
              pressed && styles.buttonPressed,
            ]}
          >
            {showPrivate ? (
              <Eye size={moderateScale(16)} color={Colors.gold} />
            ) : (
              <EyeOff size={moderateScale(16)} color={Colors.textSecondary} />
            )}
            <Text style={styles.visibilityText}>
              {showPrivate ? t('collection.showingAll') : t('collection.publicOnly')}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {displayedWatches.length === 0 ? (
            <View style={styles.emptyState}>
              <Grid3x3 size={moderateScale(56)} color={Colors.textTertiary} strokeWidth={1.5} />
              <Text style={styles.emptyText}>{t('collection.noWatches')}</Text>
              <Text style={styles.emptySubtext}>
                {t('collection.scanToAdd')}
              </Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {displayedWatches.map(watch => (
                <WatchCard
                  key={watch.id}
                  watch={watch}
                  onSell={user.sellerVerified ? (watchId) => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    }
                    router.push('/list-watch' as any);
                  } : undefined}
                />
              ))}
            </View>
          )}

          {user.sellerVerified && displayedWatches.length > 0 && (
            <View style={styles.actionCard}>
              <Plus size={moderateScale(18)} color={Colors.gold} />
              <Text style={styles.actionText}>{t('collection.longPressToSell')}</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function AuthPrompt() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.authPrompt}>
          <Grid3x3 size={moderateScale(70)} color={Colors.gold} strokeWidth={1.5} />
          <Text style={styles.authTitle}>{t('collection.signInPrompt')}</Text>
          <Text style={styles.authSubtitle}>
            {t('collection.signInDescription')}
          </Text>
          <Pressable
            onPress={() => router.push('/auth' as any)}
            style={({ pressed }) => [
              styles.authButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <LinearGradient
              colors={[Colors.gold, Colors.goldDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.authButtonGradient}
            >
              <Text style={styles.authButtonText}>{t('auth.signIn')}</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function WatchCard({ watch, onSell }: { watch: WatchItem; onSell?: (watchId: string) => void }) {
  const { t } = useTranslation();
  const handleLongPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    Alert.alert(
      watch.brand + ' ' + watch.model,
      t('common.confirm'),
      [
        {
          text: t('collection.sellThisWatch'),
          onPress: () => onSell?.(watch.id),
        },
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Pressable
      onLongPress={onSell ? handleLongPress : undefined}
      style={({ pressed }) => [
        styles.watchCard,
        pressed && styles.watchCardPressed,
      ]}
    >
      <Image source={{ uri: watch.imageUrl }} style={styles.watchImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.watchGradient}
      >
        <View style={styles.watchInfo}>
          <Text style={styles.watchBrand}>{watch.brand}</Text>
          <Text style={styles.watchModel}>{watch.model}</Text>
          <Text style={styles.watchValue}>
            ${watch.estimatedValue.min.toLocaleString()} - ${watch.estimatedValue.max.toLocaleString()}
          </Text>
        </View>
      </LinearGradient>
      {!watch.isPublic && (
        <View style={styles.privateBadge}>
          <EyeOff size={moderateScale(10)} color={Colors.text} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: moderateScale(12),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: moderateFontScale(24),
    fontWeight: '700' as const,
    color: Colors.text,
  },
  logoutButton: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(14),
  },
  avatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    flex: 1,
    gap: moderateScale(3),
  },
  profileName: {
    fontSize: moderateFontScale(18),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  profileEmail: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
  },
  premiumBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.gold,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(10),
    marginTop: moderateScale(3),
  },
  premiumText: {
    fontSize: moderateFontScale(10),
    fontWeight: '700' as const,
    color: Colors.background,
  },
  stats: {
    flexDirection: 'row',
    gap: moderateScale(10),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateFontScale(20),
    fontWeight: '700' as const,
    color: Colors.gold,
    marginBottom: moderateScale(2),
  },
  statLabel: {
    fontSize: moderateFontScale(10),
    color: Colors.textSecondary,
  },
  visibilityToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(14),
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(8),
    alignSelf: 'center',
  },
  visibilityText: {
    fontSize: moderateFontScale(12),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(10),
    gap: moderateScale(14),
  },
  emptyText: {
    fontSize: moderateFontScale(16),
    fontWeight: '600' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  watchCard: {
    width: CARD_WIDTH,
    aspectRatio: 0.75,
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  watchCardPressed: {
    opacity: 0.8,
  },
  watchImage: {
    width: '100%',
    height: '100%',
  },
  watchGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  watchInfo: {
    padding: moderateScale(10),
    gap: moderateScale(1),
  },
  watchBrand: {
    fontSize: moderateFontScale(10),
    fontWeight: '600' as const,
    color: Colors.gold,
    textTransform: 'uppercase' as const,
  },
  watchModel: {
    fontSize: moderateFontScale(12),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  watchValue: {
    fontSize: moderateFontScale(9),
    color: Colors.textSecondary,
    marginTop: moderateScale(2),
  },
  privateBadge: {
    position: 'absolute',
    top: moderateScale(6),
    right: moderateScale(6),
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: moderateScale(10),
    padding: moderateScale(5),
  },
  authPrompt: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
    gap: moderateScale(18),
  },
  authTitle: {
    fontSize: moderateFontScale(22),
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  authSubtitle: {
    fontSize: moderateFontScale(14),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateFontScale(22),
  },
  authButton: {
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    marginTop: moderateScale(10),
    width: '100%',
  },
  authButtonGradient: {
    paddingVertical: moderateScale(16),
    alignItems: 'center',
  },
  authButtonText: {
    fontSize: moderateFontScale(15),
    fontWeight: '700' as const,
    color: Colors.background,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  sellerPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(14),
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  sellerPromptText: {
    fontSize: moderateFontScale(13),
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  sellerBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(14),
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  sellerBadgeText: {
    fontSize: moderateFontScale(12),
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
    marginTop: moderateScale(14),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    fontSize: moderateFontScale(12),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
