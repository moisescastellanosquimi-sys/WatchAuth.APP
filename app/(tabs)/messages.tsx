import React from 'react';
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
import { MessageCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { mockConversations } from '@/mocks/data';
import type { Conversation } from '@/types';
import { moderateScale, moderateFontScale, wp, hp } from '@/utils/responsive';

export default function MessagesScreen() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <AuthPrompt />;
  }

  const conversations = mockConversations;

  const handleConversation = (conversationId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/chat/${conversationId}` as any);
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
          <Text style={styles.headerTitle}>{t('messages.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('messages.subtitle')}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {conversations.length === 0 ? (
            <View style={styles.emptyState}>
              <MessageCircle size={moderateScale(56)} color={Colors.textTertiary} strokeWidth={1.5} />
              <Text style={styles.emptyText}>{t('messages.noMessages')}</Text>
              <Text style={styles.emptySubtext}>
                {t('messages.startConversation')}
              </Text>
            </View>
          ) : (
            conversations.map(conversation => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                onPress={() => handleConversation(conversation.id)}
              />
            ))
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
          <MessageCircle size={moderateScale(70)} color={Colors.gold} strokeWidth={1.5} />
          <Text style={styles.authTitle}>{t('messages.signInPrompt')}</Text>
          <Text style={styles.authSubtitle}>
            {t('messages.signInDescription')}
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

function ConversationCard({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) {
  const timeAgo = getTimeAgo(conversation.lastMessage.timestamp);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.conversationCard,
        pressed && styles.conversationCardPressed,
      ]}
    >
      <View style={styles.avatarContainer}>
        {conversation.participant.avatar ? (
          <Image
            source={{ uri: conversation.participant.avatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
          </View>
        )}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.participantName}>
            {conversation.participant.name}
          </Text>
          <Text style={styles.timestamp}>{timeAgo}</Text>
        </View>
        <Text
          style={[
            styles.lastMessage,
            conversation.unreadCount > 0 && styles.lastMessageUnread,
          ]}
          numberOfLines={2}
        >
          {conversation.lastMessage.text}
        </Text>
      </View>
    </Pressable>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString();
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
  },
  headerTitle: {
    fontSize: moderateFontScale(24),
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: moderateScale(3),
  },
  headerSubtitle: {
    fontSize: moderateFontScale(13),
    color: Colors.textSecondary,
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
  conversationCard: {
    flexDirection: 'row',
    padding: moderateScale(14),
    backgroundColor: Colors.surface,
    borderRadius: moderateScale(14),
    marginBottom: moderateScale(10),
    borderWidth: 1,
    borderColor: Colors.border,
  },
  conversationCardPressed: {
    opacity: 0.7,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
  },
  avatarPlaceholder: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: Colors.surfaceLight,
  },
  unreadBadge: {
    position: 'absolute',
    top: moderateScale(-3),
    right: moderateScale(-3),
    backgroundColor: Colors.gold,
    borderRadius: moderateScale(9),
    minWidth: moderateScale(18),
    height: moderateScale(18),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(5),
  },
  unreadText: {
    fontSize: moderateFontScale(9),
    fontWeight: '700' as const,
    color: Colors.background,
  },
  conversationContent: {
    flex: 1,
    marginLeft: moderateScale(10),
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(3),
  },
  participantName: {
    fontSize: moderateFontScale(14),
    fontWeight: '600' as const,
    color: Colors.text,
  },
  timestamp: {
    fontSize: moderateFontScale(10),
    color: Colors.textTertiary,
  },
  lastMessage: {
    fontSize: moderateFontScale(12),
    color: Colors.textSecondary,
    lineHeight: moderateFontScale(18),
  },
  lastMessageUnread: {
    fontWeight: '600' as const,
    color: Colors.text,
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
});
