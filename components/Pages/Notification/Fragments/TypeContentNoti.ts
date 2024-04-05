import { NotificationContentType } from 'models/notification.models';

export const TypeContentNotification = (
  langLabel: Record<string, string>
): Record<NotificationContentType, string> => ({
  1: langLabel.notification_content_comment,
  2: langLabel.notification_content_mention,
  3: langLabel.notification_content_review,
  4: langLabel.notification_content_reply,
  5: langLabel.notification_content_order,
});
