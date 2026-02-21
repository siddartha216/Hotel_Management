import React, { useEffect, useState } from 'react'
import Title from '../../Components/Title'
import { useAppContext } from '../../Context/AppContext'
import toast from 'react-hot-toast'

const ListRoom = () => {

  const [rooms,setRooms] = useState([])
  const {axios,getToken,user,currency } = useAppContext();

  const fetchRooms = async () => {
    try {
      const {data} = await axios.get(
        '/api/rooms/owner',
        { headers:{ Authorization:`Bearer ${await getToken()}` } }
      );

      if(data.success){
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }

    } catch(error){
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (roomId) => {
    try {
      const {data} = await axios.put(
        `/api/rooms/toggle-availability/${roomId}`,
        {},
        { headers:{ Authorization:`Bearer ${await getToken()}` } }
      );

      if(data.success){
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }

    } catch(error){
      toast.error(error.message);
    }
  };

  useEffect(()=>{
    if(user){
      fetchRooms();
    }
  },[user]);


  return (

    <div>

      <Title
        align='left'
        font='outfit'
        title='Room Listings'
        subTitle='Maintain your listings with precision.'
      />

      <p className='text-gray-500 mt-8'>All Rooms</p>

      <div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3'>

        <table className='w-full'>

          <thead className='bg-gray-50'>
            <tr>
              <th className='py-3 px-3 text-gray-800 font-medium'>Name</th>
              <th className='py-3 px-3 text-gray-800 font-medium max-sm:hidden'>Facility</th>
              <th className='py-3 px-3 text-gray-800 font-medium'>Price per Night</th>
              <th className='py-3 px-3 text-gray-800 font-medium text-center'>Action</th>
            </tr>
          </thead>

          <tbody className='text-sm'>

            {rooms.map((item)=>(
              <tr key={item._id}>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                  {item.roomType}
                </td>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                  {item.amenities.join(', ')}
                </td>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                  {currency}{item.pricePerNight}
                </td>

                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 text-center'>

                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type="checkbox"
                      className='sr-only peer'
                      checked={item.isAvailable}
                      onChange={()=>toggleAvailability(item._id)}
                    />
                    <div className='relative w-12 h-7 bg-slate-300 peer-checked:bg-blue-600 rounded-full transition-colors duration-200'>
                      <span className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${item.isAvailable ? 'translate-x-5' : ''}`}></span>
                    </div>
                  </label>

                  {/* ✅ DELETE BUTTON MOVED HERE */}
                  <button
                    onClick={async()=>{
                      await axios.delete(`/api/rooms/${item._id}`,{
                        headers:{Authorization:`Bearer ${await getToken()}`}
                      });
                      fetchRooms();
                    }}
                    className="text-red-600 ml-3"
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}

export default ListRoom;