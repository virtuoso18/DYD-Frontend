export const RESOURCE_TYPES = {
  BUSINESS_SITE: 'business_site',
  PRODUCT: 'product',
  COMMUNITY_POST: 'community_post',
  USER_ROOM_REQUEST: 'user_room_request'
}

export const PERMISSIONS = {
  business_site: ['read', 'update'],
  product: ['create', 'read', 'update', 'delete'],
  community_post: ['create', 'read', 'update', 'delete'],
  user_room_request: ['read', 'update', 'reject', 'process']
}

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
}

export const ACCESS_ACTIONS = {
  GRANTED: 'granted',
  REVOKED: 'revoked',
  REACTIVATED: 'reactivated',
  MODIFIED: 'modified',
  EXPIRED: 'expired'
}

export const PERMISSION_LABELS = {
  read: 'View',
  create: 'Create',
  update: 'Edit',
  delete: 'Delete',
  reject: 'Reject',
  process: 'Process'
}

export const RESOURCE_TYPE_LABELS = {
  business_site: 'Business Site',
  product: 'Products',
  community_post: 'Community Posts',
  user_room_request: 'Room Requests'
}

export const RESOURCE_ICONS = {
  business_site: 'ShopOutlined',
  product: 'AppstoreOutlined',
  community_post: 'MessageOutlined',
  user_room_request: 'HomeOutlined'
}