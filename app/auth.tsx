import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Sparkles, Mail, Lock, User, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { useLanguage, LANGUAGES } from '@/contexts/language-context';
import { moderateScale, moderateFontScale, wp, hp } from '@/utils/responsive';

export default function AuthScreen() {
  const { t } = useTranslation();
  const { login, signup } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const handleSubmit = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setError('');
    setIsLoading(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(email, password);
      } else {
        if (!name.trim()) {
          setError(t('auth.fullName'));
          setIsLoading(false);
          return;
        }
        result = await signup(email, password, name);
      }

      if (result.success) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        router.replace('/(tabs)' as any);
      } else {
        setError('error' in result ? result.error || t('auth.invalidCredentials') : t('auth.invalidCredentials'));
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }
    } catch {
      setError(t('common.error'));
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  };

  const fillDemo = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setEmail('demo@watchauth.com');
    setPassword('demo123');
    setName('Watch Collector');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Sparkles size={moderateScale(36)} color={Colors.gold} strokeWidth={2} />
                </View>
              </View>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setShowLanguageMenu(!showLanguageMenu);
                }}
                style={styles.languageButton}
              >
                <Globe size={moderateScale(18)} color={Colors.gold} />
              </Pressable>

              <Text style={styles.title}>WatchAuth</Text>
              <Text style={styles.subtitle}>
                {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
              </Text>

              {showLanguageMenu && (
                <View style={styles.languageMenu}>
                  {LANGUAGES.map((lang) => (
                    <Pressable
                      key={lang.code}
                      onPress={() => {
                        if (Platform.OS !== 'web') {
                          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }
                        changeLanguage(lang.code);
                        setShowLanguageMenu(false);
                      }}
                      style={[
                        styles.languageItem,
                        currentLanguage === lang.code && styles.languageItemActive,
                      ]}
                    >
                      <Text style={[
                        styles.languageText,
                        currentLanguage === lang.code && styles.languageTextActive,
                      ]}>
                        {lang.nativeName}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.form}>
              {mode === 'signup' && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <User size={moderateScale(18)} color={Colors.textSecondary} />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.fullName')}
                    placeholderTextColor={Colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Mail size={moderateScale(18)} color={Colors.textSecondary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.email')}
                  placeholderTextColor={Colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Lock size={moderateScale(18)} color={Colors.textSecondary} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.password')}
                  placeholderTextColor={Colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                />
              </View>

              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : null}

              <Pressable
                onPress={handleSubmit}
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
                    <Text style={styles.submitText}>
                      {mode === 'login' ? t('auth.signIn') : t('auth.signUp')}
                    </Text>
                  )}
                </LinearGradient>
              </Pressable>

              <Pressable
                onPress={fillDemo}
                style={({ pressed }) => [
                  styles.demoButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.demoText}>Fill Demo Credentials</Text>
              </Pressable>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                onPress={toggleMode}
                style={({ pressed }) => [
                  styles.toggleButton,
                  pressed && styles.buttonPressed,
                ]}
              >
                <Text style={styles.toggleText}>
                  {mode === 'login'
                    ? t('auth.dontHaveAccount') + ' '
                    : t('auth.alreadyHaveAccount') + ' '}
                  <Text style={styles.toggleTextBold}>
                    {mode === 'login' ? t('auth.signUp') : t('auth.signIn')}
                  </Text>
                </Text>
              </Pressable>

              <Text style={styles.note}>
                Demo accounts:{'\n'}
                demo@watchauth.com{'\n'}
                premium@watchauth.com
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: wp(6),
    paddingVertical: hp(4),
  },
  header: {
    alignItems: 'center',
    marginBottom: moderateScale(32),
  },
  logoContainer: {
    marginBottom: moderateScale(16),
  },
  logoCircle: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateFontScale(28),
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: moderateScale(6),
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: moderateFontScale(14),
    color: Colors.textSecondary,
  },
  form: {
    gap: moderateScale(14),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: moderateScale(14),
    height: moderateScale(50),
  },
  inputIcon: {
    marginRight: moderateScale(10),
  },
  input: {
    flex: 1,
    fontSize: moderateFontScale(14),
    color: Colors.text,
  },
  error: {
    color: Colors.danger,
    fontSize: moderateFontScale(12),
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    marginTop: moderateScale(6),
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
  demoButton: {
    paddingVertical: moderateScale(10),
    alignItems: 'center',
  },
  demoText: {
    fontSize: moderateFontScale(12),
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScale(6),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: moderateScale(14),
    fontSize: moderateFontScale(12),
    color: Colors.textTertiary,
  },
  toggleButton: {
    paddingVertical: moderateScale(10),
    alignItems: 'center',
  },
  toggleText: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  toggleTextBold: {
    fontWeight: '700' as const,
    color: Colors.gold,
  },
  note: {
    fontSize: moderateFontScale(10),
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: moderateFontScale(16),
    marginTop: moderateScale(14),
  },
  buttonPressed: {
    opacity: 0.7,
  },
  languageButton: {
    position: 'absolute' as const,
    top: 0,
    right: 0,
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  languageMenu: {
    marginTop: moderateScale(14),
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    width: '100%',
  },
  languageItem: {
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(18),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  languageItemActive: {
    backgroundColor: Colors.gold + '20',
  },
  languageText: {
    fontSize: moderateFontScale(14),
    color: Colors.text,
    textAlign: 'center',
  },
  languageTextActive: {
    color: Colors.gold,
    fontWeight: '600' as const,
  },
});
