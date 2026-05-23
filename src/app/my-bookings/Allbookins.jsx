"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL } from "../lib/config";
import { authClient } from "../lib/auth-client";


const Allbookins = () => {
    const [cancelledBookingId, setCancelledBookingId] = useState(null); // Track single cancelled booking ID
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const {data, error} = await authClient.token();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
          {
            cache: "no-store",
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch bookings:", res.status);
          setBookings([]);
          return;
        }

        const datas = await res.json();

        if (Array.isArray(datas)) {
          setBookings(datas);
        } else {
          console.error("API did not return an array:", datas);
          setBookings([]);
        }
      } catch (error) {
        console.log(error);
        setBookings([]);
      }
    };

    fetchBookings();
  }, []);

   
  const handleCancel = async(id) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const {data, error} = await authClient.token();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings-deleting/${id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to cancel booking:", res.status);
        return;
      }

      const datas = await res.json();
      if(datas){
        setCancelledBookingId(id); // Set only the cancelled booking ID
        // Optional: Remove the booking from the list after 2 seconds
        setTimeout(() => {
          setBookings(prevBookings => prevBookings.filter(booking => booking._id !== id));
          setCancelledBookingId(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // SAFE DATE FORMAT
  const formatDate = (dateString) => {
    const date = dateString ? new Date(dateString) : null;
    if (!date || isNaN(date)) return "Invalid date";
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  
  return (
    <div>
      <div className="min-h-screen bg-[#07111F] text-white p-10">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold">My Bookings</h1>
            <p className="text-gray-400 mt-2">
              View and manage your study room reservations
            </p>
          </div>

          {/* BOOKINGS */}
          {bookings.length === 0 ? (
            <div className="text-center text-gray-400 py-20">
              No bookings found
            </div>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-[#0D1B2A] border border-[#1E3550] rounded-2xl p-5 flex justify-between items-center"
                >
                  {/* LEFT */}
                  <div className="flex gap-4">

                    {/* IMAGE */}
                    <div className="relative w-[120px] h-[85px] rounded-xl overflow-hidden bg-gray-800">
                      {booking.image && (
                        <Image
                          src={booking.image}
                          alt={booking.roomName || "Room"}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* CONTENT */}
                    <div>
                      <h2 className="text-2xl font-bold">
                        {booking.roomName}
                      </h2>
                      <p className="text-gray-400">{booking.floor}</p>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-300">
                        <span>📅 {formatDate(booking.date)}</span>
                        <span>
                          🕒 {booking.startTime} – {booking.endTime}
                        </span>
                        <span>💲 ${booking.totalCost}.00 total</span>
                      </div>

                      <p className="italic text-gray-400 mt-3">
                        Note: {booking.specialNote || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex flex-col items-end gap-4">
                    {cancelledBookingId === booking._id ? (
                      <span className="px-4 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
                        ✕ Cancelled
                      </span>
                    ) : (
                      <>
                        <div className="flex gap-6 items-center">
                          <span className="px-4 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">
                            ● Confirmed
                          </span>
                        </div>

                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={isLoading}
                          className="border border-red-500/30 text-red-400 px-5 py-2 rounded-xl hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ✕ Cancel
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Allbookins;