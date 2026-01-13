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
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Camera, Upload, Package, FileText, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';

import Colors from '@/constants/colors';

type Step = 'watch_photo' | 'serial_number' | 'box_papers' | 'pricing' | 'description' | 'complete';

export default function ListWatchScreen() {
  const [step, setStep] = useState<Step>('watch_photo');
  const [watchPhoto, setWatchPhoto] = useState<string | null>(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [hasBoxPapers, setHasBoxPapers] = useState<boolean | null>(null);
  const [boxPhoto, setBoxPhoto] = useState<string | null>(null);
  const [papersPhoto, setPapersPhoto] = useState<string | null>(null);
  const [priceWithBox, setPriceWithBox] = useState('');
  const [priceWithoutBox, setPriceWithoutBox] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (setter: (uri: string) => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const takePhoto = async (setter: (uri: string) => void) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setter(result.assets[0].uri);
    }
  };

  const handleWatchPhotoNext = () => {
    if (!watchPhoto) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStep('serial_number');
  };

  const handleSerialNumberNext = () => {
    if (!serialNumber.trim()) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStep('box_papers');
  };

  const handleBoxPapersChoice = (choice: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setHasBoxPapers(choice);
    if (!choice) {
      setStep('pricing');
    }
  };

  const handleBoxPapersNext = () => {
    if (!boxPhoto || !papersPhoto) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStep('pricing');
  };

  const handlePricingNext = () => {
    if (hasBoxPapers && !priceWithBox.trim()) return;
    if (!hasBoxPapers && (!priceWithBox.trim() || !priceWithoutBox.trim())) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setStep('description');
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
            <ArrowLeft size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>List Watch for Sale</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step === 'watch_photo' && (
            <View style={styles.content}>
              <Text style={styles.title}>Watch Photo</Text>
              <Text style={styles.subtitle}>
                Upload a clear photo of your watch for verification
              </Text>

              {watchPhoto ? (
                <View style={styles.photoPreview}>
                  <Image source={{ uri: watchPhoto }} style={styles.photoImage} />
                  <Pressable
                    onPress={() => pickImage(setWatchPhoto)}
                    style={({ pressed }) => [
                      styles.changePhotoButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.changePhotoText}>Change Photo</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <Pressable
                    onPress={() => takePhoto(setWatchPhoto)}
                    style={({ pressed }) => [
                      styles.photoButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Camera size={32} color={Colors.gold} strokeWidth={2} />
                    <Text style={styles.photoButtonText}>Take Photo</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => pickImage(setWatchPhoto)}
                    style={({ pressed }) => [
                      styles.photoButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Upload size={32} color={Colors.gold} strokeWidth={2} />
                    <Text style={styles.photoButtonText}>Upload from Gallery</Text>
                  </Pressable>
                </View>
              )}

              {watchPhoto && (
                <Pressable
                  onPress={handleWatchPhotoNext}
                  style={({ pressed }) => [
                    styles.nextButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <LinearGradient
                    colors={[Colors.gold, Colors.goldDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.nextGradient}
                  >
                    <Text style={styles.nextText}>Continue</Text>
                  </LinearGradient>
                </Pressable>
              )}
            </View>
          )}

          {step === 'serial_number' && (
            <View style={styles.content}>
              <Text style={styles.title}>Serial Number</Text>
              <Text style={styles.subtitle}>
                Enter your watch&apos;s serial number for authenticity verification
              </Text>

              <View style={styles.form}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter serial number"
                  placeholderTextColor={Colors.textTertiary}
                  value={serialNumber}
                  onChangeText={setSerialNumber}
                  autoCapitalize="characters"
                />
                <Text style={styles.hint}>
                  Usually found on the case back or between the lugs
                </Text>
              </View>

              <Pressable
                onPress={handleSerialNumberNext}
                disabled={!serialNumber.trim()}
                style={({ pressed }) => [
                  styles.nextButton,
                  pressed && styles.buttonPressed,
                  !serialNumber.trim() && styles.nextButtonDisabled,
                ]}
              >
                <LinearGradient
                  colors={[Colors.gold, Colors.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>Continue</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {step === 'box_papers' && hasBoxPapers === null && (
            <View style={styles.content}>
              <Text style={styles.title}>Box & Papers</Text>
              <Text style={styles.subtitle}>
                Do you have the original box and papers?
              </Text>

              <View style={styles.choiceContainer}>
                <Pressable
                  onPress={() => handleBoxPapersChoice(true)}
                  style={({ pressed }) => [
                    styles.choiceCard,
                    pressed && styles.choiceCardPressed,
                  ]}
                >
                  <Package size={48} color={Colors.gold} strokeWidth={2} />
                  <Text style={styles.choiceTitle}>Yes, I have them</Text>
                  <Text style={styles.choiceDescription}>
                    Box and papers increase value significantly
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleBoxPapersChoice(false)}
                  style={({ pressed }) => [
                    styles.choiceCard,
                    pressed && styles.choiceCardPressed,
                  ]}
                >
                  <FileText size={48} color={Colors.textSecondary} strokeWidth={2} />
                  <Text style={styles.choiceTitle}>No, watch only</Text>
                  <Text style={styles.choiceDescription}>
                    You&apos;ll set a different price without box & papers
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === 'box_papers' && hasBoxPapers === true && (
            <View style={styles.content}>
              <Text style={styles.title}>Upload Box & Papers</Text>
              <Text style={styles.subtitle}>
                Please provide photos of the original box and papers
              </Text>

              <View style={styles.uploadSection}>
                <View style={styles.uploadGroup}>
                  <Text style={styles.uploadLabel}>Box Photo</Text>
                  {boxPhoto ? (
                    <View style={styles.uploadedPreview}>
                      <Image source={{ uri: boxPhoto }} style={styles.uploadedImage} />
                      <Pressable
                        onPress={() => pickImage(setBoxPhoto)}
                        style={({ pressed }) => [
                          styles.changeButton,
                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <Text style={styles.changeButtonText}>Change</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => pickImage(setBoxPhoto)}
                      style={({ pressed }) => [
                        styles.uploadBox,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Upload size={24} color={Colors.gold} />
                      <Text style={styles.uploadBoxText}>Upload Box Photo</Text>
                    </Pressable>
                  )}
                </View>

                <View style={styles.uploadGroup}>
                  <Text style={styles.uploadLabel}>Papers Photo</Text>
                  {papersPhoto ? (
                    <View style={styles.uploadedPreview}>
                      <Image source={{ uri: papersPhoto }} style={styles.uploadedImage} />
                      <Pressable
                        onPress={() => pickImage(setPapersPhoto)}
                        style={({ pressed }) => [
                          styles.changeButton,
                          pressed && styles.buttonPressed,
                        ]}
                      >
                        <Text style={styles.changeButtonText}>Change</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => pickImage(setPapersPhoto)}
                      style={({ pressed }) => [
                        styles.uploadBox,
                        pressed && styles.buttonPressed,
                      ]}
                    >
                      <Upload size={24} color={Colors.gold} />
                      <Text style={styles.uploadBoxText}>Upload Papers Photo</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <Pressable
                onPress={handleBoxPapersNext}
                disabled={!boxPhoto || !papersPhoto}
                style={({ pressed }) => [
                  styles.nextButton,
                  pressed && styles.buttonPressed,
                  (!boxPhoto || !papersPhoto) && styles.nextButtonDisabled,
                ]}
              >
                <LinearGradient
                  colors={[Colors.gold, Colors.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>Continue</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {step === 'pricing' && (
            <View style={styles.content}>
              <Text style={styles.title}>Set Your Price</Text>
              <Text style={styles.subtitle}>
                {hasBoxPapers
                  ? 'Enter your asking price with box and papers'
                  : 'Set different prices for with and without box & papers'}
              </Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {hasBoxPapers ? 'Price (with box & papers)' : 'Price with box & papers'}
                  </Text>
                  <View style={styles.priceInput}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                      style={styles.priceTextInput}
                      placeholder="0"
                      placeholderTextColor={Colors.textTertiary}
                      value={priceWithBox}
                      onChangeText={setPriceWithBox}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {!hasBoxPapers && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Price without box & papers</Text>
                    <View style={styles.priceInput}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.priceTextInput}
                        placeholder="0"
                        placeholderTextColor={Colors.textTertiary}
                        value={priceWithoutBox}
                        onChangeText={setPriceWithoutBox}
                        keyboardType="numeric"
                      />
                    </View>
                    <Text style={styles.hint}>
                      Typically 10-20% lower than price with box & papers
                    </Text>
                  </View>
                )}
              </View>

              <Pressable
                onPress={handlePricingNext}
                disabled={
                  hasBoxPapers
                    ? !priceWithBox.trim()
                    : !priceWithBox.trim() || !priceWithoutBox.trim()
                }
                style={({ pressed }) => [
                  styles.nextButton,
                  pressed && styles.buttonPressed,
                  (hasBoxPapers
                    ? !priceWithBox.trim()
                    : !priceWithBox.trim() || !priceWithoutBox.trim()) &&
                    styles.nextButtonDisabled,
                ]}
              >
                <LinearGradient
                  colors={[Colors.gold, Colors.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextGradient}
                >
                  <Text style={styles.nextText}>Continue</Text>
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {step === 'description' && (
            <View style={styles.content}>
              <Text style={styles.title}>Description</Text>
              <Text style={styles.subtitle}>
                Add details about the watch condition and history
              </Text>

              <View style={styles.form}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Describe the watch condition, service history, any included accessories, etc."
                  placeholderTextColor={Colors.textTertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                />
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={isLoading || !description.trim()}
                style={({ pressed }) => [
                  styles.nextButton,
                  pressed && styles.buttonPressed,
                  !description.trim() && styles.nextButtonDisabled,
                ]}
              >
                <LinearGradient
                  colors={[Colors.gold, Colors.goldDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.background} />
                  ) : (
                    <Text style={styles.nextText}>Submit Listing</Text>
                  )}
                </LinearGradient>
              </Pressable>
            </View>
          )}

          {step === 'complete' && (
            <View style={styles.content}>
              <View style={styles.successCard}>
                <CheckCircle size={80} color={Colors.gold} strokeWidth={2} />
                <Text style={styles.successTitle}>Listing Submitted!</Text>
                <Text style={styles.successText}>
                  Your watch listing is under review. We&apos;ll verify the ownership documents
                  and notify you once it&apos;s approved and live.
                </Text>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryTitle}>Listing Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Serial Number:</Text>
                    <Text style={styles.summaryValue}>{serialNumber}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Box & Papers:</Text>
                    <Text style={styles.summaryValue}>{hasBoxPapers ? 'Yes' : 'No'}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Price:</Text>
                    <Text style={styles.summaryValue}>${priceWithBox}</Text>
                  </View>
                  {!hasBoxPapers && priceWithoutBox && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Price (no box):</Text>
                      <Text style={styles.summaryValue}>${priceWithoutBox}</Text>
                    </View>
                  )}
                </View>
                <Pressable
                  onPress={handleComplete}
                  style={({ pressed }) => [
                    styles.nextButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <LinearGradient
                    colors={[Colors.gold, Colors.goldDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.nextGradient}
                  >
                    <Text style={styles.nextText}>Done</Text>
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
  title: {
    fontSize: 28,
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
  photoButtons: {
    gap: 16,
  },
  photoButton: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  photoButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  photoPreview: {
    gap: 16,
  },
  photoImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  changePhotoButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  changePhotoText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
    minHeight: 160,
  },
  hint: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic' as const,
  },
  choiceContainer: {
    gap: 16,
  },
  choiceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  choiceCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  choiceTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  choiceDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  uploadSection: {
    gap: 20,
  },
  uploadGroup: {
    gap: 12,
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  uploadBox: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.gold,
    borderStyle: 'dashed',
    paddingVertical: 32,
    alignItems: 'center',
    gap: 10,
  },
  uploadBoxText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  uploadedPreview: {
    gap: 12,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    backgroundColor: Colors.surface,
  },
  changeButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.gold,
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.gold,
    marginRight: 8,
  },
  priceTextInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  nextButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  nextText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.background,
    letterSpacing: 0.5,
  },
  successCard: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
