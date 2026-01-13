import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ArrowLeft, Crown, Check, Briefcase, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';

type SubscriptionTier = 'professional' | 'collector';

export default function SubscriptionScreen() {
  const { t } = useTranslation();
  const { upgradeToPremium } = useAuth();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const professionalFeatures = t('subscription.professionalFeatures', { returnObjects: true }) as string[];
  const collectorFeatures = t('subscription.collectorFeatures', { returnObjects: true }) as string[];

  const handleTierSelect = (tier: SubscriptionTier) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setSelectedTier(tier);
  };

  const handleSubscribe = async () => {
    if (!selectedTier) return;

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setIsLoading(true);
    await upgradeToPremium(selectedTier);
    setIsLoading(false);
    router.back();
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
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('subscription.choosePlan')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.heroSection}>
              <View style={styles.crownIcon}>
                <Crown size={48} color={Colors.gold} strokeWidth={2} />
              </View>
              <Text style={styles.title}>{t('subscription.title')}</Text>
              <Text style={styles.subtitle}>
                {t('subscription.planDescription')}
              </Text>
            </View>

            <View style={styles.tiersContainer}>
              <Pressable
                onPress={() => handleTierSelect('collector')}
                style={({ pressed }) => [
                  styles.tierCard,
                  selectedTier === 'collector' && styles.tierCardSelected,
                  pressed && styles.tierCardPressed,
                ]}
              >
                <View style={styles.tierHeader}>
                  <View style={styles.tierIconContainer}>
                    <User size={28} color={Colors.gold} strokeWidth={2} />
                  </View>
                  <View style={styles.tierTitleSection}>
                    <Text style={styles.tierTitle}>{t('subscription.collectorPlan')}</Text>
                    <Text style={styles.tierDescription}>{t('sellerOnboarding.privateDescription')}</Text>
                  </View>
                </View>

                <View style={styles.priceSection}>
                  <Text style={styles.price}>$25</Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </View>

                <View style={styles.featuresSection}>
                  <Text style={styles.featuresTitle}>{t('subscription.planDescription')}</Text>
                  <View style={styles.featuresList}>
                    {collectorFeatures.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Check size={16} color={Colors.gold} strokeWidth={3} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {selectedTier === 'collector' && (
                  <View style={styles.selectedBadge}>
                    <Check size={16} color={Colors.background} strokeWidth={3} />
                    <Text style={styles.selectedText}>{t('common.confirm')}</Text>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => handleTierSelect('professional')}
                style={({ pressed }) => [
                  styles.tierCard,
                  styles.tierCardPremium,
                  selectedTier === 'professional' && styles.tierCardSelected,
                  pressed && styles.tierCardPressed,
                ]}
              >
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>{t('subscription.mostPopular').toUpperCase()}</Text>
                </View>

                <View style={styles.tierHeader}>
                  <View style={styles.tierIconContainer}>
                    <Briefcase size={28} color={Colors.gold} strokeWidth={2} />
                  </View>
                  <View style={styles.tierTitleSection}>
                    <Text style={styles.tierTitle}>{t('subscription.professionalPlan')}</Text>
                    <Text style={styles.tierDescription}>{t('sellerOnboarding.professionalDescription')}</Text>
                  </View>
                </View>

                <View style={styles.priceSection}>
                  <Text style={styles.price}>$50</Text>
                  <Text style={styles.pricePeriod}>/month</Text>
                </View>

                <View style={styles.featuresSection}>
                  <Text style={styles.featuresTitle}>{t('subscription.planDescription')}</Text>
                  <View style={styles.featuresList}>
                    {professionalFeatures.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Check size={16} color={Colors.gold} strokeWidth={3} />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {selectedTier === 'professional' && (
                  <View style={styles.selectedBadge}>
                    <Check size={16} color={Colors.background} strokeWidth={3} />
                    <Text style={styles.selectedText}>{t('common.confirm')}</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {selectedTier && (
              <Pressable
                onPress={handleSubscribe}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.subscribeButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <LinearGradient
                  colors={[Colors.gold, Colors.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.subscribeGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.background} />
                  ) : (
                    <>
                      <Crown size={20} color={Colors.background} />
                      <Text style={styles.subscribeText}>
                        {t('subscription.subscribe')} - {selectedTier === 'professional' ? t('subscription.professionalPrice') : t('subscription.collectorPrice')}
                      </Text>
                    </>
                  )}
                </LinearGradient>
              </Pressable>
            )}

            <Text style={styles.disclaimer}>
              {t('subscription.cancelAnytime')}. {t('subscription.billedMonthly')}.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  content: {
    gap: 24,
  },
  heroSection: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  crownIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  tiersContainer: {
    gap: 16,
  },
  tierCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    gap: 20,
  },
  tierCardPremium: {
    borderColor: Colors.gold,
  },
  tierCardSelected: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  tierCardPressed: {
    opacity: 0.8,
  },
  popularBadge: {
    position: 'absolute' as const,
    top: -10,
    right: 20,
    backgroundColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 1,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tierIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierTitleSection: {
    flex: 1,
    gap: 4,
  },
  tierTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  tierDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: Colors.gold,
  },
  pricePeriod: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  featuresSection: {
    gap: 12,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.gold,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.background,
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  subscribeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    minHeight: 56,
  },
  subscribeText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
