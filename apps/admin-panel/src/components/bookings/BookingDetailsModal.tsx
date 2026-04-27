import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import type { Booking } from '../../types/booking.types';

interface BookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  if (!booking) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <div className="bg-primary-600 px-6 py-4 text-white">
                  <Dialog.Title className="text-xl font-semibold">
                    Booking Details
                  </Dialog.Title>
                  <p className="text-sm text-primary-100 mt-1">
                    Confirmation: {booking.confirmationNumber}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Guest Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Name</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {booking.guest.firstName} {booking.guest.lastName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Email</dt>
                          <dd className="text-sm text-gray-900">{booking.guest.email}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Phone</dt>
                          <dd className="text-sm text-gray-900">{booking.guest.phone}</dd>
                        </div>
                        {booking.guest.address && (
                          <div>
                            <dt className="text-xs text-gray-500">Address</dt>
                            <dd className="text-sm text-gray-900">
                              {booking.guest.address}
                              {booking.guest.city && `, ${booking.guest.city}`}
                              {booking.guest.country && `, ${booking.guest.country}`}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Room Information</h3>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-xs text-gray-500">Room Number</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {booking.room.roomNumber}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Type</dt>
                          <dd className="text-sm text-gray-900">{booking.room.type}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Floor</dt>
                          <dd className="text-sm text-gray-900">{booking.room.floor}</dd>
                        </div>
                        {booking.room.viewType && (
                          <div>
                            <dt className="text-xs text-gray-500">View</dt>
                            <dd className="text-sm text-gray-900">{booking.room.viewType}</dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Stay Information</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <dt className="text-xs text-gray-500">Check-in</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatDate(booking.checkInDate)}
                        </dd>
                        {booking.actualCheckInTime && (
                          <dd className="text-xs text-gray-600">
                            {new Date(booking.actualCheckInTime).toLocaleTimeString('en-IN')}
                          </dd>
                        )}
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Check-out</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatDate(booking.checkOutDate)}
                        </dd>
                        {booking.actualCheckOutTime && (
                          <dd className="text-xs text-gray-600">
                            {new Date(booking.actualCheckOutTime).toLocaleTimeString('en-IN')}
                          </dd>
                        )}
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Duration</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {booking.numberOfNights} {booking.numberOfNights === 1 ? 'night' : 'nights'}
                        </dd>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Financial Summary</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Room Rate (per night)</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatCurrency(booking.roomRate)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Subtotal ({booking.numberOfNights} nights)</dt>
                        <dd className="text-sm font-medium text-gray-900">
                          {formatCurrency(parseFloat(booking.roomRate) * booking.numberOfNights)}
                        </dd>
                      </div>
                      {parseFloat(booking.taxAmount) > 0 && (
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-600">Tax</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {formatCurrency(booking.taxAmount)}
                          </dd>
                        </div>
                      )}
                      {parseFloat(booking.discountAmount) > 0 && (
                        <div className="flex justify-between text-green-600">
                          <dt className="text-sm">Discount</dt>
                          <dd className="text-sm font-medium">
                            -{formatCurrency(booking.discountAmount)}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t">
                        <dt className="text-base font-semibold text-gray-900">Total Amount</dt>
                        <dd className="text-base font-bold text-gray-900">
                          {formatCurrency(booking.totalAmount)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Amount Paid</dt>
                        <dd className="text-sm font-medium text-green-600">
                          {formatCurrency(booking.paidAmount)}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-semibold text-gray-700">Balance Due</dt>
                        <dd className="text-sm font-semibold text-red-600">
                          {formatCurrency(parseFloat(booking.totalAmount) - parseFloat(booking.paidAmount))}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {(booking.specialRequests || booking.internalNotes) && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Information</h3>
                      {booking.specialRequests && (
                        <div className="mb-3">
                          <dt className="text-xs text-gray-500 mb-1">Special Requests</dt>
                          <dd className="text-sm text-gray-900 bg-blue-50 p-3 rounded">
                            {booking.specialRequests}
                          </dd>
                        </div>
                      )}
                      {booking.internalNotes && (
                        <div>
                          <dt className="text-xs text-gray-500 mb-1">Internal Notes</dt>
                          <dd className="text-sm text-gray-900 bg-yellow-50 p-3 rounded">
                            {booking.internalNotes}
                          </dd>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'CHECKED_IN' ? 'bg-green-100 text-green-800' :
                          booking.status === 'CHECKED_OUT' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                          booking.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Source: {booking.bookingSource || 'Direct'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
                  >
                    Print Invoice
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
