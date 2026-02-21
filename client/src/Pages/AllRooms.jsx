import React, { useState, useMemo } from 'react'
import { facilityIcons } from '../assets/assets'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StarRating from '../Components/StarRating'
import { assets } from '../assets/assets'
import { useAppContext } from '../Context/AppContext'


const CheckBox = ({label, selected=false, onChange=()=> {} })=>{
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type="checkbox" checked={selected}
        onChange={(e)=>onChange(e.target.checked,label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}

const RadioButton = ({label, selected=false, onChange=()=> {} })=>{
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type="radio" name="sortOption"
        checked={selected}
        onChange={()=>onChange(label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  )
}


const AllRooms = () => {

  const navigate = useNavigate()
  const { rooms, currency } = useAppContext()
  const [searchParams,setSearchParams] = useSearchParams()

  const [selectedFilters,setSelectedFilters] = useState({
    roomType:[],
    priceRange:[]
  })

  const [selectedSort,setSelectedSort] = useState('')

  const roomTypes=[
    "Single Bed","Double Bed","Luxury Room","Family Suite"
  ]

  const priceRanges=[
    '1000 to 2000','2000 to 3000','3000 to 4000','5000 to 8000'
  ]

  const sortOptions=[
    "Price Low to High","Price High to Low","Newest First"
  ]

  const handleFilterChange=(checked,value,type)=>{
    setSelectedFilters(prev=>{
      const updated={...prev}
      if(checked) updated[type].push(value)
      else updated[type]=updated[type].filter(i=>i!==value)
      return updated
    })
  }

  const handleSortChange=(value)=>setSelectedSort(value)

  const matchesRoomType=(room)=>
    selectedFilters.roomType.length===0 ||
    selectedFilters.roomType.includes(room.roomType)

  const matchesPriceRange=(room)=>
    selectedFilters.priceRange.length===0 ||
    selectedFilters.priceRange.some(range=>{
      const [min,max]=range.split(' to ').map(Number)
      return room.pricePerNight>=min && room.pricePerNight<=max
    })

  const sortRooms=(a,b)=>{
    if(selectedSort==='Price Low to High') return a.pricePerNight-b.pricePerNight
    if(selectedSort==='Price High to Low') return b.pricePerNight-a.pricePerNight
    if(selectedSort==='Newest First') return new Date(b.createdAt)-new Date(a.createdAt)
    return 0
  }

  const filterDestination=(room)=>{
    const dest=searchParams.get('destination')
    if(!dest) return true
    return room.hotel.city.toLowerCase().includes(dest.toLowerCase())
      || room.hotel.name.toLowerCase().includes(dest.toLowerCase())
  }

  const filteredRooms=useMemo(()=>{
    return rooms
      .filter(r=>matchesRoomType(r)&&matchesPriceRange(r)&&filterDestination(r))
      .sort(sortRooms)
  },[rooms,selectedFilters,selectedSort,searchParams])


  return (

  <div className='pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32'>

    <div className='flex flex-col lg:flex-row gap-8'>

      {/* LEFT ROOM LIST */}
      <div className='flex-1'>

        {filteredRooms.map(room=>(
          <div key={room._id}
            className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300'>

            <img
              onClick={()=>navigate(`/rooms/${room._id}`)}
              src={room.images[0]}
              className='max-h-64 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
            />

            <div className='md:w-1/2 flex flex-col gap-2'>

              <p className='text-gray-500'>{room.hotel.city}</p>

              <p onClick={()=>navigate(`/rooms/${room._id}`)}
                className='text-gray-800 text-3xl font-playfair cursor-pointer'>
                {room.hotel.name}
              </p>

              <div className='flex items-center'>
                <StarRating/>
                <p className='ml-2'>200+ Reviews</p>
              </div>

              <div className='flex flex-wrap mt-3 mb-6 gap-4'>
                {room.amenities.map((item,i)=>(
                  <div key={i}
                    className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                    <img src={facilityIcons[item]} className='w-5 h-5'/>
                    <p className='text-xs'>{item}</p>
                  </div>
                ))}
              </div>

              <p className='text-xl font-medium text-gray-700'>
                ₹{room.pricePerNight}/night
              </p>

            </div>

          </div>
        ))}

      </div>


      {/* RIGHT FILTER PANEL */}
      <div className='lg:w-80 w-full'>

        <div className='bg-white border border-gray-300 text-gray-600'>

          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular Filters</p>

            {roomTypes.map((room,i)=>(
              <CheckBox key={i}
                label={room}
                selected={selectedFilters.roomType.includes(room)}
                onChange={(c)=>handleFilterChange(c,room,'roomType')}
              />
            ))}
          </div>


          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>

            {priceRanges.map((range,i)=>(
              <CheckBox key={i}
                label={`₹${range}`}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(c)=>handleFilterChange(c,range,'priceRange')}
              />
            ))}
          </div>


          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>

            {sortOptions.map((option,i)=>(
              <RadioButton key={i}
                label={option}
                selected={selectedSort===option}
                onChange={()=>handleSortChange(option)}
              />
            ))}
          </div>

        </div>

      </div>

    </div>

  </div>

  )
}

export default AllRooms