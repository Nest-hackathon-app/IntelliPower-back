import {
  PrismaClient,
  NotificationType,
  NotificationPriority,
  RelatedEntityType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = '49682d79-f0f1-45d0-bbff-6d3fe83f74e9';

  const notifications: Array<{
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    message: string;
    relatedEntityType?: RelatedEntityType;
    relatedEntityId?: string;
  }> = [
    {
      type: NotificationType.SECURITY_ALERT,
      priority: NotificationPriority.high,
      title: 'Sensor Triggered',
      message: 'Motion detected by sensor-1.',
      relatedEntityType: RelatedEntityType.ANOMALY,
      relatedEntityId: 'sensor-1',
    },
    {
      type: NotificationType.TEMPERATURE_ALERT,
      priority: NotificationPriority.medium,
      title: 'Temperature Spike',
      message: 'sensor-2 reported high temperature.',
      relatedEntityType: RelatedEntityType.TEMPERATURE,
      relatedEntityId: 'sensor-2',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.low,
      title: 'Update Available',
      message: 'New firmware update available.',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.medium,
      title: 'New Feature',
      message: 'Real-time monitoring is now enabled.',
    },
    {
      type: NotificationType.SECURITY_ALERT,
      priority: NotificationPriority.medium,
      title: 'Unusual Activity',
      message: 'Unexpected login detected.',
    },
    {
      type: NotificationType.MAINTENANCE_NOTICE,
      priority: NotificationPriority.high,
      title: 'Battery Low',
      message: 'Sensor-1 battery is critically low.',
      relatedEntityType: RelatedEntityType.ELECTRICITY,
      relatedEntityId: 'sensor-1',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.low,
      title: 'Tips & Tricks',
      message: 'How to optimize your sensor placement.',
    },
    {
      type: NotificationType.MAINTENANCE_NOTICE,
      priority: NotificationPriority.low,
      title: 'Maintenance Required',
      message: 'Sensor-2 needs cleaning.',
      relatedEntityType: RelatedEntityType.CAMERA,
      relatedEntityId: 'sensor-2',
    },
    {
      type: NotificationType.SECURITY_ALERT,
      priority: NotificationPriority.critical,
      title: 'Fire Alert',
      message: 'High temperature and smoke detected!',
      relatedEntityType: RelatedEntityType.ANOMALY,
      relatedEntityId: 'sensor-2',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.medium,
      title: 'New Device Connected',
      message: 'Device added to the network.',
    },
    {
      type: NotificationType.SECURITY_ALERT,
      priority: NotificationPriority.critical,
      title: 'Intrusion Detected',
      message: 'Sensor-1 recorded unauthorized entry.',
      relatedEntityType: RelatedEntityType.ANOMALY,
      relatedEntityId: 'sensor-1',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.medium,
      title: 'Connection Lost',
      message: 'sensor-2 lost communication.',
      relatedEntityType: RelatedEntityType.TEMPERATURE,
      relatedEntityId: 'sensor-2',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.low,
      title: 'System Overview',
      message: 'Your system is running smoothly.',
    },
    {
      type: NotificationType.MAINTENANCE_NOTICE,
      priority: NotificationPriority.low,
      title: 'Outdated Firmware',
      message: 'sensor-1 firmware is outdated.',
      relatedEntityType: RelatedEntityType.ELECTRICITY,
      relatedEntityId: 'sensor-1',
    },
    {
      type: NotificationType.POWER_USAGE_ALERT,
      priority: NotificationPriority.high,
      title: 'Power Surge',
      message: 'Voltage spike detected in zone A.',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.medium,
      title: 'Weekly Report',
      message: 'System report for the last 7 days.',
    },
    {
      type: NotificationType.SYSTEM_ALERT,
      priority: NotificationPriority.low,
      title: 'Support',
      message: 'Need help? Contact our support team.',
    },
    {
      type: NotificationType.ACCESS_REQUEST,
      priority: NotificationPriority.medium,
      title: 'Unverified Device',
      message: 'A new device was detected but not verified.',
    },
    {
      type: NotificationType.ANOMALY_DETECTED,
      priority: NotificationPriority.high,
      title: 'Anomaly Detected',
      message: 'Unexpected sensor behavior detected.',
      relatedEntityType: RelatedEntityType.ANOMALY,
      relatedEntityId: 'sensor-1',
    },
    {
      type: NotificationType.MAINTENANCE_NOTICE,
      priority: NotificationPriority.low,
      title: 'Reminder',
      message: 'Don’t forget to test your alarms weekly.',
    },
  ];

  for (const data of notifications) {
    await prisma.notification.create({
      data: {
        ...data,
        read: false,
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  console.log('20 notifications seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
