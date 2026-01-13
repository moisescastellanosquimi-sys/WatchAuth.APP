import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { useAuth } from '@/contexts/auth-context';
import { mockConversations, mockMessages } from '@/mocks/data';
import type { Message } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const conversation = mockConversations.find(c => c.id === id);
  const messages = mockMessages.filter(
    m =>
      (m.senderId === user?.id && m.receiverId === conversation?.participantId) ||
      (m.senderId === conversation?.participantId && m.receiverId === user?.id)
  );

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.back();
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    console.log('Sending message:', message);
    setMessage('');
  };

  if (!conversation) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
          style={StyleSheet.absoluteFillObject}
        />
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.errorText}>Conversation not found</Text>
        </SafeAreaView>
      </View>
    );
  }

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
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <ArrowLeft size={24} color={Colors.gold} />
          </Pressable>
          <Text style={styles.headerTitle}>{conversation.participant.name}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.senderId === user?.id}
                showTimestamp={
                  index === 0 ||
                  new Date(msg.timestamp).getTime() -
                    new Date(messages[index - 1].timestamp).getTime() >
                    300000
                }
              />
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={Colors.textTertiary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
            />
            <Pressable
              onPress={handleSend}
              disabled={!message.trim()}
              style={({ pressed }) => [
                styles.sendButton,
                !message.trim() && styles.sendButtonDisabled,
                pressed && styles.buttonPressed,
              ]}
            >
              <Send size={20} color={message.trim() ? Colors.gold : Colors.textTertiary} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function MessageBubble({
  message,
  isOwn,
  showTimestamp,
}: {
  message: Message;
  isOwn: boolean;
  showTimestamp: boolean;
}) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.messageContainer}>
      {showTimestamp && (
        <Text style={styles.timestamp}>
          {new Date(message.timestamp).toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      )}
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.messageText, isOwn && styles.messageTextOwn]}>
          {message.text}
        </Text>
        <Text style={[styles.messageTime, isOwn && styles.messageTimeOwn]}>
          {time}
        </Text>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  headerSpacer: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 12,
  },
  messageContainer: {
    gap: 8,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginVertical: 8,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    gap: 4,
  },
  bubbleOwn: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.gold,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: Colors.background,
  },
  messageTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    alignSelf: 'flex-end',
  },
  messageTimeOwn: {
    color: Colors.background,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 40,
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
