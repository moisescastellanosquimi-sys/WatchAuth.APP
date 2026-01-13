import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Platform,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon, Sparkles, X, CheckCircle, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { analyzeWatch } from '@/services/watch-analysis';
import { moderateScale, moderateFontScale, wp, hp } from '@/utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = SCREEN_WIDTH * 0.75;

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  
  const analysisMutation = useMutation({
    mutationFn: async (uri: string) => {
      console.log('Starting watch analysis for image:', uri);
      const result = await analyzeWatch(uri, i18n.language);
      console.log('Analysis complete:', result);
      return result;
    },
    onSuccess: (data) => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      router.push({
        pathname: '/results' as any,
        params: { data: JSON.stringify(data) },
      });
    },
    onError: (error) => {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      console.error('Analysis error:', error);
      
      let errorMessage = t('errors.analysisGeneric');
      
      if (error instanceof Error) {
        if (error.message.includes('empty')) {
          errorMessage = t('errors.emptyImage');
        } else if (error.message.includes('process image') || error.message.includes('conversion')) {
          errorMessage = t('errors.imageProcessing');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = t('errors.networkIssue');
        } else if (error.message.includes('timeout')) {
          errorMessage = t('errors.timeout');
        }
      }
      
      alert(errorMessage);
    },
  });

  const pickImage = async (source: 'camera' | 'library') => {
    console.log('Picking image from:', source);
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      let result;

      if (source === 'camera') {
        router.push('/camera-capture');
        return;
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          alert('Photo library permission is required to select images.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
          aspect: [1, 1],
          mediaTypes: 'images' as any,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        console.log('Image selected:', uri);
        console.log('Image dimensions:', result.assets[0].width, 'x', result.assets[0].height);
        console.log('Image type:', result.assets[0].type);
        
        if (!uri) {
          console.error('No URI in result');
          alert(t('errors.noImageSelected'));
          return;
        }
        
        setSelectedImage(uri);
        setShowPreviewModal(true);
      } else {
        console.log('Image selection cancelled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to select image. Please try again.');
    }
  };

  const handleConfirmImage = () => {
    if (selectedImage) {
      setShowPreviewModal(false);
      analysisMutation.mutate(selectedImage);
    }
  };

  const handleCancelPreview = () => {
    setShowPreviewModal(false);
    setSelectedImage(null);
  };

  const handleRetakeImage = () => {
    setShowPreviewModal(false);
    setSelectedImage(null);
    setTimeout(() => pickImage('library'), 300);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={[styles.content, { paddingBottom: 16 }]}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Sparkles size={moderateScale(28)} color={Colors.gold} strokeWidth={2} />
              </View>
            </View>
            <Text style={styles.title}>WatchAuth</Text>
            <Text style={styles.subtitle}>{t('discover.scanWatch')}</Text>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.featureList}>
              <FeatureItem 
                text={t('home.feature1')}
              />
              <FeatureItem 
                text={t('home.feature2')}
              />
              <FeatureItem 
                text={t('home.feature3')}
              />
            </View>

            {analysisMutation.isPending ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.gold} />
                <Text style={styles.loadingText}>{t('watchAnalysis.analyzing')}</Text>
                <Text style={styles.loadingSubtext}>
                  {t('home.analyzingSubtext')}
                </Text>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.primaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => pickImage('camera')}
                >
                  <LinearGradient
                    colors={[Colors.gold, Colors.goldDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Camera size={moderateScale(22)} color={Colors.background} strokeWidth={2.5} />
                    <Text style={styles.primaryButtonText}>{t('discover.takePhoto')}</Text>
                  </LinearGradient>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.secondaryButton,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => pickImage('library')}
                >
                  <ImageIcon size={moderateScale(20)} color={Colors.gold} strokeWidth={2} />
                  <Text style={styles.secondaryButtonText}>{t('discover.chooseFromLibrary')}</Text>
                </Pressable>

                <Modal
                  visible={showPreviewModal}
                  transparent
                  animationType="fade"
                  onRequestClose={handleCancelPreview}
                >
                  <View style={styles.previewModalOverlay}>
                    <View style={styles.previewModalContent}>
                      <View style={styles.previewHeader}>
                        <Pressable
                          style={styles.previewCloseButton}
                          onPress={handleCancelPreview}
                        >
                          <X size={moderateScale(22)} color={Colors.text} strokeWidth={2} />
                        </Pressable>
                        <Text style={styles.previewTitle}>{t('camera.confirmImage')}</Text>
                        <View style={styles.previewHeaderSpacer} />
                      </View>

                      <View style={styles.previewImageContainer}>
                        {selectedImage && (
                          <Image
                            source={{ uri: selectedImage }}
                            style={styles.previewImage}
                            resizeMode="contain"
                          />
                        )}
                        <View style={styles.previewGuideOverlay}>
                          <View style={styles.previewGuideCircle} />
                        </View>
                      </View>

                      <View style={styles.previewTipsContainer}>
                        <Text style={styles.previewTipsTitle}>{t('camera.checkImage')}</Text>
                        <Text style={styles.previewTipsText}>{t('camera.checkImageTips')}</Text>
                      </View>

                      <View style={styles.previewActions}>
                        <Pressable
                          style={({ pressed }) => [
                            styles.previewRetakeButton,
                            pressed && styles.buttonPressed,
                          ]}
                          onPress={handleRetakeImage}
                        >
                          <RotateCcw size={moderateScale(18)} color={Colors.gold} strokeWidth={2} />
                          <Text style={styles.previewRetakeText}>{t('camera.chooseAnother')}</Text>
                        </Pressable>

                        <Pressable
                          style={({ pressed }) => [
                            styles.previewConfirmButton,
                            pressed && styles.buttonPressed,
                          ]}
                          onPress={handleConfirmImage}
                        >
                          <LinearGradient
                            colors={[Colors.gold, Colors.goldDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.previewConfirmGradient}
                          >
                            <CheckCircle size={moderateScale(18)} color={Colors.background} strokeWidth={2.5} />
                            <Text style={styles.previewConfirmText}>{t('camera.analyzeNow')}</Text>
                          </LinearGradient>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('home.poweredBy')}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureDot} />
      <Text style={styles.featureText}>{text}</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: wp(6),
  },
  header: {
    alignItems: 'center',
    paddingTop: hp(2),
    paddingBottom: hp(1),
  },
  logoContainer: {
    marginBottom: moderateScale(16),
  },
  logoCircle: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: moderateFontScale(32),
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: moderateScale(6),
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: moderateFontScale(14),
    color: Colors.gold,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    gap: moderateScale(24),
  },
  featureList: {
    gap: moderateScale(14),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(14),
  },
  featureDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: Colors.gold,
  },
  featureText: {
    fontSize: moderateFontScale(15),
    color: Colors.textSecondary,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: moderateScale(14),
    paddingVertical: moderateScale(36),
  },
  loadingText: {
    fontSize: moderateFontScale(16),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  loadingSubtext: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
  },
  buttonContainer: {
    gap: moderateScale(14),
  },
  primaryButton: {
    borderRadius: moderateScale(14),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(18),
    paddingHorizontal: moderateScale(28),
    gap: moderateScale(10),
  },
  primaryButtonText: {
    fontSize: moderateFontScale(16),
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(18),
    paddingHorizontal: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.gold,
    gap: moderateScale(10),
  },
  secondaryButtonText: {
    fontSize: moderateFontScale(15),
    fontWeight: '600' as const,
    color: Colors.gold,
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalContent: {
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(20),
    width: '92%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  previewCloseButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(18),
    backgroundColor: Colors.surfaceLight,
  },
  previewTitle: {
    fontSize: moderateFontScale(16),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  previewHeaderSpacer: {
    width: moderateScale(36),
  },
  previewImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewGuideOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  previewGuideCircle: {
    width: PREVIEW_SIZE * 0.75,
    height: PREVIEW_SIZE * 0.75,
    borderRadius: PREVIEW_SIZE * 0.375,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.5)',
    borderStyle: 'dashed',
  },
  previewTipsContainer: {
    padding: moderateScale(16),
    backgroundColor: Colors.surfaceLight,
  },
  previewTipsTitle: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.gold,
    marginBottom: moderateScale(6),
  },
  previewTipsText: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
    lineHeight: moderateFontScale(18),
  },
  previewActions: {
    flexDirection: 'row',
    gap: moderateScale(12),
    padding: moderateScale(16),
  },
  previewRetakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    paddingVertical: moderateScale(14),
    borderRadius: moderateScale(12),
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  previewRetakeText: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  previewConfirmButton: {
    flex: 1.5,
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  previewConfirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
    paddingVertical: moderateScale(14),
  },
  previewConfirmText: {
    fontSize: moderateFontScale(14),
    fontWeight: '700' as const,
    color: Colors.background,
  },
  footer: {
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  footerText: {
    fontSize: moderateFontScale(11),
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
});
