import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, facilityIcons, roomCommonData } from '../assets/assets'
import StarRating from '../Components/StarRating'
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'

const RoomDetails = () => {

    const {id} = useParams()

    // ✅ FIX spelling (navigate not naviagate)
    const {rooms,getToken,axios,navigate}=useAppContext();

    const [room, setRoom] = useState(null)
    const [mainImage, setMainImage] = useState(null)

    // ✅ use "" not null for date inputs
    const [checkInDate, setCheckInDate] = useState("")
    const [checkOutDate, setCheckOutDate] = useState("")

    const [guests, setGuests] = useState(1);
    const [isAvailable, setIsAvailable] = useState(false);


    // ================= CHECK AVAILABILITY =================
    const checkAvailability = async () => {

        try {

            if(checkInDate >= checkOutDate){
                toast.error("Check-Out date must be after Check-In date")
                return;
            }

            const {data}=await axios.post('/api/bookings/check-availability',{
                room:id,
                checkInDate,
                checkOutDate
            })

            if(data.success){
                if(data.isAvailable){
                    setIsAvailable(true);
                    toast.success("Room is available! Proceed to book.")
                }
                else{
                    setIsAvailable(false);
                    toast.error("Room not available")
                }
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    // ================= BOOK =================
    const onSubmitHandler = async (e) => {

        e.preventDefault();

        try {

            if(!isAvailable){
                return checkAvailability();
            }

            const {data}=await axios.post(
                '/api/bookings/book',
                {room:id,checkInDate,checkOutDate,guests,paymentMethod:"Pay at hotel"},
                {headers:{Authorization:`Bearer ${await getToken()}`}}
            );

            if(data.success){
                toast.success("Booking successful!")
                navigate('/my-bookings')
                scrollTo(0,0)
            }else{
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }


    // ================= LOAD ROOM =================
    useEffect(()=>{
       const found = rooms.find(r => r._id === id)
       if(found){
           setRoom(found)
           setMainImage(found.images[0])
       }
    },[rooms,id])


    // ================= UI =================
    return room && (

    <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>

        {/* TITLE */}
        <h1 className='text-3xl md:text-4xl font-playfair'>
            {room.hotel.name}
            <span className='text-sm'> ({room.roomType})</span>
        </h1>

        {/* IMAGES */}
        <div className='flex flex-col lg:flex-row mt-6 gap-6'>
            <img src={mainImage} className='lg:w-1/2 rounded-xl'/>

            <div className='grid grid-cols-2 gap-4 lg:w-1/2'>
                {room.images.map((img,i)=>(
                    <img
                        key={i}
                        src={img}
                        onClick={()=>setMainImage(img)}
                        className='rounded-xl cursor-pointer'
                    />
                ))}
            </div>
        </div>

        {/* PRICE */}
        <p className='text-2xl mt-6'>₹{room.pricePerNight}</p>


        {/* ================= BOOKING FORM ================= */}

        <form onSubmit={onSubmitHandler}
        className='flex flex-col md:flex-row items-center justify-between bg-white shadow p-6 rounded-xl mt-16 max-w-6xl'>

            <div className='flex flex-col md:flex-row gap-6'>

                {/* CHECKIN */}
                <div>
                    <label>Check-In</label>
                    <input
                        type="date"
                        value={checkInDate}
                        onChange={(e)=>setCheckInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className='border px-3 py-2 rounded'
                        required
                    />
                </div>

                {/* CHECKOUT */}
                <div>
                    <label>Check-Out</label>

                    {/* ✅ FIX: removed WRONG disabled={checkInDate} */}
                    <input
                        type="date"
                        value={checkOutDate}
                        onChange={(e)=>setCheckOutDate(e.target.value)}
                        min={checkInDate || new Date().toISOString().split('T')[0]}
                        className='border px-3 py-2 rounded'
                        required
                    />
                </div>

                {/* GUESTS */}
                <div>
                    <label>Guests</label>
                    <input
                        type="number"
                        value={guests}
                        onChange={(e)=>setGuests(e.target.value)}
                        className='border px-3 py-2 rounded w-20'
                    />
                </div>

            </div>

            <button className='bg-blue-600 text-white px-8 py-3 rounded mt-4 md:mt-0'>
                {isAvailable ? "Book Now" : "Check Availability"}
            </button>

        </form>

    </div>
  )
}

export default RoomDetails