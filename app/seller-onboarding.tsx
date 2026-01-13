import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Briefcase, User, Upload, CheckCircle, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { moderateScale, moderateFontScale, wp, hp } from '@/utils/responsive';

type Step = 'select' | 'professional_verify' | 'private_verify' | 'complete';

export default function SellerOnboardingScreen() {
  const { t } = useTranslation();
  const { setSellerType, submitBusinessVerification, verifyPrivateSeller } = useAuth();
  const [step, setStep] = useState<Step>('select');
  const [selectedType, setSelectedType] = useState<'professional' | 'private' | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessDocument, setBusinessDocument] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTypeSelect = async (type: 'professional' | 'private') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    setSelectedType(type);
    await setSellerType(type);
    
    if (type === 'professional') {
      setStep('professional_verify');
    } else {
      setStep('private_verify');
    }
  };

  const pickDocument = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setBusinessDocument(result.assets[0].uri);
    }
  };

  const handleProfessionalSubmit = async () => {
    if (!businessName.trim() || !businessDocument) {
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);
    
    await submitBusinessVerification([businessDocument]);
    
    setIsLoading(false);
    setStep('complete');
  };

  const handlePrivateVerify = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);
    await verifyPrivateSeller();
    setIsLoading(false);
    setStep('complete');
  };

  const handleComplete = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
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
            <ArrowLeft size={moderateScale(22)} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('sellerOnboarding.title')}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 'select' && (
            <View style={styles.content}>
              <Text style={styles.title}>{t('sellerOnboarding.accountType')}</Text>
              <Text style={styles.subtitle}>
                {t('sellerOnboarding.accountTypeDescription')}
              </Text>

              <View style={styles.optionsContainer}>
                <Pressable
                  onPress={() => handleTypeSelect('professional')}
                  style={({ pressed }) => [
                    styles.optionCard,
                    pressed && styles.optionCardPressed,
                  ]}
                >
                  <View style={styles.optionIcon}>
                    <Briefcase size={moderateScale(28)} color={Colors.gold} strokeWidth={2} />
                  </View>
                  <Text style={styles.optionTitle}>{t('sellerOnboarding.professionalSeller')}</Text>
                  <Text style={styles.optionDescription}>
                    {t('sellerOnboarding.professionalDescription')}
                  </Text>
                  <View style={styles.optionBadge}>
                    <Text style={styles.optionBadgeText}>{t('sellerOnboarding.documentsRequired')}</Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => handleTypeSelect('private')}
                  style={({ pressed }) => [
                    styles.optionCard,
                    pressed && styles.optionCardPressed,
                  ]}
                >
                  <View style={styles.optionIcon}>
                    <User size={moderateScale(28)} color={Colors.gold} strokeWidth={2} />
                  </View>
                  <Text style={styles.optionTitle}>{t('sellerOnboarding.privateCollector')}</Text>
                  <Text style={styles.optionDescription}>
                    {t('sellerOnboarding.privateDescription')}
                  </Text>
                  <View style={styles.optionBadge}>
                    <Text style={styles.optionBadgeText}>{t('common.continue')}</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          )}

          {step === 'professional_verify' && (
            <View style={styles.content}>
              <Text style={styles.title}>{t('sellerOnboarding.businessVerification')}</Text>
              <Text style={styles.subtitle}>
                {t('sellerOnboarding.businessVerificationDescription')}
              </Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('sellerOnboarding.businessName')}</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t('sellerOnboarding.businessName')}
                    placeholderTextColor={Colors.textTertiary}
                    value={businessName}
                    onChangeText={setBusinessName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('sellerOnboarding.uploadDocuments')}</Text>
                  <Text style={styles.inputHint}>
                    {t('sellerOnboarding.uploadLicense')}
                  </Text>
                  <Pressable
                    onPress={pickDocument}
                    style={({ pressed }) => [
                      styles.uploadButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Upload size={moderateScale(18)} color={Colors.gold} />
                    <Text style={styles.uploadButtonText}>
                      {businessDocument ? t('common.done') : t('sellerOnboarding.uploadDocuments')}
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleProfessionalSubmit}
                  disabled={isLoading || !businessName.trim() || !businessDocument}
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.buttonPressed,
                    (!businessName.trim() || !businessDocument) && styles.submitButtonDisabled,
                  ]}
                >
                  <LinearGradient
                    colors={[Colors.gold, Colors.goldDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.submitGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={Colors.background} />
                    ) : (
                      <Text style={styles.submitText}>{t('common.submit')}</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          )}

          {step === 'private_verify' && (
            <View style={styles.content}>
              <Text style={styles.title}>{t('sellerOnboarding.privateCollector')}</Text>
              <Text style={styles.subtitle}>
                {t('sellerOnboarding.verifiedDescription')}
              </Text>

              <View style={styles.infoCard}>
                <CheckCircle size={moderateScale(42)} color={Colors.gold} strokeWidth={2} />
                <Text style={styles.infoTitle}>{t('sellerOnboarding.startSelling')}</Text>
                <Text style={styles.infoText}>
                  {t('sellerOnboarding.ownershipDescription')}
                </Text>
              </View>

              <Pressable
                onPress={handlePrivateVerify}
                disabled={isLoading}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <LinearGradient
                  colors={[Colors.gold, Colors.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.submitGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.background} />
                  ) : (
                    <Text style={styles.submitText}>{t('common.continue')}</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {step === 'complete' && (
            <View style={styles.content}>
              <View style={styles.successCard}>
                <CheckCircle size={moderateScale(70)} color={Colors.gold} strokeWidth={2} />
                <Text style={styles.successTitle}>
                  {selectedType === 'professional' ? t('sellerOnboarding.verificationInProgress') : t('sellerOnboarding.verified')}
                </Text>
                <Text style={styles.successText}>
                  {selectedType === 'professional'
                    ? t('sellerOnboarding.verificationDescription')
                    : t('sellerOnboarding.verifiedDescription')}
                </Text>
                <Pressable
                  onPress={handleComplete}
                  style={({ pressed }) => [
                    styles.submitButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <LinearGradient
                    colors={[Colors.gold, Colors.goldDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.submitGradient}
                  >
                    <Text style={styles.submitText}>{t('common.done')}</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          )}
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
    paddingHorizontal: wp(5),
    paddingVertical: moderateScale(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: moderateScale(6),
  },
  headerTitle: {
    fontSize: moderateFontScale(16),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  headerSpacer: {
    width: moderateScale(36),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
  },
  content: {
    gap: moderateScale(20),
  },
  title: {
    fontSize: moderateFontScale(24),
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateFontScale(14),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateFontScale(22),
  },
  optionsContainer: {
    gap: moderateScale(14),
    marginTop: moderateScale(6),
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(18),
    padding: moderateScale(20),
    alignItems: 'center',
    gap: moderateScale(10),
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  optionIcon: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: moderateFontScale(18),
    fontWeight: '700' as const,
    color: Colors.text,
  },
  optionDescription: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateFontScale(20),
  },
  optionBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(14),
    marginTop: moderateScale(4),
  },
  optionBadgeText: {
    fontSize: moderateFontScale(11),
    fontWeight: '700' as const,
    color: Colors.background,
  },
  form: {
    gap: moderateScale(18),
  },
  inputGroup: {
    gap: moderateScale(6),
  },
  inputLabel: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  inputHint: {
    fontSize: moderateFontScale(11),
    color: Colors.textSecondary,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(14),
    fontSize: moderateFontScale(14),
    color: Colors.text,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
    paddingVertical: moderateScale(18),
  },
  uploadButtonText: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(18),
    padding: moderateScale(28),
    alignItems: 'center',
    gap: moderateScale(14),
    marginTop: moderateScale(14),
  },
  infoTitle: {
    fontSize: moderateFontScale(18),
    fontWeight: '700' as const,
    color: Colors.text,
  },
  infoText: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateFontScale(20),
  },
  successCard: {
    alignItems: 'center',
    gap: moderateScale(18),
    paddingVertical: hp(5),
  },
  successTitle: {
    fontSize: moderateFontScale(24),
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  successText: {
    fontSize: moderateFontScale(14),
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: moderateFontScale(22),
    paddingHorizontal: wp(5),
  },
  submitButton: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    marginTop: moderateScale(6),
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    paddingVertical: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: moderateScale(50),
  },
  submitText: {
    fontSize: moderateFontScale(15),
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
