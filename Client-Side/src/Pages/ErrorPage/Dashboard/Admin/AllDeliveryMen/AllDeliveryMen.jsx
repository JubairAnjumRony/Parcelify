import React from 'react';
// import useDeliveryMen from '../../../../../hooks/useDeliveryMen';
import useUsers from '../../../../../hooks/useUsers';
import useParcels from '../../../../../hooks/useParcels';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../../../hooks/useAxiosSecure';

const AllDeliveryMen = () => {
    const [users] = useUsers(); 
    // const deliveryMen = Array.isArray(users)?users.filter((user)=>user.role === 'deliveryMen'):[];
    const [parcels] = useParcels();
    console.log(users);

    const {data: deliveryMen = []} = useQuery({
        queryKey:["deliveryMen"],
        queryFn: async() =>{
            const res  = await useAxiosSecure.get('/deliveryMenStat',{credentials:'include'});
            return res.data;
        }

    })
    return (
        <div>
            <div className="overflow-x-auto">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
        <th>#</th>
        <th>Name</th>
        <th>Phone Number</th>
        <th>Number of Parcels Delivered</th>
        <th>Average Rating</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
     {
        deliveryMen.map((user,index)=> {
        
         const Myparcels = parcels.filter((parcel)=> parcel.email === user.email);
      return (
        <tr key={user._id}>
        <th>{index+1}</th>
        <td>{user.name}</td>
        <td>{Myparcels.length>0 ? parcels[0].phoneNumber : 'N/A'}</td>
        <td>{user.parcelCount}</td>
        <td>{user.averageReview.toFixed(1)}</td>
        <td></td>
      </tr>
      
      );
  }
)


        
     }
     
    </tbody>
  </table>
</div>
        </div>
    );
};

export default AllDeliveryMen;