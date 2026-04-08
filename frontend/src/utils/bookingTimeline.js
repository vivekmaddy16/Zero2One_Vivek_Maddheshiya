export const BOOKING_TIMELINE_STEPS = [
  {
    key: 'pending',
    title: 'Booking Placed',
    description: 'Your request has been submitted.',
  },
  {
    key: 'confirmed',
    title: 'Confirmed',
    description: 'The provider accepted your booking.',
  },
  {
    key: 'in_progress',
    title: 'Provider on the Way',
    description: 'The job is active and moving forward.',
  },
  {
    key: 'completed',
    title: 'Service Finished',
    description: 'The service is done and ready for review.',
  },
];

const STATUS_INDEX = {
  pending: 0,
  confirmed: 1,
  in_progress: 2,
  completed: 3,
  cancelled: 0,
};

export function getBookingTimelineIndex(status) {
  return STATUS_INDEX[status] ?? 0;
}

export function getBookingTimelineHeadline(status) {
  if (status === 'cancelled') {
    return 'Booking Cancelled';
  }

  return BOOKING_TIMELINE_STEPS[getBookingTimelineIndex(status)]?.title || 'Booking Placed';
}

export function getBookingRealtimeMessage(status, role = 'customer') {
  if (role === 'provider') {
    if (status === 'pending') return 'New booking request received';
    if (status === 'cancelled') return 'A customer cancelled a booking';
    return `Booking moved to ${getBookingTimelineHeadline(status).toLowerCase()}`;
  }

  if (status === 'confirmed') return 'Your booking has been confirmed';
  if (status === 'in_progress') return 'Provider is on the way';
  if (status === 'completed') return 'Your service has been marked finished';
  if (status === 'cancelled') return 'This booking was cancelled';
  return 'Booking placed successfully';
}
