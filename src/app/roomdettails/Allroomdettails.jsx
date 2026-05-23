"use client";

import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";

import { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import Link from "next/link";
import BookingModal from "@/app/components/Bookinfmodal";
 
import { authClient, useSession } from "@/app/lib/auth-client";

const Allroomdettails = () => {

    
  const params = useParams();
  const id = params.id;
 

  const [room, setRoom] = useState(null);
  
  useEffect(() => {

  const fetchRoom = async () => {

    try {

      // SESSION আনো
      const {data, error} = await authClient.token()

      console.log(data);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/roomdetails/${id}`,
        {
          headers: {
            authorization: `Bearer ${data.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const datas = await res.json();

      setRoom(datas);

    } catch (error) {

      console.log(error);

    } finally {

      

    }
  };

  if (id) {
    fetchRoom();
  }

}, [id]);

  

  // ROOM NOT FOUND
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071426] text-red-500">
        Room not found
      </div>
    );
  }

    return (
        <div>
             <div className="min-h-screen bg-[#071426] text-white p-6">

      {/* Back */}
      <Link href="/rooms">
        <button className="flex items-center gap-2 text-gray-300 mb-6">
          <ArrowLeft size={18} />
          All Rooms
        </button>
      </Link>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Left */}
        <div className="lg:col-span-2">

          {/* Image */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden">
            <Image
              src={
                room.image ||
                "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1600&auto=format&fit=crop"
              }
              alt={room.roomName}
              fill
              className="object-cover"
            />
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mt-8">
            {room.roomName}
          </h1>

          {/* Info */}
          <div className="flex gap-6 mt-5 text-gray-300 flex-wrap">

            <div className="flex items-center gap-2">
              <Calendar size={18} />
              {room.bookings || 0} bookings
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              {room.floor} Floor
            </div>

            <div className="flex items-center gap-2">
              <Users size={18} />
              Up to {room.capacity} people
            </div>

          </div>

          {/* Divider */}
          <div className="border-b border-[#1c2c44] my-8"></div>

          {/* About */}
          <h2 className="text-2xl font-semibold mb-4">
            About this room
          </h2>

          <p className="text-gray-300 leading-8">
            {room.description}
          </p>

          {/* Amenities */}
          <div className="mt-8">

            <h2 className="text-2xl font-semibold mb-4">
              Amenities
            </h2>

            <div className="flex flex-wrap gap-3">

              {room.amenities?.map((item, i) => (
                <span
                  key={i}
                  className="bg-[#0d1b2f] border border-[#1c2c44] px-4 py-2 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}

            </div>
          </div>
        </div>

        {/* Right Card */}
        <div>

          <div className="bg-[#0d1b2f] border border-[#1c2c44] rounded-2xl p-6">

            {/* Price */}
            <div className="flex items-end gap-2">

              <h2 className="text-5xl font-bold">
                ${room.rate}/hr
              </h2>

              <span className="text-gray-400 mb-1">
                /hour
              </span>

            </div>

            {/* Details */}
            <div className="space-y-5 mt-8">

              <div className="flex justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={18} />
                  Floor
                </div>

                <span>{room.floor} Floor</span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Users size={18} />
                  Capacity
                </div>

                <span>Up to {room.capacity}</span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <DollarSign size={18} />
                  Rate
                </div>

                <span>{room.rate}</span>
              </div>

              <div className="flex justify-between">
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={18} />
                  Bookings
                </div>

                <span>{room.bookings || 0}</span>
              </div>

            </div>

            {/* Button */}
            <button className="w-full mt-8 bg-[#e6983c] hover:bg-[#d98928] py-4 rounded-xl font-semibold transition">
            <BookingModal room={room}></BookingModal>
            </button>

          </div>
        </div>

      </div>
    </div>
        </div>
    );
};

export default Allroomdettails;