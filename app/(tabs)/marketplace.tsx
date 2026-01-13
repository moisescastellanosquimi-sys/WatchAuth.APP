import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { TrendingUp, Star, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { mockListings } from '@/mocks/data';
import type { Listing } from '@/types';
import { moderateScale, moderateFontScale, wp, hp } from '@/utils/responsive';

export default function MarketplaceScreen() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<'all' | 'sell' | 'buy'>('all');

  const filteredListings = mockListings.filter(listing => {
    if (filter === 'all') return true;
    if (filter === 'sell') return listing.type === 'sell';
    if (filter === 'buy') return listing.type === 'buy_request';
    return true;
  });

  const handleUpgrade = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push('/subscription' as any);
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
          <Text style={styles.headerTitle}>{t('marketplace.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('marketplace.subtitle')}</Text>

          {isAuthenticated && user && !user.isPremium && (
            <Pressable
              onPress={handleUpgrade}
              style={({ pressed }) => [
                styles.premiumBanner,
                pressed && styles.buttonPressed,
              ]}
            >
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumGradient}
              >
                <Crown size={moderateScale(22)} color={Colors.background} />
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>{t('marketplace.upgradeToPremium')}</Text>
                  <Text style={styles.premiumSubtitle}>
                    {t('marketplace.featureDescription')}
                  </Text>
                </View>
              </LinearGradient>
            </Pressable>
          )}

          <View style={styles.filters}>
            <FilterButton
              label={t('marketplace.all')}
              active={filter === 'all'}
              onPress={() => setFilter('all')}
            />
            <FilterButton
              label={t('marketplace.forSale')}
              active={filter === 'sell'}
              onPress={() => setFilter('sell')}
            />
            <FilterButton
              label={t('marketplace.buyRequests')}
              active={filter === 'buy'}
              onPress={() => setFilter('buy')}
            />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}

          {!isAuthenticated && (
            <View style={styles.authPrompt}>
              <Text style={styles.authText}>{t('marketplace.signInToList')}</Text>
              <Pressable
                onPress={() => router.push('/auth' as any)}
                style={({ pressed }) => [
                  styles.authButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.authButtonText}>{t('auth.signIn')}</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterButton,
        active && styles.filterButtonActive,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const { t } = useTranslation();
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.listingCard,
        pressed && styles.listingCardPressed,
      ]}
    >
      <Image source={{ uri: listing.watch.imageUrl }} style={styles.listingImage} />
      
      {listing.isFeatured && (
        <View style={styles.featuredBadge}>
          <Star size={moderateScale(10)} color={Colors.background} fill={Colors.background} />
          <Text style={styles.featuredText}>{t('marketplace.featured')}</Text>
        </View>
      )}

      <View style={styles.listingContent}>
        <View style={styles.listingHeader}>
          <View style={styles.listingTitleSection}>
            <Text style={styles.listingBrand}>{listing.watch.brand}</Text>
            <Text style={styles.listingModel}>{listing.watch.model}</Text>
          </View>
          {listing.type === 'sell' && listing.price && (
            <View style={styles.priceSection}>
              <Text style={styles.price}>${listing.price.toLocaleString()}</Text>
              <TrendingUp size={moderateScale(14)} color={Colors.gold} />
            </View>
          )}
        </View>

        <Text style={styles.listingDescription} numberOfLines={2}>
          {listing.description}
        </Text>

        <View style={styles.listingFooter}>
          <View style={styles.seller}>
            {listing.user.avatar ? (
              <Image source={{ uri: listing.user.avatar }} style={styles.sellerAvatar} />
            ) : (
              <View style={styles.sellerAvatar} />
            )}
            <Text style={styles.sellerName}>{listing.user.name}</Text>
            {listing.user.isPremium && (
              <View style={styles.verifiedBadge}>
                <Crown size={moderateScale(10)} color={Colors.gold} />
              </View>
            )}
          </View>

          <View style={[
            styles.typeBadge,
            listing.type === 'buy_request' && styles.buyBadge,
          ]}>
            <Text style={styles.typeText}>
              {listing.type === 'sell' ? t('marketplace.forSale') : t('marketplace.buying')}
            </Text>
          </View>
        </View>
      </View>
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
    gap: moderateScale(10),
  },
  headerTitle: {
    fontSize: moderateFontScale(24),
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
  },
  premiumBanner: {
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    marginTop: moderateScale(6),
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(14),
    gap: moderateScale(10),
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: moderateFontScale(14),
    fontWeight: '700' as const,
    color: Colors.background,
    marginBottom: moderateScale(1),
  },
  premiumSubtitle: {
    fontSize: moderateFontScale(11),
    color: Colors.background,
    opacity: 0.9,
  },
  filters: {
    flexDirection: 'row',
    gap: moderateScale(6),
    marginTop: moderateScale(4),
  },
  filterButton: {
    paddingVertical: moderateScale(7),
    paddingHorizontal: moderateScale(14),
    borderRadius: moderateScale(18),
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  filterText: {
    fontSize: moderateFontScale(12),
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
    gap: moderateScale(14),
  },
  listingCard: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  listingCardPressed: {
    opacity: 0.8,
  },
  listingImage: {
    width: '100%',
    height: hp(22),
    backgroundColor: Colors.surfaceLight,
  },
  featuredBadge: {
    position: 'absolute',
    top: moderateScale(10),
    right: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
    backgroundColor: Colors.gold,
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(5),
    borderRadius: moderateScale(10),
  },
  featuredText: {
    fontSize: moderateFontScale(9),
    fontWeight: '700' as const,
    color: Colors.background,
  },
  listingContent: {
    padding: moderateScale(14),
    gap: moderateScale(10),
  },
  listingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listingTitleSection: {
    flex: 1,
    gap: moderateScale(1),
  },
  listingBrand: {
    fontSize: moderateFontScale(10),
    fontWeight: '600' as const,
    color: Colors.gold,
    textTransform: 'uppercase' as const,
  },
  listingModel: {
    fontSize: moderateFontScale(16),
    fontWeight: '700' as const,
    color: Colors.text,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(3),
  },
  price: {
    fontSize: moderateFontScale(18),
    fontWeight: '700' as const,
    color: Colors.gold,
  },
  listingDescription: {
    fontSize: moderateFontScale(12),
    color: Colors.textSecondary,
    lineHeight: moderateFontScale(18),
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: moderateScale(10),
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },
  sellerAvatar: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: Colors.surfaceLight,
  },
  sellerName: {
    fontSize: moderateFontScale(11),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  verifiedBadge: {
    width: moderateScale(16),
    height: moderateScale(16),
    borderRadius: moderateScale(8),
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadge: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    borderRadius: moderateScale(6),
    backgroundColor: Colors.success + '20',
  },
  buyBadge: {
    backgroundColor: Colors.gold + '20',
  },
  typeText: {
    fontSize: moderateFontScale(9),
    fontWeight: '600' as const,
    color: Colors.success,
  },
  authPrompt: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(14),
    padding: moderateScale(20),
    alignItems: 'center',
    gap: moderateScale(14),
    marginTop: moderateScale(14),
  },
  authText: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  authButton: {
    backgroundColor: Colors.gold,
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(28),
    borderRadius: moderateScale(10),
  },
  authButtonText: {
    fontSize: moderateFontScale(13),
    fontWeight: '700' as const,
    color: Colors.background,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
