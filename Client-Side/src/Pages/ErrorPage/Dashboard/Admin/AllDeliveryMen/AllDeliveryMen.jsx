import React from 'react';
// import useDeliveryMen from '../../../../../hooks/useDeliveryMen';
import useUsers from '../../../../../hooks/useUsers';
import useParcels from '../../../../../hooks/useParcels';

const AllDeliveryMen = () => {
    const [users] = useUsers(); 
    const deliveryMen = Array.isArray(users)?users.filter((user)=>user.role === 'deliveryMen'):[];
    const [parcels,refetch] = useParcels();
    console.log(users);
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
        deliveryMen.map((user,index)=> <tr key={user._id}>
        <th>{index+1}</th>
        <td>{user.name}</td>
        <td>{user.phoneNumber}</td>
        <td>{parcels.length}</td>
        <td></td>
      </tr>)
     }
     
    </tbody>
  </table>
</div>
        </div>
    );
};

export default AllDeliveryMen;