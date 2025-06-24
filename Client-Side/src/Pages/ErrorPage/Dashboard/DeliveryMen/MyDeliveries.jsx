import React from "react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const MyDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

//   Fetch Assigned parcelsfor the logged-in DeliveryMan
const {data: MyDeliveryList= []} = useQuery({
    queryKey:['myDeliveryList'],
    queryFn: async () =>{
        const res = await axiosSecure.get(`/myDeliveryList?email= ${user.email}`);
        return res.data;
    }
})

  return (
    <div>
      <h1 className="text 4xl mb-8">My Delivery List</h1>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
                <th>#</th>
              <th>Booked User's Name</th>
              <th>Receiver's Name</th>
              <th>Booked User's Phone</th>
              <th>Requested Delivery Date</th>
              <th>Assigned Delivery Date</th>
              <th>Receiver's Phone</th>
              <th>Receiver's Address</th>
              <th>View Location</th>
              <th>Cancel</th>
              <th>Delivered</th>
            </tr>
          </thead>
          <tbody>
            {  MyDeliveryList.map((user,index)=>{
            
            return(
            <tr>
                <th>{index+1}</th>
                <td>{user.name}</td>
                <td></td>
                <td></td>
            </tr>)}
        
        )}
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDeliveries;
