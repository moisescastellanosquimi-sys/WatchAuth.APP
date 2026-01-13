export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPremium: boolean;
  subscriptionTier?: 'professional' | 'collector' | null;
  sellerType?: 'professional' | 'private' | null;
  sellerVerified: boolean;
  businessDocuments?: string[];
  createdAt: string;
}

export interface WatchItem {
  id: string;
  userId: string;
  brand: string;
  model: string;
  referenceNumber?: string;
  year?: string;
  condition?: string;
  imageUrl: string;
  estimatedValue: {
    min: number;
    max: number;
    currency: string;
  };
  isAuthentic: boolean;
  isPublic: boolean;
  addedAt: string;
}

export interface Listing {
  id: string;
  userId: string;
  watchId: string;
  watch: WatchItem;
  user: User;
  type: 'sell' | 'buy_request';
  price?: number;
  priceWithoutBoxPapers?: number;
  description: string;
  status: 'active' | 'sold' | 'closed';
  isFeatured: boolean;
  ownershipVerification: OwnershipVerification;
  createdAt: string;
}

export interface OwnershipVerification {
  watchPhoto: string;
  serialNumber: string;
  boxPhoto?: string;
  papersPhoto?: string;
  hasBoxPapers: boolean;
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participant: User;
  lastMessage: Message;
  unreadCount: number;
}
